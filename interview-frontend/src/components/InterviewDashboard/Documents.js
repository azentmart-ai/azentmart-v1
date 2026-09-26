import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";

import {
    FiPlus,
    FiSearch,
    FiGrid,
    FiList,
    FiMoreVertical,
    FiEdit3,
    FiUpload,
    FiFileText,
    FiGlobe,
    FiTrash2,
    FiDownload,
    FiEdit2,
    FiUploadCloud,
    FiArrowLeft,
    FiChevronDown,
} from "react-icons/fi";

import "../../Style/YourAIAssistant.css";

const API_URL = "http://localhost:8000";

/* =========================================================
   API FUNCTIONS
========================================================= */

async function getUserDocuments(userId, sourceType = "all", search = "") {
    const params = new URLSearchParams();
    if (sourceType && sourceType !== "all") params.append("source_type", sourceType);
    if (search) params.append("search", search);

    const response = await fetch(`${API_URL}/api/documents/user/${userId}?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to get documents");
    return response.json();
}

async function uploadDocumentFile(userId, file) {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload document");
    return response.json();
}

async function scrapeDocument(userId, url) {
    const response = await fetch(`${API_URL}/api/documents/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, url }),
    });
    if (!response.ok) throw new Error("Failed to scrape document");
    return response.json();
}

async function createManualDocument(userId, title, content) {
    const response = await fetch(`${API_URL}/api/documents/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title, content }),
    });
    if (!response.ok) throw new Error("Failed to create manual document");
    return response.json();
}

async function deleteDocument(docId) {
    const response = await fetch(`${API_URL}/api/documents/${docId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete document");
    return response.json();
}

async function renameDocument(docId, newTitle) {
    const response = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
    });
    if (!response.ok) throw new Error("Failed to rename document");
    return response.json();
}


/* =========================================================
   COMPONENT
========================================================= */

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [sortOption, setSortOption] = useState("newest"); // 'newest', 'oldest', 'az', 'za'
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [addMode, setAddMode] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [scrapeUrl, setScrapeUrl] = useState("");
    const [manualTitle, setManualTitle] = useState("");
    const [manualContent, setManualContent] = useState("");

    const [activeMenuId, setActiveMenuId] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);
    const [renameDoc, setRenameDoc] = useState(null);
    const [newTitle, setNewTitle] = useState("");

    const fileInputRef = useRef(null);

    const tabs = [
        { id: "all", label: "All" },
        { id: "uploaded", label: "Uploaded" },
        { id: "scraped", label: "Scraped" },
        { id: "manual", label: "Created Manually" },
    ];

    const getUser = () => {
        try {
            return JSON.parse(localStorage.getItem("user")) || { id: 1 };
        } catch {
            return { id: 1 };
        }
    };

    const loadDocuments = useCallback(async () => {
        setLoading(true);
        const user = getUser();

        if (user?.id) {
            try {
                const data = await getUserDocuments(user.id, activeTab, searchQuery);
                setDocuments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading documents:", err);
            }
        }
        setLoading(false);
    }, [activeTab, searchQuery]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    useEffect(() => {
        const handleClickOutside = () => {
            setActiveMenuId(null);
            setShowSortDropdown(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const sortedDocuments = [...documents].sort((a, b) => {
        if (sortOption === "newest") {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        } else if (sortOption === "oldest") {
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        } else if (sortOption === "az") {
            return (a.title || "").localeCompare(b.title || "");
        } else if (sortOption === "za") {
            return (b.title || "").localeCompare(a.title || "");
        }
        return 0;
    });

    const resetModal = () => {
        setShowAddModal(false);
        setAddMode(null);
        setScrapeUrl("");
        setManualTitle("");
        setManualContent("");
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const user = getUser();
        try {
            setIsProcessing(true);
            await uploadDocumentFile(user.id, file);
            await loadDocuments();
            resetModal();
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleScrapeSubmit = async () => {
        if (!scrapeUrl.trim()) return alert("Please enter a valid URL");
        const user = getUser();

        try {
            setIsProcessing(true);
            await scrapeDocument(user.id, scrapeUrl);
            await loadDocuments();
            resetModal();
        } catch (err) {
            alert("Scrape failed: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleManualSubmit = async () => {
        if (!manualTitle.trim() || !manualContent.trim()) {
            return alert("Please fill in both title and content");
        }
        const user = getUser();

        try {
            setIsProcessing(true);
            await createManualDocument(user.id, manualTitle, manualContent);
            await loadDocuments();
            resetModal();
        } catch (err) {
            alert("Creation failed: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (docId) => {
        try {
            await deleteDocument(docId);
            await loadDocuments();
            setViewingDoc(null);
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    const handleRenameSubmit = async () => {
        if (!newTitle.trim()) return;
        try {
            setIsProcessing(true);
            await renameDocument(renameDoc.id, newTitle);
            await loadDocuments();
            setRenameDoc(null);
        } catch (err) {
            alert("Rename failed: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = (doc) => {
        if (doc.source_type === "uploaded") {
            window.open(`${API_URL}/api/documents/${doc.id}/download`, "_blank");
        } else {
            const element = document.createElement("a");
            const file = new Blob([doc.content || "No content available."], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = `${doc.title}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    // Database Date Formatter (Falls back safely if created_at is missing)
    const formatDate = (dateString) => {
        if (!dateString) return "RECENT";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "RECENT";
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }).toUpperCase();
    };

    return (
        <div className="yourai-documents-page">
            {/* HEADER */}
            <div className="resume-header">
                <div>
                    <h2>Documents</h2>
                    <p>Add documents for more relevant AI answers.</p>
                </div>

                <div className="resume-header-actions">
                    <button
                        type="button"
                        className="resume-create-manual-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        <FiPlus />
                        <span>Add Document</span>
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div className="resume-tabs-row">
                <div className="resume-tabs-left">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={activeTab === tab.id ? "active" : ""}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <span className="resume-count-tag">
                    {sortedDocuments.length} Documents
                </span>
            </div>

            {/* TOOLBAR */}
            <div className="resume-toolbar-row">
                <div className="resume-search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by documents"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* SORT DROPDOWN CONTAINER */}
                <div className="doc-sort-wrapper">
                    <button
                        type="button"
                        className="resume-sort-btn"
                        title="Sort"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowSortDropdown(!showSortDropdown);
                            setActiveMenuId(null);
                        }}
                    >
                        <span>⇅</span> <FiChevronDown size={12} />
                    </button>

                    {showSortDropdown && (
                        <div className="doc-sort-dropdown" onClick={(e) => e.stopPropagation()}>
                            <button
                                className={`doc-sort-item ${sortOption === "newest" ? "active" : ""}`}
                                onClick={() => { setSortOption("newest"); setShowSortDropdown(false); }}
                            >
                                Newest First
                            </button>
                            <button
                                className={`doc-sort-item ${sortOption === "oldest" ? "active" : ""}`}
                                onClick={() => { setSortOption("oldest"); setShowSortDropdown(false); }}
                            >
                                Oldest First
                            </button>
                            <button
                                className={`doc-sort-item ${sortOption === "az" ? "active" : ""}`}
                                onClick={() => { setSortOption("az"); setShowSortDropdown(false); }}
                            >
                                A to Z
                            </button>
                            <button
                                className={`doc-sort-item ${sortOption === "za" ? "active" : ""}`}
                                onClick={() => { setSortOption("za"); setShowSortDropdown(false); }}
                            >
                                Z to A
                            </button>
                        </div>
                    )}
                </div>

                <div className="resume-view-switcher">
                    <button
                        type="button"
                        className={viewMode === "grid" ? "active" : ""}
                        onClick={() => setViewMode("grid")}
                    >
                        <FiGrid />
                    </button>

                    <button
                        type="button"
                        className={viewMode === "list" ? "active" : ""}
                        onClick={() => setViewMode("list")}
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            {/* DOCUMENT CARDS CONTAINER */}
            {loading ? (
                <div className="resume-upload-empty">
                    <p>Loading documents...</p>
                </div>
            ) : sortedDocuments.length > 0 ? (
                <div className={`resume-cards-container ${viewMode === "list" ? "list-mode" : "grid-mode"}`}>
                    {sortedDocuments.map((doc) => {
                        const isUploaded = doc.source_type === "uploaded";
                        const isScraped = doc.source_type === "scraped";

                        return (
                            <div
                                key={doc.id}
                                className="resume-item-card"
                                onClick={() => setViewingDoc(doc)}
                            >
                                <div className="resume-item-top">
                                    <div className="resume-item-date">
                                        {formatDate(doc.created_at)}
                                    </div>

                                    <div className="doc-menu-wrapper">
                                        <button
                                            type="button"
                                            className="resume-item-menu"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                                                setShowSortDropdown(false);
                                            }}
                                        >
                                            <FiMoreVertical />
                                        </button>

                                        {activeMenuId === doc.id && (
                                            <div className="doc-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className="doc-dropdown-item"
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        handleDownload(doc);
                                                    }}
                                                >
                                                    <FiDownload size={14} /> Download
                                                </button>

                                                <button
                                                    className="doc-dropdown-item"
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        setRenameDoc(doc);
                                                        setNewTitle(doc.title);
                                                    }}
                                                >
                                                    <FiEdit2 size={14} /> Rename
                                                </button>

                                                <button
                                                    className="doc-dropdown-item text-danger"
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        handleDelete(doc.id);
                                                    }}
                                                >
                                                    <FiTrash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h5 className="resume-item-title">
                                    {doc.title || "Untitled Document"}
                                </h5>

                                <div className="resume-item-badge-wrap">
                                    <span className="resume-item-badge">
                                        {isUploaded && <FiUpload size={13} />}
                                        {isScraped && <FiGlobe size={13} />}
                                        {!isUploaded && !isScraped && <FiEdit3 size={13} />}
                                        &nbsp;{doc.source_type}
                                    </span>
                                </div>

                                <div className="resume-item-footer">
                                    <span>
                                        {isUploaded ? "PDF · Document" : "Text Knowledge"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="resume-upload-empty">
                    <h2>No documents found</h2>
                    <p>
                        Upload a document, scrape a website, or create one manually
                        to personalize your AI responses.
                    </p>

                    <div className="resume-empty-actions">
                        <button
                            type="button"
                            className="resume-upload-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            <FiPlus />
                            <span>Add Document</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ADD DOCUMENT MODAL */}
            {showAddModal && (
                <div className="resume-manual-modal-overlay" onClick={resetModal}>
                    <div className="resume-manual-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="resume-manual-modal-close"
                            onClick={resetModal}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        {!addMode && (
                            <>
                                <h2>Add Document</h2>
                                <p>Select how you want to add a knowledge document for the AI.</p>

                                <div className="doc-modal-action-list">
                                    <button
                                        type="button"
                                        className="resume-upload-btn"
                                        onClick={() => setAddMode("upload")}
                                    >
                                        <FiUploadCloud />
                                        <span>Upload File</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="resume-manual-btn"
                                        onClick={() => setAddMode("scrape")}
                                    >
                                        <FiGlobe />
                                        <span>Scrape from URL</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="resume-manual-btn"
                                        onClick={() => setAddMode("manual")}
                                    >
                                        <FiEdit3 />
                                        <span>Create Manually</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {addMode === "upload" && (
                            <>
                                <h2>Upload Document</h2>
                                <p className="doc-modal-subtitle">
                                    Upload documents the AI should reference when generating answers.
                                </p>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.xlsx,.txt,.md"
                                />

                                <div
                                    className="doc-dropzone"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <FiUploadCloud size={44} color="#64748b" className="doc-dropzone-icon" />
                                    <p className="doc-dropzone-title">
                                        {isProcessing ? "Uploading..." : "Drop your documents here or click to browse."}
                                    </p>
                                    <p className="doc-dropzone-types">Supported file types: PDF, DOCX, XLSX, TXT, MD</p>
                                    <p className="doc-dropzone-limit">Up to 10 files, 128 MB each.</p>
                                </div>

                                <div className="doc-modal-footer-btns">
                                    <button
                                        type="button"
                                        className="resume-back-btn"
                                        onClick={() => setAddMode(null)}
                                    >
                                        <FiArrowLeft /> Back
                                    </button>
                                </div>
                            </>
                        )}

                        {addMode === "scrape" && (
                            <>
                                <h2>Scrape from URL</h2>
                                <p>Provide a link and we'll extract the text for the AI.</p>

                                <div className="resume-manual-title-field">
                                    <label>Website Link</label>
                                    <input
                                        type="text"
                                        value={scrapeUrl}
                                        onChange={(e) => setScrapeUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        autoFocus
                                    />
                                </div>

                                <div className="doc-modal-footer-flex">
                                    <button
                                        type="button"
                                        className="resume-back-btn"
                                        onClick={() => setAddMode(null)}
                                    >
                                        <FiArrowLeft /> Back
                                    </button>

                                    <button
                                        type="button"
                                        className="resume-manual-modal-submit"
                                        onClick={handleScrapeSubmit}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "Scraping..." : "Scrape Website"}
                                    </button>
                                </div>
                            </>
                        )}

                        {addMode === "manual" && (
                            <>
                                <h2>Create Manually</h2>
                                <p>Write or paste specific text information for the AI.</p>

                                <div className="resume-manual-title-field">
                                    <label>Document Title</label>
                                    <input
                                        type="text"
                                        value={manualTitle}
                                        onChange={(e) => setManualTitle(e.target.value)}
                                        placeholder="e.g. Project Architecture Details"
                                        autoFocus
                                    />
                                </div>

                                <div className="resume-manual-title-field mt-16">
                                    <label>Content</label>
                                    <textarea
                                        rows="6"
                                        value={manualContent}
                                        onChange={(e) => setManualContent(e.target.value)}
                                        placeholder="Paste your text here..."
                                        className="doc-textarea"
                                    />
                                </div>

                                <div className="doc-modal-footer-flex">
                                    <button
                                        type="button"
                                        className="resume-back-btn"
                                        onClick={() => setAddMode(null)}
                                    >
                                        <FiArrowLeft /> Back
                                    </button>

                                    <button
                                        type="button"
                                        className="resume-manual-modal-submit"
                                        onClick={handleManualSubmit}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "Saving..." : "Save Document"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* VIEW DOCUMENT MODAL */}
            {viewingDoc && (
                <div className="resume-manual-modal-overlay" onClick={() => setViewingDoc(null)}>
                    <div
                        className="resume-manual-modal doc-view-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="resume-manual-modal-close"
                            onClick={() => setViewingDoc(null)}
                        >
                            ×
                        </button>

                        <div className="doc-view-header">
                            <FiFileText size={24} color="#6366f1" />
                            <h2>{viewingDoc.title}</h2>
                        </div>

                        <div className="doc-view-meta">
                            <span className="resume-item-badge text-capitalize">
                                {viewingDoc.source_type}
                            </span>
                            <span className="doc-view-date">
                                Added on {formatDate(viewingDoc.created_at)}
                            </span>
                        </div>

                        {viewingDoc.original_url && (
                            <p className="doc-view-url">
                                URL: <a href={viewingDoc.original_url} target="_blank" rel="noreferrer">{viewingDoc.original_url}</a>
                            </p>
                        )}

                        {viewingDoc.source_type === "uploaded" ? (
                            <div className="doc-preview-wrapper">
                                <h4>Document Preview</h4>
                                <iframe
                                    title="Document Preview"
                                    src={`${API_URL}/api/documents/${viewingDoc.id}/download`}
                                    className="doc-iframe-preview"
                                />
                            </div>
                        ) : (
                            <div className="doc-content-box">
                                <h4>Content / Extraction</h4>
                                {viewingDoc.content ? (
                                    <p className="doc-content-text">{viewingDoc.content}</p>
                                ) : (
                                    <p className="doc-no-content">No text content extracted.</p>
                                )}
                            </div>
                        )}

                        <div className="doc-modal-footer-flex mt-24">
                            <button
                                type="button"
                                className="resume-back-btn text-danger"
                                onClick={() => handleDelete(viewingDoc.id)}
                            >
                                <FiTrash2 /> Delete
                            </button>

                            <button
                                type="button"
                                className="resume-manual-modal-submit"
                                onClick={() => handleDownload(viewingDoc)}
                            >
                                <FiDownload /> Download File
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RENAME MODAL */}
            {renameDoc && (
                <div className="resume-manual-modal-overlay" onClick={() => setRenameDoc(null)}>
                    <div className="resume-manual-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="resume-manual-modal-close"
                            onClick={() => setRenameDoc(null)}
                        >
                            ×
                        </button>

                        <h2>Rename Document</h2>

                        <div className="resume-manual-title-field mt-20">
                            <label>New Title</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="doc-modal-footer-flex mt-24">
                            <button
                                type="button"
                                className="resume-back-btn"
                                onClick={() => setRenameDoc(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="resume-manual-modal-submit"
                                onClick={handleRenameSubmit}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Saving..." : "Rename"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
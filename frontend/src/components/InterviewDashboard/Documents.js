import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    FiPlus, FiSearch, FiUploadCloud, FiGlobe, FiEdit3,
    FiGrid, FiList, FiMoreVertical, FiUpload, FiArrowLeft,
    FiDownload, FiTrash2, FiEdit2, FiFileText
} from "react-icons/fi";

const API_URL = "http://localhost:8000";

/* =====================================================
   API FUNCTIONS
===================================================== */
export async function getUserDocuments(userId, sourceType = "all", search = "") {
    const params = new URLSearchParams();
    if (sourceType && sourceType !== "all") params.append("source_type", sourceType);
    if (search) params.append("search", search);
    const response = await fetch(`${API_URL}/api/documents/user/${userId}?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to get documents");
    return response.json();
}

export async function uploadDocumentFile(userId, file) {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", file);
    const response = await fetch(`${API_URL}/api/documents/upload`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Failed to upload document");
    return response.json();
}

export async function scrapeDocument(userId, url) {
    const response = await fetch(`${API_URL}/api/documents/scrape`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, url: url }),
    });
    if (!response.ok) throw new Error("Failed to scrape document");
    return response.json();
}

export async function createManualDocument(userId, title, content) {
    const response = await fetch(`${API_URL}/api/documents/manual`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title: title, content: content }),
    });
    if (!response.ok) throw new Error("Failed to create manual document");
    return response.json();
}

export async function deleteDocument(docId) {
    const response = await fetch(`${API_URL}/api/documents/${docId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete document");
    return response.json();
}

export async function renameDocument(docId, newTitle) {
    const response = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
    });
    if (!response.ok) throw new Error("Failed to rename document");
    return response.json();
}

/* =====================================================
   COMPONENT
===================================================== */
const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const [showAddModal, setShowAddModal] = useState(false);
    const [addMode, setAddMode] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [scrapeUrl, setScrapeUrl] = useState("");
    const [manualTitle, setManualTitle] = useState("");
    const [manualContent, setManualContent] = useState("");

    // View & Dropdown States
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);
    const [renameDoc, setRenameDoc] = useState(null);
    const [newTitle, setNewTitle] = useState("");

    const fileInputRef = useRef(null);
    const userId = 1; // TODO: Dynamic User ID

    const tabs = [
        { id: "all", label: "All" }, { id: "uploaded", label: "Uploaded" },
        { id: "scraped", label: "Scraped" }, { id: "manual", label: "Created Manually" },
    ];

    const loadDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserDocuments(userId, activeTab, searchQuery);
            setDocuments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchQuery]);

    useEffect(() => { loadDocuments(); }, [loadDocuments]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            setIsProcessing(true);
            await uploadDocumentFile(userId, file);
            await loadDocuments();
            setShowAddModal(false);
            setAddMode(null);
        } catch (error) { alert(error.message); }
        finally { setIsProcessing(false); event.target.value = null; }
    };

    const handleScrapeSubmit = async () => {
        if (!scrapeUrl.trim()) return alert("Please enter a URL");
        try {
            setIsProcessing(true);
            await scrapeDocument(userId, scrapeUrl);
            await loadDocuments();
            setShowAddModal(false); setAddMode(null); setScrapeUrl("");
        } catch (error) { alert(error.message); }
        finally { setIsProcessing(false); }
    };

    const handleManualSubmit = async () => {
        if (!manualTitle.trim() || !manualContent.trim()) return alert("Please fill both Title and Content");
        try {
            setIsProcessing(true);
            await createManualDocument(userId, manualTitle, manualContent);
            await loadDocuments();
            setShowAddModal(false); setAddMode(null); setManualTitle(""); setManualContent("");
        } catch (error) { alert(error.message); }
        finally { setIsProcessing(false); }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;
        try {
            await deleteDocument(docId);
            await loadDocuments();
            setViewingDoc(null);
        } catch (error) { alert(error.message); }
    };

    const handleRenameSubmit = async () => {
        if (!newTitle.trim()) return;
        try {
            setIsProcessing(true);
            await renameDocument(renameDoc.id, newTitle);
            await loadDocuments();
            setRenameDoc(null);
        } catch (error) { alert(error.message); }
        finally { setIsProcessing(false); }
    };

    const handleDownload = (doc) => {
        if (doc.source_type === "uploaded") {
            window.open(`${API_URL}/api/documents/${doc.id}/download`, "_blank");
        } else {
            const element = document.createElement("a");
            const file = new Blob([doc.content || "No content extracted yet."], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `${doc.title}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
    };

    return (
        <div className="yourai-documents-page">
            <div className="resume-header">
                <div><h2>Knowledge Documents</h2><p>Add documents for more relevant AI answers.</p></div>
                <div className="resume-header-actions">
                    <button type="button" className="resume-create-manual-btn" onClick={() => setShowAddModal(true)}>
                        <FiPlus /><span>Add Document</span>
                    </button>
                </div>
            </div>

            <div className="resume-tabs-row">
                <div className="resume-tabs-left">
                    {tabs.map((tab) => (
                        <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <span className="resume-count-tag">{documents.length} Documents</span>
            </div>

            <div className="resume-toolbar-row">
                <div className="resume-search-box">
                    <FiSearch />
                    <input type="text" placeholder="Search by documents" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="resume-view-switcher">
                    <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}><FiGrid /></button>
                    <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}><FiList /></button>
                </div>
            </div>

            {loading ? (
                <div className="resume-upload-empty"><p>Loading documents...</p></div>
            ) : documents.length > 0 ? (
                <div className={`resume-cards-container ${viewMode === "list" ? "list-mode" : "grid-mode"}`}>
                    {documents.map((doc) => (
                        <div key={doc.id} className="resume-item-card" onClick={() => setViewingDoc(doc)}>
                            <div className="resume-item-top">
                                <div className="resume-item-date">{formatDate(doc.created_at)}</div>
                                <div style={{ position: "relative" }}>
                                    <button className="resume-item-menu" onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === doc.id ? null : doc.id); }}>
                                        <FiMoreVertical />
                                    </button>

                                    {/* DROPDOWN MENU */}
                                    {activeMenuId === doc.id && (
                                        <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "140px", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
                                            <button style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", color: "#334155", textAlign: "left" }} onClick={() => { setActiveMenuId(null); handleDownload(doc); }}>
                                                <FiDownload size={14} /> Download
                                            </button>
                                            <button style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", color: "#334155", textAlign: "left" }} onClick={() => { setActiveMenuId(null); setRenameDoc(doc); setNewTitle(doc.title); }}>
                                                <FiEdit2 size={14} /> Rename
                                            </button>
                                            <button style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", color: "#ef4444", textAlign: "left", borderTop: "1px solid #f1f5f9" }} onClick={() => { setActiveMenuId(null); handleDelete(doc.id); }}>
                                                <FiTrash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h5 className="resume-item-title">{doc.title}</h5>
                            <div className="resume-item-badge-wrap">
                                <span className="resume-item-badge" style={{ textTransform: 'capitalize' }}>
                                    {doc.source_type === "uploaded" && <FiUpload size={13} />}
                                    {doc.source_type === "scraped" && <FiGlobe size={13} />}
                                    {doc.source_type === "manual" && <FiEdit3 size={13} />}
                                    {doc.source_type}
                                </span>
                            </div>
                            <div className="resume-item-footer">
                                <span>{doc.source_type === "uploaded" ? "File Document" : "Text Knowledge"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="resume-upload-empty">
                    <h2>No documents found</h2>
                    <p>Upload a document, scrape a website, or create one manually.</p>
                    <button type="button" className="resume-upload-btn" onClick={() => setShowAddModal(true)}><FiPlus /><span>Add Document</span></button>
                </div>
            )}

            {/* =====================================================
                VIEW DOCUMENT MODAL
            ===================================================== */}
            {viewingDoc && (
                <div className="resume-manual-modal-overlay" onClick={() => setViewingDoc(null)}>
                    <div className="resume-manual-modal" style={{ maxWidth: '700px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="resume-manual-modal-close" onClick={() => setViewingDoc(null)}>×</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <FiFileText size={24} color="#6366f1" />
                            <h2 style={{ margin: 0 }}>{viewingDoc.title}</h2>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <span className="resume-item-badge" style={{ textTransform: 'capitalize' }}>{viewingDoc.source_type}</span>
                            <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '12px' }}>Added on {formatDate(viewingDoc.created_at)}</span>
                        </div>

                        {viewingDoc.original_url && (
                            <p style={{ fontSize: '13px', color: '#0ea5e9', marginBottom: '16px' }}>URL: <a href={viewingDoc.original_url} target="_blank" rel="noreferrer">{viewingDoc.original_url}</a></p>
                        )}

                        {/* DISPLAY ACTUAL UPLOADED DOCUMENT OR TEXT CONTENT */}
                        {viewingDoc.source_type === "uploaded" ? (
                            <div style={{ marginTop: '16px' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', color: '#334155' }}>Document Preview</h4>
                                <iframe
                                    title="Document Preview"
                                    src={`${API_URL}/api/documents/${viewingDoc.id}/download`}
                                    style={{ width: '100%', height: '400px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                            </div>
                        ) : (
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '200px' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', color: '#334155' }}>Content / Extraction</h4>
                                {viewingDoc.content ? (
                                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', whiteSpace: 'pre-wrap' }}>{viewingDoc.content}</p>
                                ) : (
                                    <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>No text content has been extracted for this document yet.</p>
                                )}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                            <button className="resume-back-btn" onClick={() => handleDelete(viewingDoc.id)} style={{ flex: 1, justifyContent: "center", color: '#ef4444' }}>
                                <FiTrash2 /> Delete
                            </button>
                            <button className="resume-manual-modal-submit" onClick={() => handleDownload(viewingDoc)} style={{ flex: 1, marginTop: 0 }}>
                                <FiDownload /> Download File
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                RENAME MODAL
            ===================================================== */}
            {renameDoc && (
                <div className="resume-manual-modal-overlay" onClick={() => setRenameDoc(null)}>
                    <div className="resume-manual-modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="resume-manual-modal-close" onClick={() => setRenameDoc(null)}>×</button>
                        <h2>Rename Document</h2>
                        <div className="resume-manual-title-field" style={{ marginTop: '20px' }}>
                            <label>New Title</label>
                            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
                        </div>
                        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                            <button className="resume-back-btn" onClick={() => setRenameDoc(null)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
                            <button className="resume-manual-modal-submit" onClick={handleRenameSubmit} disabled={isProcessing} style={{ flex: 1, marginTop: 0 }}>
                                {isProcessing ? "Saving..." : "Rename"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                ADD DOCUMENT MODAL
            ===================================================== */}
            {showAddModal && (
                <div className="resume-manual-modal-overlay" onClick={() => { setShowAddModal(false); setAddMode(null); }}>
                    <div className="resume-manual-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="resume-manual-modal-close" onClick={() => { setShowAddModal(false); setAddMode(null); }}>×</button>

                        {/* STEP 1: SELECT METHOD */}
                        {!addMode && (
                            <>
                                <h2>Add Document</h2><p>Select how you want to add a knowledge document.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
                                    <button className="resume-upload-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setAddMode("upload")}>
                                        <FiUploadCloud /> <span>Upload File</span>
                                    </button>
                                    <button className="resume-manual-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setAddMode("scrape")}>
                                        <FiGlobe /> <span>Scrape from URL</span>
                                    </button>
                                    <button className="resume-manual-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setAddMode("manual")}>
                                        <FiEdit3 /> <span>Create Manually</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 2A: UPLOAD FILE WITH SPECIFIC DESIGN */}
                        {addMode === "upload" && (
                            <>
                                <h2>Upload Document</h2>
                                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Upload documents the AI should reference when generating answers.</p>

                                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} accept=".pdf,.doc,.docx,.xlsx,.txt,.md" />

                                {/* DRAG AND DROP BOX UI */}
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    style={{
                                        border: '2px dashed #cbd5e1',
                                        padding: '40px 20px',
                                        textAlign: 'center',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: '#f8fafc',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                                >
                                    <FiUploadCloud size={44} color="#64748b" style={{ marginBottom: '12px' }} />
                                    <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#334155', fontSize: '15px' }}>
                                        {isProcessing ? "Uploading..." : "Drop your documents here or click to browse."}
                                    </p>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Supported file types: PDF, DOCX, XLSX, TXT, MD</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Up to 10 files, 128 MB each.</p>
                                </div>

                                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                                    <button className="resume-back-btn" onClick={() => setAddMode(null)} style={{ flex: 1, justifyContent: "center" }}><FiArrowLeft /> Back</button>
                                </div>
                            </>
                        )}

                        {/* STEP 2B: SCRAPE URL */}
                        {addMode === "scrape" && (
                            <>
                                <h2>Scrape from URL</h2><p>Provide a link and we'll extract the text.</p>
                                <div className="resume-manual-title-field" style={{ marginTop: '20px' }}><label>Website Link</label><input type="text" value={scrapeUrl} onChange={(e) => setScrapeUrl(e.target.value)} placeholder="https://example.com" autoFocus /></div>
                                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}><button className="resume-back-btn" onClick={() => setAddMode(null)} style={{ flex: 1, justifyContent: "center" }}><FiArrowLeft /> Back</button><button className="resume-manual-modal-submit" onClick={handleScrapeSubmit} disabled={isProcessing} style={{ flex: 2, marginTop: 0 }}>{isProcessing ? "Scraping..." : "Scrape Website"}</button></div>
                            </>
                        )}

                        {/* STEP 2C: CREATE MANUALLY */}
                        {addMode === "manual" && (
                            <>
                                <h2>Create Manually</h2><p>Write or paste specific text information.</p>
                                <div className="resume-manual-title-field" style={{ marginTop: '20px' }}><label>Document Title</label><input type="text" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} placeholder="e.g. Project Details" autoFocus /></div>
                                <div className="resume-manual-title-field" style={{ marginTop: '16px' }}><label>Content</label><textarea rows="6" value={manualContent} onChange={(e) => setManualContent(e.target.value)} placeholder="Paste your text here..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} /></div>
                                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}><button className="resume-back-btn" onClick={() => setAddMode(null)} style={{ flex: 1, justifyContent: "center" }}><FiArrowLeft /> Back</button><button className="resume-manual-modal-submit" onClick={handleManualSubmit} disabled={isProcessing} style={{ flex: 2, marginTop: 0 }}>{isProcessing ? "Saving..." : "Save Document"}</button></div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
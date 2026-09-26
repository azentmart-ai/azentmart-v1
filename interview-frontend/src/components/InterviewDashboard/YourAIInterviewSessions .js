import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
  FiX,
  FiBriefcase,
  FiPhone,
  FiFileText,
  FiInfo,
  FiVideo,
  FiChevronDown,
  FiGlobe,
  FiArrowRight,
  FiClock,
  FiCreditCard,
  FiExternalLink,
} from "react-icons/fi";

import {
  connectInterviewCopilot,
  createInterviewSession,
  getUserResumes,
  uploadResumeFile,
} from "../../services/interviewApi";

const YourAIInterviewSessions = ({ setActivePage }) => {
  // =====================================================
  // MODAL STATES
  // =====================================================

  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showRealInterview, setShowRealInterview] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Resume selector state for Create Session
  const [showResumeSelector, setShowResumeSelector] = useState(false);
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const [availableResumes, setAvailableResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const resumeUploadInputRef = useRef(null);

  // Documents selector state for Create Session (Added)
  const [showDocSelector, setShowDocSelector] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // =====================================================
  // LIVE INTERVIEW STATE
  // =====================================================

  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [manualQuestion, setManualQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  const [selectedMeeting, setSelectedMeeting] =
    useState("Google Meet");

  const [sharedStream, setSharedStream] = useState(null);

  // =====================================================
  // PICTURE-IN-PICTURE (PiP) FLOATING SCREEN STATE
  // =====================================================

  const [isPiPActive, setIsPiPActive] = useState(false);
  const pipWindowRef = useRef(null);

  const recognitionRef = useRef(null);
  const isConnectedRef = useRef(false);
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);


  // =====================================================
  // CREATE SESSION FORM & SESSIONS LIST
  // =====================================================

  const [activeTab, setActiveTab] = useState("all");
  const [sessionsList, setSessionsList] = useState([]);

  const [sessionType, setSessionType] =
    useState("interview");

  const [company, setCompany] = useState("");

  const [jobDescription, setJobDescription] =
    useState("");

  const [model, setModel] =
    useState("Gemini 3.1 Flash Lite");

  const [language, setLanguage] =
    useState("English");

  const [resumeAdded, setResumeAdded] =
    useState(false);

  const [documentsAdded, setDocumentsAdded] =
    useState(false);

  const [extraContextAdded, setExtraContextAdded] =
    useState(false);

  const [autoAnswer, setAutoAnswer] =
    useState(false);

  const [saveTranscript, setSaveTranscript] =
    useState(false);

  // =====================================================
  // LOAD SESSIONS ON MOUNT
  // =====================================================

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  };

  const loadUserSessions = async () => {
    const user = getUser();
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:8000/api/interviews/user/${user.id}`);
      const data = await res.json();
      setSessionsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load interview sessions:", err);
    }
  };

  useEffect(() => {
    loadUserSessions();
  }, []);

  // =====================================================
  // OPEN CREATE SESSION
  // =====================================================

  const openCreateSession = () => {
    setShowCreateSession(true);
    setShowRealInterview(false);
    setShowConnectModal(false);
  };

  // =====================================================
  // CLOSE CREATE SESSION
  // =====================================================

  const closeCreateSession = () => {
    setShowCreateSession(false);
  };

  // =====================================================
  // RESUME SELECTOR
  // =====================================================

  const loadAvailableResumes = async () => {
    setLoadingResumes(true);

    try {
      const user = getUser();

      if (!user?.id) {
        setAvailableResumes([]);
        return;
      }

      const data = await getUserResumes(user.id);
      setAvailableResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load resumes:", err);
      setAvailableResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  };

  const openResumeSelector = async () => {
    setResumeDropdownOpen(false);
    setShowResumeSelector(true);
    await loadAvailableResumes();
  };

  const closeResumeSelector = () => {
    setShowResumeSelector(false);
    setResumeDropdownOpen(false);
  };

  const handleSelectResume = (resume) => {
    setSelectedResume(resume);
    setResumeAdded(true);
    setResumeDropdownOpen(false);
  };

  const handleRemoveResume = () => {
    setSelectedResume(null);
    setResumeAdded(false);
    setResumeDropdownOpen(false);
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const user = getUser();

    if (!user?.id) {
      alert("Please log in before uploading a resume.");
      event.target.value = "";
      return;
    }

    setUploadingResume(true);

    try {
      const uploaded = await uploadResumeFile(user.id, file);
      await loadAvailableResumes();

      const uploadedResumeId = uploaded?.resume_id || uploaded?.id;
      const uploadedResume = uploadedResumeId
        ? {
          ...uploaded,
          id: uploadedResumeId,
          title:
            uploaded?.title ||
            uploaded?.filename ||
            file.name.replace(/\.[^/.]+$/, ""),
        }
        : null;

      if (uploadedResume) {
        setSelectedResume(uploadedResume);
        setResumeAdded(true);
        setResumeDropdownOpen(false);
      } else {
        const refreshed = await getUserResumes(user.id);
        const resumes = Array.isArray(refreshed) ? refreshed : [];
        setAvailableResumes(resumes);

        const matchingResume =
          resumes.find(
            (resume) =>
              resume.filename === file.name ||
              resume.title === file.name.replace(/\.[^/.]+$/, "")
          ) || resumes[0];

        if (matchingResume) {
          handleSelectResume(matchingResume);
        }
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
      alert("Failed to upload resume: " + err.message);
    } finally {
      setUploadingResume(false);
      event.target.value = "";
    }
  };

  // =====================================================
  // DOCUMENTS SELECTOR (Added)
  // =====================================================

  const loadAvailableDocuments = async () => {
    setLoadingDocs(true);
    try {
      const user = getUser();
      if (!user?.id) return;
      const res = await fetch(`http://localhost:8000/api/documents/user/${user.id}`);
      const data = await res.json();
      setAvailableDocs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const openDocSelector = async () => {
    setShowDocSelector(true);
    await loadAvailableDocuments();
  };

  const handleToggleDocSelection = (doc) => {
    setSelectedDocs((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      if (exists) {
        const filtered = prev.filter((d) => d.id !== doc.id);
        if (filtered.length === 0) setDocumentsAdded(false);
        return filtered;
      } else {
        setDocumentsAdded(true);
        return [...prev, doc];
      }
    });
  };

  // =====================================================
  // CREATE SESSION (With 4 Free Sessions Limit & IDs)
  // =====================================================

  const handleCreateSession = async () => {
    if (!company.trim() || !jobDescription.trim() || !resumeAdded) {
      return;
    }

    setCreatingSession(true);

    try {
      const user = getUser();
      const userId = user ? user.id : 1;

      const session = await createInterviewSession({
        user_id: userId,
        company: company.trim(),
        job_description: jobDescription.trim(),
        session_type: sessionType,
        model: model,
        language: language,
        resume_added: resumeAdded,
        resume_id: selectedResume?.id || null,
        resume_title: selectedResume?.title || null,
        documents_added: documentsAdded,
        document_ids: selectedDocs.map((d) => d.id),
        extra_context_added: extraContextAdded,
        auto_answer: autoAnswer,
        save_transcript: saveTranscript,
        status: "active",
      });

      setSessionId(session.id);
      setShowCreateSession(false);
      setShowRealInterview(true);
      await loadUserSessions();
    } catch (err) {
      console.error("Failed to create session:", err);
      if (err.message && (err.message.includes("403") || err.message.includes("free limit"))) {
        alert("Free limit reached! You have used all 4 free sessions. Redirecting to Upgrade page.");
        if (setActivePage) setActivePage("upgrade");
      } else {
        alert("Failed to create session: " + err.message);
      }
    } finally {
      setCreatingSession(false);
    }
  };

  // =====================================================
  // REAL INTERVIEW -> BACK
  // =====================================================

  const handleBackToCreateSession = () => {
    setShowRealInterview(false);
    setShowCreateSession(true);
  };

  // =====================================================
  // ACTIVATE FREE
  // =====================================================

  const handleActivateFree = () => {
    setShowRealInterview(false);
    setShowConnectModal(true);
  };

  // =====================================================
  // BUY CREDITS
  // =====================================================

  const handleBuyCredits = () => {
    if (setActivePage) setActivePage("upgrade");
  };

  // =====================================================
  // OPEN DOCUMENT PICTURE-IN-PICTURE (BIGGER & SCROLLABLE UI)
  // =====================================================

  const openDocumentPiP = async () => {
    if (!('documentPictureInPicture' in window)) {
      alert("Picture-in-Picture is not supported in this browser. Please use Google Chrome.");
      return;
    }

    try {
      if (isPiPActive && pipWindowRef.current) {
        return;
      }

      // Much larger PiP window size (width: 600px, height: 560px)
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 1000,
        height: 500,
      });

      pipWindowRef.current = pipWindow;
      setIsPiPActive(true);

      // Copy main stylesheets
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          const cssRules = Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
          const style = pipWindow.document.createElement("style");
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = pipWindow.document.createElement("link");
          link.rel = "stylesheet";
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      });

      // Custom PiP styles with custom custom scrollbar and bigger readable text
      const customStyle = pipWindow.document.createElement("style");
      customStyle.textContent = `
        body { 
          background: #090d16 !important; 
          color: #f1f5f9 !important; 
          margin: 0; 
          padding: 16px; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          overflow: hidden; 
        }
        
        .pip-main-wrapper { 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          height: 100%; 
          box-sizing: border-box; 
        }

        /* Top Pill Toolbar */
        .pip-topbar { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          background: rgba(17, 24, 39, 0.75); 
          backdrop-filter: blur(12px);
          padding: 8px 12px; 
          border-radius: 32px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .pip-pill-btn { 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          background: rgba(31, 41, 55, 0.8); 
          border: 1px solid rgba(255, 255, 255, 0.06); 
          color: #e2e8f0; 
          padding: 7px 12px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: 500; 
          cursor: pointer; 
          transition: all 0.2s ease;
        }
        .pip-pill-btn:hover {
          background: #374151;
          border-color: rgba(56, 189, 248, 0.3);
        }
        .pip-pill-btn kbd { 
          background: #0b0f19; 
          color: #94a3b8; 
          padding: 2px 5px; 
          border-radius: 4px; 
          font-size: 10px; 
          border: 1px solid #374151; 
        }

        .pip-icon-btn { 
          background: rgba(31, 41, 55, 0.8); 
          border: 1px solid rgba(255, 255, 255, 0.06); 
          color: #e2e8f0; 
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 14px; 
          transition: all 0.2s ease;
        }
        .pip-icon-btn:hover {
          background: #374151;
        }
        .pip-close-x { 
          background: rgba(239, 68, 68, 0.2) !important; 
          border-color: rgba(239, 68, 68, 0.4) !important;
          color: #fca5a5 !important; 
        }
        .pip-close-x:hover {
          background: #ef4444 !important;
          color: #ffffff !important;
        }
        
        /* Sections / Cards */
        .pip-section { 
          background: rgba(17, 24, 39, 0.6); 
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 14px; 
          padding: 12px; 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }
        
        .pip-label { 
          color: #38bdf8; 
          font-size: 11px; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.8px; 
        }
        
        .pip-scroll { 
          max-height: 85px; 
          overflow-y: auto; 
          color: #94a3b8; 
          font-size: 13.5px; 
          line-height: 1.5; 
        }
        
        .pip-answer-box { 
          flex-grow: 1; 
          overflow-y: auto; 
          max-height: 230px; 
          border-color: rgba(56, 189, 248, 0.15);
          background: linear-gradient(145deg, rgba(17, 24, 39, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
        }
        
        .pip-answer-text { 
          color: #f8fafc; 
          font-size: 14.5px; 
          line-height: 1.6; 
          font-weight: 400; 
        }

        /* Custom Modern Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        /* Input Box */
        .pip-input-box { 
          display: flex; 
          align-items: center; 
          background: rgba(17, 24, 39, 0.8); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          border-radius: 14px; 
          padding: 8px 12px; 
          gap: 10px; 
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .pip-main-input { 
          flex-grow: 1; 
          background: transparent; 
          border: none; 
          color: #ffffff; 
          font-size: 13.5px; 
          outline: none; 
        }
        .pip-main-input::placeholder { 
          color: #64748b; 
        }
        
        .pip-send-btn { 
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%); 
          border: none; 
          color: white; 
          padding: 7px 14px; 
          border-radius: 8px; 
          cursor: pointer; 
          font-size: 12px; 
          font-weight: 600; 
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
          transition: all 0.2s ease;
        }
        .pip-send-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `;
      pipWindow.document.head.appendChild(customStyle);

      const container = pipWindow.document.createElement("div");
      container.className = "pip-main-wrapper";
      container.innerHTML = `
        <div class="pip-topbar">
          <button class="pip-pill-btn" id="pip-btn-answer"><span>Answer</span> <kbd>⌘ ↵</kbd></button>
          <button class="pip-pill-btn" id="pip-clear"><span>Clear Transcript</span></button>
          <div style="flex-grow: 1;"></div>
          <button class="pip-icon-btn" id="pip-min" title="Minimize / Expand">🗕</button>
          <button class="pip-icon-btn pip-close-x" id="pip-close" title="End Call & Close">✕</button>
        </div>

        <div class="pip-section">
          <span class="pip-label">💬 Transcript / Question</span>
          <div id="pip-question" class="pip-scroll">${transcript || "Waiting for question..."}</div>
        </div>

        <div class="pip-section pip-answer-box">
          <span class="pip-label">⭐ AI Answer</span>
          <div id="pip-answer" class="pip-answer-text">${aiAnswer || "AI answer will appear here..."}</div>
        </div>

        <div class="pip-input-box">
          <input id="pip-input" class="pip-main-input" type="text" placeholder="Type a manual question to LLM..." />
          <button class="pip-send-btn" id="pip-send">Send</button>
        </div>
      `;

      pipWindow.document.body.appendChild(container);

      // X button ends the call and closes window
      pipWindow.document.getElementById("pip-close").addEventListener("click", () => {
        stopLiveInterview();
      });

      let isMin = false;
      pipWindow.document.getElementById("pip-min").addEventListener("click", () => {
        isMin = !isMin;
        const qBox = pipWindow.document.getElementById("pip-question").parentElement;
        const aBox = pipWindow.document.getElementById("pip-answer").parentElement;
        const iBox = pipWindow.document.getElementById("pip-input").parentElement;
        qBox.style.display = isMin ? "none" : "flex";
        aBox.style.display = isMin ? "none" : "flex";
        iBox.style.display = isMin ? "none" : "flex";
        pipWindow.resizeTo(600, isMin ? 90 : 560);
      });

      pipWindow.document.getElementById("pip-clear").addEventListener("click", () => {
        clearTranscript();
      });

      const handlePiPSend = () => {
        const inputElem = pipWindow.document.getElementById("pip-input");
        const val = inputElem?.value?.trim();
        if (val && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "manual_question", question: val }));
          inputElem.value = "";
        }
      };

      pipWindow.document.getElementById("pip-send").addEventListener("click", handlePiPSend);
      pipWindow.document.getElementById("pip-btn-answer").addEventListener("click", () => {
        generateAnswer();
      });
      pipWindow.document.getElementById("pip-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handlePiPSend();
      });

      pipWindow.addEventListener("unload", () => {
        setIsPiPActive(false);
        pipWindowRef.current = null;
        if (isConnected) {
          stopLiveInterview();
        }
      });

    } catch (err) {
      console.error("Failed to open PiP window:", err);
    }
  };

  // Synchronize PiP content in real-time
  useEffect(() => {
    if (isPiPActive && pipWindowRef.current) {
      try {
        const qElem = pipWindowRef.current.document.getElementById("pip-question");
        const aElem = pipWindowRef.current.document.getElementById("pip-answer");
        if (qElem) qElem.textContent = transcript || "Waiting for question...";
        if (aElem) aElem.textContent = aiAnswer || "AI answer will appear here...";
      } catch (e) { }
    }
  }, [transcript, aiAnswer, isPiPActive]);

  // =====================================================
  // CONNECT TAB
  // =====================================================

  const handleConnectTab = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert(
          "Screen sharing is not supported in this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "browser" },
          audio: true,
        });

      setSharedStream(stream);

      // Open WebSocket before showing interview UI
      if (sessionId) {
        const socket = connectInterviewCopilot(
          sessionId,
          (data) => {
            if (data.type === "ai_answer") {
              setAiAnswer(data.answer || "");
            }
          },
          (err) => {
            console.error("WebSocket error:", err);
          },
          () => {
            console.log("WebSocket closed");
          }
        );
        socketRef.current = socket;
      }

      setShowConnectModal(false);
      setIsConnected(true);

      isConnectedRef.current = true;

      // Start listening after tab share
      startListening();

      // Automatically launch the floating PiP window over all apps
      setTimeout(() => {
        openDocumentPiP();
      }, 500);

      const videoTrack =
        stream.getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.onended = () => {
          stopLiveInterview();
        };
      }
    } catch (error) {
      console.log(
        "Screen sharing cancelled:",
        error
      );
    }
  };

  // =====================================================
  // START SPEECH RECOGNITION (Duplicate Filtered)
  // =====================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscript(
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    if (recognitionRef.current) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      language === "English"
        ? "en-US"
        : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }

      if (finalText.trim()) {
        const text = finalText.trim();

        // Prevent duplicate consecutive appending
        setTranscript((previous) => {
          if (previous.endsWith(text)) return previous;
          return previous ? `${previous} ${text}` : text;
        });

        // Send finalized speech to AI via WebSocket
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({ type: "transcript", text })
          );
        }
      }
    };

    recognition.onerror = (event) => {
      console.log(
        "Speech recognition error:",
        event.error
      );
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);

      // Restart while interview is active.
      if (isConnectedRef.current) {
        setTimeout(() => {
          if (isConnectedRef.current) {
            startListening();
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.log(
        "Could not start recognition:",
        error
      );

      recognitionRef.current = null;
    }
  };

  // =====================================================
  // STOP LISTENING
  // =====================================================

  const stopListening = () => {
    isConnectedRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(error);
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // =====================================================
  // STOP COMPLETE INTERVIEW
  // =====================================================

  const stopLiveInterview = () => {
    stopListening();

    if (pipWindowRef.current) {
      pipWindowRef.current.close();
      pipWindowRef.current = null;
    }

    // Gracefully end the WebSocket session
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify({ type: "end" })
      );
      socketRef.current.close();
    }
    socketRef.current = null;

    if (sharedStream) {
      sharedStream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    setSharedStream(null);
    setIsConnected(false);
    setShowConnectModal(false);
    setIsPiPActive(false);
  };

  // =====================================================
  // CLEAR TRANSCRIPT
  // =====================================================

  const clearTranscript = () => {
    setTranscript("");
  };

  // =====================================================
  // GENERATE AI ANSWER — sends manual question via WebSocket
  // =====================================================

  const generateAnswer = useCallback(() => {
    const question = manualQuestion.trim();

    if (!question) {
      return;
    }

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify({ type: "manual_question", question })
      );
      setManualQuestion("");
    } else {
      console.warn(
        "WebSocket not connected — cannot send question."
      );
    }
  }, [manualQuestion]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="yourai-sessions-page">

      {/* =================================================
          INTERVIEW SESSIONS HEADER
      ================================================= */}

      <div className="yourai-session-header">

        <div>
          <h2>
            Interview Sessions
          </h2>

          <p>
            Prepare for interviews and review
            your previous AI interview sessions.
          </p>
        </div>

        <button
          className="yourai-create-session-btn"
          onClick={openCreateSession}
        >
          <FiPlus />

          <span>
            Create Session
          </span>
        </button>

      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="yourai-session-tabs">
        <div className="yourai-tabs-left">
          <button
            type="button"
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            type="button"
            className={activeTab === "active" ? "active" : ""}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>

          <button
            type="button"
            className={activeTab === "ended" ? "active" : ""}
            onClick={() => setActiveTab("ended")}
          >
            Ended
          </button>
        </div>

        <span className="yourai-total-sessions">
          {sessionsList.length} Sessions
        </span>
      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="yourai-session-toolbar">

        <div className="yourai-search-box">

          <FiSearch />

          <input
            type="text"
            placeholder="Search by title or description"
          />

        </div>

        <button className="yourai-sort-btn">
          ⇅
        </button>

        <div className="yourai-view-buttons">

          <button className="active">
            <FiGrid />
          </button>

          <button>
            <FiList />
          </button>

        </div>

      </div>


      {/* =================================================
          SESSION LISTING OR EMPTY STATE
      ================================================= */}

      {sessionsList.length === 0 ? (
        <div className="yourai-empty-state">

          <h2>
            You have no upcoming sessions
          </h2>

          <p>
            Your upcoming interview sessions
            will appear here once you create one.
          </p>

          <button
            className="yourai-create-session-btn"
            onClick={openCreateSession}
          >
            <FiPlus />

            <span>
              Create Session
            </span>
          </button>

        </div>
      ) : (
        <div
          className="yourai-sessions-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 340px))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {sessionsList
            .filter((s) => (activeTab === "all" ? true : s.status === activeTab))
            .map((session) => (
              <div
                key={session.id}
                className="yourai-session-card"
                style={{
                  background: "#ffffff",
                  color: "#1e293b",
                  padding: "22px 24px",
                  borderRadius: "18px",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "160px",
                  position: "relative",
                  boxSizing: "border-box"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {session.created_at ? new Date(session.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() : "AUG 26, 2026"}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "#1e293b", lineHeight: "1.3" }}>
                    {session.company}
                  </h3>
                  <div style={{ marginBottom: "16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f1f5f9", color: "#475569", fontSize: "12.5px", fontWeight: "600", padding: "6px 12px", borderRadius: "8px" }}>
                      <FiBriefcase size={12} /> {session.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #f1f5f9", fontSize: "13px", color: "#1e293b", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Model: {session.model || "Gemini"}</span>
                  <span>{session.language || "English"}</span>
                </div>
              </div>
            ))}
        </div>
      )}


      {/* =================================================
          CREATE SESSION MODAL
      ================================================= */}

      {showCreateSession && (
        <div
          className="yourai-modal-overlay"
          onClick={closeCreateSession}
        >
          <div
            className="yourai-create-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="yourai-modal-header">

              <h2>
                Create Session
              </h2>

              <button
                className="yourai-modal-close"
                onClick={closeCreateSession}
              >
                <FiX />
              </button>

            </div>


            {/* CONTENT */}

            <div className="yourai-modal-content">

              {/* SESSION TYPE */}

              <div className="yourai-form-section">

                <div className="yourai-label-row">

                  <div className="yourai-label-with-icon">

                    <label>
                      Session Type
                    </label>

                    <FiInfo />

                  </div>

                  <button className="yourai-video-tutorial">
                    <FiVideo />
                    Video Tutorial
                  </button>

                </div>


                <div className="yourai-session-type">

                  <button
                    className={
                      sessionType === "interview"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSessionType("interview")
                    }
                  >
                    <FiBriefcase />

                    Interview
                  </button>


                  <button
                    className={
                      sessionType === "call"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSessionType("call")
                    }
                  >
                    <FiPhone />

                    Regular Call
                  </button>

                </div>

              </div>


              {/* COMPANY */}

              <div className="yourai-form-section">

                <div className="yourai-label-row">

                  <div className="yourai-label-with-icon">

                    <label>
                      <FiBriefcase />
                      Company
                    </label>

                    <FiInfo />

                  </div>


                  <button
                    className="yourai-fill-job-btn"
                    type="button"
                  >
                    <span>
                      ✧
                    </span>

                    Fill fields from Job Post URL

                    <FiArrowRight />

                  </button>

                </div>


                <input
                  type="text"
                  className="yourai-modal-input"
                  placeholder="Microsoft..."
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                />

              </div>


              {/* JOB DESCRIPTION */}

              <div className="yourai-form-section">

                <div className="yourai-label-row">

                  <div className="yourai-label-with-icon">

                    <label>
                      <FiFileText />
                      Job Description
                    </label>

                    <FiInfo />

                  </div>

                </div>


                <textarea
                  className="yourai-job-description"
                  placeholder="Software Engineer versed in Python, SQL, and AWS..."
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* CONTEXT */}

              <div className="yourai-form-section">

                <div className="yourai-section-title">
                  Context
                </div>


                <div className="yourai-context-buttons">

                  <div className="yourai-resume-context-wrap">
                    <button
                      type="button"
                      className={
                        resumeAdded
                          ? "yourai-context-btn added yourai-resume-context-selected"
                          : "yourai-context-btn primary"
                      }
                      onClick={openResumeSelector}
                    >
                      <FiFileText />

                      <span className="yourai-resume-context-name">
                        {selectedResume?.title || "Add Resume"}
                      </span>

                      {resumeAdded && selectedResume ? (
                        <FiChevronDown className="yourai-resume-context-chevron" />
                      ) : (
                        <FiPlus />
                      )}
                    </button>

                    {resumeAdded && selectedResume && (
                      <button
                        type="button"
                        className="yourai-resume-context-remove"
                        onClick={handleRemoveResume}
                        aria-label="Remove selected resume"
                        title="Remove resume"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>


                  {/* Documents Selector Trigger */}
                  <button
                    type="button"
                    className={
                      documentsAdded
                        ? "yourai-context-btn added"
                        : "yourai-context-btn"
                    }
                    onClick={openDocSelector}
                  >
                    <FiPlus />

                    {documentsAdded
                      ? `${selectedDocs.length} Documents Added`
                      : "Add Documents"}
                  </button>


                  <button
                    type="button"
                    className={
                      extraContextAdded
                        ? "yourai-context-btn added"
                        : "yourai-context-btn"
                    }
                    onClick={() =>
                      setExtraContextAdded(
                        !extraContextAdded
                      )
                    }
                  >
                    <FiPlus />

                    {extraContextAdded
                      ? "Context Added"
                      : "Add Extra Context"}
                  </button>

                </div>

              </div>


              {/* OUTPUT SETTINGS */}

              <div className="yourai-form-section">

                <div className="yourai-section-title">
                  Output Settings
                </div>


                <div className="yourai-output-settings">

                  <div className="yourai-dropdown">

                    <span className="yourai-gemini-icon">
                      G
                    </span>

                    <select
                      value={model}
                      onChange={(e) =>
                        setModel(e.target.value)
                      }
                    >
                      <option>
                        Gemini 3.1 Flash Lite
                      </option>

                      <option>
                        Gemini 3.5 Flash
                      </option>

                      <option>
                        GPT-4.1
                      </option>

                      <option>
                        GPT-4.1 Mini
                      </option>

                      <option>
                        GPT-5.5
                      </option>

                      <option>
                        GPT-5.5 Mini
                      </option>

                      <option>
                        Claude 4.5 Haiku
                      </option>
                    </select>

                    <FiChevronDown />

                  </div>


                  <div className="yourai-dropdown language">

                    <FiGlobe />

                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(
                          e.target.value
                        )
                      }
                    >
                      <option>
                        English
                      </option>

                      <option>
                        Hindi
                      </option>

                      <option>
                        Kannada
                      </option>
                    </select>

                    <FiChevronDown />

                  </div>

                </div>

              </div>


              {/* BEHAVIOR */}

              <div className="yourai-form-section">

                <div className="yourai-section-title">
                  Behavior
                </div>


                <div className="yourai-behavior-options">

                  <label>

                    <input
                      type="checkbox"
                      checked={autoAnswer}
                      onChange={(e) =>
                        setAutoAnswer(
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Auto Answer (Beta)
                    </span>

                    <FiInfo />

                  </label>


                  <label>

                    <input
                      type="checkbox"
                      checked={saveTranscript}
                      onChange={(e) =>
                        setSaveTranscript(
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Save Transcript
                    </span>

                    <FiInfo />

                  </label>

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <div className="yourai-modal-footer">

              <button
                className="yourai-close-btn"
                onClick={closeCreateSession}
              >
                Close
              </button>


              <button
                className="yourai-create-btn"
                disabled={
                  !company.trim() ||
                  !jobDescription.trim() ||
                  !resumeAdded ||
                  creatingSession
                }
                onClick={handleCreateSession}
              >
                {creatingSession
                  ? "Creating..."
                  : "Create Session"}
              </button>

            </div>

          </div>
        </div>
      )}


      {/* =================================================
          RESUME SELECTOR MODAL
      ================================================= */}

      {showResumeSelector && (
        <div
          className="yourai-resume-selector-overlay"
          onClick={closeResumeSelector}
        >
          <div
            className="yourai-resume-selector-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="yourai-resume-selector-header">
              <div>
                <h2>Resume</h2>
                <p>
                  Select a resume to use for the interview. The AI will reference it when generating responses to provide more relevant suggestions.
                </p>
              </div>

              <button
                type="button"
                className="yourai-resume-selector-close"
                onClick={closeResumeSelector}
                aria-label="Close resume selector"
              >
                <FiX />
              </button>
            </div>

            <div className="yourai-resume-selector-body">
              <div className="yourai-resume-selector-label">
                <span>
                  <FiFileText />
                  Resume
                </span>
                <FiInfo />
              </div>

              <div className="yourai-resume-dropdown-wrap">
                <button
                  type="button"
                  className="yourai-resume-dropdown-trigger"
                  onClick={() =>
                    setResumeDropdownOpen((previous) => !previous)
                  }
                >
                  <span>
                    {selectedResume?.title || "Select a resume"}
                  </span>

                  <FiChevronDown
                    className={
                      resumeDropdownOpen
                        ? "yourai-resume-chevron-open"
                        : ""
                    }
                  />
                </button>

                {resumeDropdownOpen && (
                  <div className="yourai-resume-dropdown-menu">
                    {loadingResumes ? (
                      <div className="yourai-resume-dropdown-message">
                        Loading resumes...
                      </div>
                    ) : availableResumes.length > 0 ? (
                      <>
                        {availableResumes.map((resume) => {
                          const isSelected =
                            selectedResume?.id === resume.id;

                          return (
                            <button
                              type="button"
                              key={resume.id}
                              className={
                                isSelected
                                  ? "yourai-resume-option selected"
                                  : "yourai-resume-option"
                              }
                              onClick={() =>
                                handleSelectResume(resume)
                              }
                            >
                              <span className="yourai-resume-option-info">
                                <FiFileText />
                                <span>
                                  {resume.title ||
                                    resume.filename ||
                                    "Untitled Resume"}
                                </span>
                              </span>

                              {isSelected && (
                                <span className="yourai-resume-option-check">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </>
                    ) : (
                      <div className="yourai-resume-dropdown-message">
                        No resumes found. Create or upload a resume first.
                      </div>
                    )}

                    <button
                      type="button"
                      className="yourai-resume-upload-option"
                      onClick={() =>
                        resumeUploadInputRef.current?.click()
                      }
                      disabled={uploadingResume}
                    >
                      <FiPlus />
                      <span>
                        {uploadingResume
                          ? "Uploading resume..."
                          : "Upload a resume"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <input
                ref={resumeUploadInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleResumeUpload}
              />
            </div>

            <div className="yourai-resume-selector-footer">
              <button
                type="button"
                className="yourai-resume-selector-cancel"
                onClick={closeResumeSelector}
              >
                Close
              </button>

              <button
                type="button"
                className="yourai-resume-selector-confirm"
                disabled={!selectedResume}
                onClick={closeResumeSelector}
              >
                {selectedResume ? "Use Resume" : "Select Resume"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =================================================
          DOCUMENTS SELECTOR MODAL
      ================================================= */}

      {showDocSelector && (
        <div
          className="yourai-resume-selector-overlay"
          onClick={() => setShowDocSelector(false)}
        >
          <div
            className="yourai-resume-selector-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="yourai-resume-selector-header">
              <div>
                <h2>Knowledge Documents</h2>
                <p>Select multiple documents to be used as context by the AI.</p>
              </div>
              <button
                type="button"
                className="yourai-resume-selector-close"
                onClick={() => setShowDocSelector(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="yourai-resume-selector-body" style={{ maxHeight: "250px", overflowY: "auto" }}>
              {loadingDocs ? (
                <div>Loading documents...</div>
              ) : availableDocs.length > 0 ? (
                availableDocs.map((doc) => {
                  const isChecked = selectedDocs.some((d) => d.id === doc.id);
                  return (
                    <div
                      key={doc.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        gap: "12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9"
                      }}
                      onClick={() => handleToggleDocSelection(doc)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }}
                      />
                      <FiFileText />
                      <span>{doc.title}</span>
                    </div>
                  );
                })
              ) : (
                <div>No documents found. Add documents in the Documents tab first.</div>
              )}
            </div>

            <div className="yourai-resume-selector-footer">
              <button
                type="button"
                className="yourai-resume-selector-confirm"
                onClick={() => setShowDocSelector(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =================================================
          REAL INTERVIEW MODAL
      ================================================= */}

      {showRealInterview && (
        <div
          className="yourai-modal-overlay"
          onClick={() =>
            setShowRealInterview(false)
          }
        >

          <div
            className="yourai-real-interview-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="yourai-real-interview-header">

              <div>

                <h2>
                  Real interview
                </h2>

                <p>
                  Pick how you want to run it.
                </p>

              </div>


              <button
                className="yourai-real-close"
                onClick={() =>
                  setShowRealInterview(false)
                }
              >
                <FiX />
              </button>

            </div>


            <div className="yourai-interview-options">

              {/* FULL SESSION */}

              <div className="yourai-interview-card">

                <div className="yourai-interview-card-header">

                  <div className="yourai-interview-title">

                    <FiCreditCard />

                    <span>
                      Full session
                    </span>

                  </div>

                </div>


                <p>
                  30-minute session using 0.5
                  credit. Auto-extends so it
                  won't cut out mid-conversation.
                </p>


                <button
                  className="yourai-buy-credit-btn"
                  onClick={handleBuyCredits}
                >
                  Buy credits
                </button>

              </div>


              {/* FREE SESSION */}

              <div className="yourai-interview-card">

                <div className="yourai-interview-card-header">

                  <div className="yourai-interview-title">

                    <FiClock />

                    <span>
                      Free session
                    </span>

                  </div>


                  <span className="yourai-session-count">
                    10 left
                  </span>

                </div>


                <p>
                  10-minute trial, no credits.
                  Then a 12-minute wait before
                  the next; no auto-extend.
                </p>


                <button
                  className="yourai-activate-free-btn"
                  onClick={handleActivateFree}
                >
                  Activate free
                </button>

              </div>

            </div>


            <button
              className="yourai-real-back-btn"
              onClick={
                handleBackToCreateSession
              }
            >
              <span>
                ←
              </span>

              Back
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          CONNECT MODAL
      ================================================= */}

      {showConnectModal && (
        <div
          className="yourai-modal-overlay"
          onClick={() =>
            setShowConnectModal(false)
          }
        >

          <div
            className="yourai-connect-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="yourai-connect-header">

              <div>

                <h2>
                  Connect
                </h2>

                <p>
                  This is an Interview Session
                  for the position{" "}
                  <strong>
                    "{jobDescription || "Software Engineer"}"
                  </strong>{" "}
                  at{" "}
                  <strong>
                    "{company || "Microsoft"}"
                  </strong>.
                </p>

              </div>


              <button
                className="yourai-edit-btn"
                onClick={() => {
                  setShowConnectModal(false);
                  setShowCreateSession(true);
                }}
              >
                ✎ Edit
              </button>

            </div>


            {/* AUDIO WARNING */}

            <div className="yourai-audio-warning">

              <span className="yourai-audio-icon">
                🔊
              </span>

              <span>
                Make sure to select the
                "Also share tab audio"
                option when sharing the screen.
              </span>

            </div>


            {/* MEETING OPTIONS */}

            <div className="yourai-connect-method">

              <span className="yourai-connect-label">
                How to Connect:
              </span>


              <button
                className={
                  selectedMeeting === "Zoom"
                    ? "yourai-meeting-icon active"
                    : "yourai-meeting-icon"
                }
                onClick={() =>
                  setSelectedMeeting("Zoom")
                }
                title="Zoom"
              >
                <span>
                  ZOOM
                </span>
              </button>


              <button
                className={
                  selectedMeeting ===
                    "Google Meet"
                    ? "yourai-meeting-icon active"
                    : "yourai-meeting-icon"
                }
                onClick={() =>
                  setSelectedMeeting(
                    "Google Meet"
                  )
                }
                title="Google Meet"
              >
                <span>
                  ▶
                </span>
              </button>


              <button
                className={
                  selectedMeeting ===
                    "Microsoft Teams"
                    ? "yourai-meeting-icon active"
                    : "yourai-meeting-icon"
                }
                onClick={() =>
                  setSelectedMeeting(
                    "Microsoft Teams"
                  )
                }
                title="Microsoft Teams"
              >
                <span>
                  TEAMS
                </span>
              </button>


              <button
                className={
                  selectedMeeting === "Webex"
                    ? "yourai-meeting-icon active"
                    : "yourai-meeting-icon"
                }
                onClick={() =>
                  setSelectedMeeting("Webex")
                }
                title="Webex"
              >
                <span>
                  WEBEX
                </span>
              </button>


              <button
                className={
                  selectedMeeting === "Phone"
                    ? "yourai-meeting-icon active"
                    : "yourai-meeting-icon"
                }
                onClick={() =>
                  setSelectedMeeting("Phone")
                }
                title="Phone"
              >
                ☎
              </button>


              <div className="yourai-connect-divider" />


              <button className="yourai-video-tutorial-link">
                <FiVideo />

                Video Tutorial
              </button>

            </div>


            {/* MOCK INTERVIEW */}

            <div className="yourai-mock-interview-box">

              <div className="yourai-mock-thumbnail">

                <div className="yourai-play-button">
                  ▶
                </div>

                <span>
                  Azentmart AI Mock Interview
                </span>

              </div>


              <div className="yourai-mock-description">

                <p>
                  📺 Instead of a call tab,
                  you can also share a{" "}
                  <strong>
                    mock interview
                  </strong>{" "}
                  on YouTube and test
                  AzentmartAI that way.
                </p>

                <p>
                  Example video:{" "}
                  <a href="#mock-interview">
                    Mock Interview
                  </a>
                </p>

              </div>

            </div>


            {/* FOOTER */}

            <div className="yourai-connect-footer">

              <button
                className="yourai-exit-connect-btn"
                onClick={() =>
                  setShowConnectModal(false)
                }
              >
                Exit
              </button>


              <button
                className="yourai-connect-tab-btn"
                onClick={handleConnectTab}
              >
                <span>
                  ⇧
                </span>

                Connect Tab
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          FINAL LIVE INTERVIEW SPLIT SCREEN
      ================================================= */}

      {isConnected && (

        <div className="yourai-live-interview">

          {/* =================================================
              LEFT - MEETING / TRANSCRIPT
          ================================================= */}

          <div className="yourai-live-left">

            {/* TOP BAR */}

            <div className="yourai-live-toolbar">

              <div className="yourai-live-brand">



                <strong>
                  Azentmart
                </strong>

              </div>


              <div className="yourai-live-status">

                <span className="yourai-time">
                  ◷ 10m (Free)
                </span>


                <button
                  className="yourai-menu-btn"
                  type="button"
                >
                  ⋮
                </button>


                <button
                  className="yourai-live-exit"
                  onClick={
                    stopLiveInterview
                  }
                >
                  ⇥ Exit
                </button>

              </div>

            </div>


            {/* TRANSCRIPT */}

            <div className="yourai-transcript-area">

              <div className="yourai-transcript-header">

                <div className="yourai-question-title">
                  💬 Meeting Transcript
                </div>


                <button
                  className="yourai-clear-btn"
                  onClick={
                    clearTranscript
                  }
                >
                  × Clear Messages
                </button>

              </div>


              <div className="yourai-transcript-content">

                {transcript ? (

                  <p>
                    {transcript}
                  </p>

                ) : (

                  <div className="yourai-listening-placeholder">

                    <div className="yourai-listening-icon">
                      🎙
                    </div>

                    <h3>
                      {isListening
                        ? "Listening..."
                        : "Waiting for audio..."}
                    </h3>

                    <p>
                      Your meeting
                      conversation will
                      appear here.
                    </p>

                  </div>

                )}

              </div>


              {/* CONTROLS */}

              <div className="yourai-transcript-controls">

                <button
                  className="yourai-connect-mic-btn"
                  onClick={() => {

                    if (isListening) {
                      stopListening();
                    } else {
                      startListening();
                    }

                  }}
                >
                  {isListening
                    ? "Listening..."
                    : "Connect"}

                  <span>
                    🎙
                  </span>
                </button>


                <button
                  className="yourai-clear-control"
                  onClick={
                    clearTranscript
                  }
                >
                  × Clear
                </button>


                <button className="yourai-language-btn">
                  🌐 {language}⌄
                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT - AI ASSISTANT
          ================================================= */}

          <div className="yourai-live-right">

            {/* QUESTION / ANSWER */}

            <data className="yourai-answer-area">

              <div className="yourai-question-box">

                <span>
                  💬
                </span>

                <strong>
                  Question
                </strong>

              </div>


              <div className="yourai-answer-content">

                {aiAnswer ? (

                  <div>

                    <div className="yourai-answer-heading">
                      ⭐ Answer
                    </div>

                    <p>
                      {aiAnswer}
                    </p>

                  </div>

                ) : (

                  <div className="yourai-empty-answer">
                    Ask a question to get
                    an AI answer.
                  </div>

                )}

              </div>

            </data>


            {/* MANUAL MESSAGE */}

            <div className="yourai-manual-input-area">

              <input
                type="text"
                value={manualQuestion}
                onChange={(e) =>
                  setManualQuestion(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {
                    generateAnswer();
                  }

                }}
                placeholder="Type a manual message..."
              />


              <button
                className="yourai-screenshot-btn"
                type="button"
              >
                ⛶
              </button>


              <button
                className="yourai-send-btn"
                onClick={
                  generateAnswer
                }
              >
                Send
              </button>

            </div>


            {/* ACTIONS */}

            <div className="yourai-answer-actions">

              <button
                className="yourai-answer-btn"
                onClick={
                  generateAnswer
                }
              >
                ✨ Answer
              </button>


              <button
                className="yourai-screenshot-action"
                type="button"
              >
                🖥 Screenshot
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default YourAIInterviewSessions;
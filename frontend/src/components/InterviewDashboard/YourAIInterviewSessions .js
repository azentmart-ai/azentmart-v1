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
} from "react-icons/fi";

import {
  connectInterviewCopilot,
  createInterviewSession,
  getUserResumes,
  uploadResumeFile,
} from "../../services/interviewApi";

const YourAIInterviewSessions = () => {
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
  // FLOATING SCREEN STATE
  // =====================================================

  const [showFloatingScreen] = useState(true);

  const [isFloatingMinimized, setIsFloatingMinimized] =
    useState(false);

  const [floatingPosition, setFloatingPosition] = useState({
    x: window.innerWidth - 450,
    y: window.innerHeight - 550,
  });

  const floatingVideoRef = useRef(null);
  const floatingWindowRef = useRef(null);


  const recognitionRef = useRef(null);
  const isConnectedRef = useRef(false);
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);


  // =====================================================
  // CREATE SESSION FORM
  // =====================================================

  // Add active tab state inside YourAIInterviewSessions component
  const [activeTab, setActiveTab] = useState("all");

  // Example sessions list or dynamic count
  const sessionsList = []; // Unga sessions array

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
  // CREATE SESSION
  // =====================================================

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
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
  // CREATE SESSION
  // =====================================================

  const handleCreateSession = async () => {
    if (!company.trim() || !jobDescription.trim() || !resumeAdded) {
      return;
    }

    setCreatingSession(true);

    try {
      const user = getUser();
      const userId = user ? user.id : 1; // fallback for dev

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
        extra_context_added: extraContextAdded,
        auto_answer: autoAnswer,
        save_transcript: saveTranscript,
        status: "active",
      });

      setSessionId(session.id);
      setShowCreateSession(false);
      setShowRealInterview(true);
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session: " + err.message);
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
    console.log("Buy credits clicked");

    // Add your payment page/navigation later.
  };

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
          video: true,
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

      // Start listening after the tab is shared.
      startListening();

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
  // FLOATING SCREEN VIDEO
  // =====================================================

  useEffect(() => {
    const videoElement = floatingVideoRef.current;

    if (!videoElement || !sharedStream) {
      return;
    }

    videoElement.srcObject = sharedStream;

    videoElement
      .play()
      .catch((error) => {
        console.log(
          "Floating video play error:",
          error
        );
      });

    return () => {
      videoElement.srcObject = null;
    };
  }, [sharedStream]);


  // =====================================================
  // DRAG FLOATING WINDOW
  // =====================================================

  const handleFloatingDragStart = (event) => {
    if (event.target.closest("button")) {
      return;
    }

    if (!floatingWindowRef.current) {
      return;
    }

    const rect =
      floatingWindowRef.current.getBoundingClientRect();

    const offsetX =
      event.clientX - rect.left;

    const offsetY =
      event.clientY - rect.top;

    const handleMouseMove = (moveEvent) => {
      const width =
        floatingWindowRef.current?.offsetWidth || 430;

      const height =
        floatingWindowRef.current?.offsetHeight || 520;

      const x = Math.max(
        8,
        Math.min(
          moveEvent.clientX - offsetX,
          window.innerWidth - width - 8
        )
      );

      const y = Math.max(
        8,
        Math.min(
          moveEvent.clientY - offsetY,
          window.innerHeight - height - 8
        )
      );

      setFloatingPosition({
        x,
        y,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp
    );
  };
  // =====================================================
  // START SPEECH RECOGNITION
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
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      if (finalText.trim()) {
        const text = finalText.trim();

        setTranscript((previous) =>
          previous ? `${previous} ${text}` : text
        );

        // Send finalized speech to AI via WebSocket
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({ type: "transcript", text })
          );
        }
      } else if (interimText.trim()) {
        // Interim results just update UI, not sent to AI
        setTranscript((previous) =>
          previous
            ? `${previous} ${interimText.trim()}`
            : interimText.trim()
        );
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
          EMPTY STATE
      ================================================= */}

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


                  <button
                    type="button"
                    className={
                      documentsAdded
                        ? "yourai-context-btn added"
                        : "yourai-context-btn"
                    }
                    onClick={() =>
                      setDocumentsAdded(
                        !documentsAdded
                      )
                    }
                  >
                    <FiPlus />

                    {documentsAdded
                      ? "Documents Added"
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

            <div className="yourai-answer-area">

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

            </div>


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
      {/* =================================================
    FLOATING AI ASSISTANT
================================================= */}

      {sharedStream && showFloatingScreen && (
        <div
          ref={floatingWindowRef}
          className={`yourai-floating-assistant ${isFloatingMinimized
            ? "yourai-floating-assistant-minimized"
            : ""
            }`}
          style={{
            left: `${floatingPosition.x}px`,
            top: `${floatingPosition.y}px`,
          }}
        >

          {/* ============================================
        TOP CONTROL BAR
    ============================================ */}

          <div
            className="yourai-floating-topbar"
            onMouseDown={handleFloatingDragStart}
          >

            {/* Answer */}

            <button
              type="button"
              className="yourai-floating-main-btn"
              onClick={generateAnswer}
            >
              <span>Answer</span>

              <kbd>⌘ ↵</kbd>
            </button>


            {/* Screenshot */}

            <button
              type="button"
              className="yourai-floating-main-btn"
            >
              <span>Screenshot</span>

              <kbd>⌘ ⇧ ↵</kbd>
            </button>


            {/* Chat */}

            <button
              type="button"
              className="yourai-floating-main-btn"
            >
              <span>Chat</span>

              <kbd>⌘ ⇧ ⌫</kbd>
            </button>


            <div className="yourai-floating-spacer" />


            {/* Move */}

            <button
              type="button"
              className="yourai-floating-icon-btn"
              title="Move"
            >
              ↔
            </button>


            {/* Minimize */}

            <button
              type="button"
              className="yourai-floating-icon-btn"
              onClick={() =>
                setIsFloatingMinimized(
                  (previous) => !previous
                )
              }
            >
              {isFloatingMinimized ? "□" : "↗"}
            </button>


            {/* More */}

            <button
              type="button"
              className="yourai-floating-icon-btn"
            >
              ⋮
            </button>


            {/* End */}

            <button
              type="button"
              className="yourai-floating-end-btn"
              onClick={stopLiveInterview}
            >
              End
            </button>

          </div>


          {!isFloatingMinimized && (

            <>

              {/* ==========================================
            TRANSCRIPT / QUESTION BAR
        ========================================== */}

              <div className="yourai-floating-questionbar">

                {/* Listening */}

                <div
                  className={`yourai-floating-listening ${isListening
                    ? "active"
                    : ""
                    }`}
                >

                  <span className="yourai-wave">

                    <i />
                    <i />
                    <i />
                    <i />
                    <i />

                  </span>

                </div>


                {/* Question */}

                <div className="yourai-floating-question-scroll">

                  {transcript ? (
                    <span>
                      {transcript}
                    </span>
                  ) : (
                    <span className="yourai-floating-placeholder">
                      Waiting for question...
                    </span>
                  )}

                </div>


                {/* Clear */}

                <button
                  type="button"
                  className="yourai-floating-clear-btn"
                  onClick={clearTranscript}
                >
                  Clear

                  <kbd>⌘ ⌫</kbd>
                </button>


                {/* Expand */}

                <button
                  type="button"
                  className="yourai-floating-expand-btn"
                >
                  ↗
                </button>

              </div>


              {/* ==========================================
            QUESTION / ANSWER AREA
        ========================================== */}

              <div className="yourai-floating-content">

                {/* QUESTION */}

                <div className="yourai-floating-question-row">

                  <span className="yourai-floating-question-icon">
                    💬
                  </span>

                  <strong>
                    Question:
                  </strong>

                  <span className="yourai-floating-question-text">

                    {manualQuestion ||
                      transcript ||
                      "Waiting for question..."}

                  </span>

                  <button
                    type="button"
                    className="yourai-floating-copy-btn"
                    onClick={() => {
                      const text =
                        manualQuestion ||
                        transcript ||
                        "";

                      if (text) {
                        navigator.clipboard.writeText(text);
                      }
                    }}
                  >
                    ⧉
                  </button>

                </div>


                {/* ANSWER */}

                <div className="yourai-floating-answer-row">

                  <span className="yourai-floating-star">
                    ⭐
                  </span>

                  <strong>
                    Answer:
                  </strong>

                  <div className="yourai-floating-answer-text">

                    {aiAnswer ? (

                      <>
                        <p>
                          {aiAnswer}
                        </p>
                      </>

                    ) : (

                      <span className="yourai-floating-answer-placeholder">
                        AI answer will appear here...
                      </span>

                    )}

                  </div>

                </div>

              </div>


              {/* ==========================================
            MANUAL QUESTION INPUT
        ========================================== */}

              <div className="yourai-floating-inputbar">

                <input
                  type="text"
                  value={manualQuestion}
                  onChange={(event) =>
                    setManualQuestion(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      generateAnswer();
                    }
                  }}
                  placeholder="Ask AI..."
                />


                <button
                  type="button"
                  onClick={generateAnswer}
                >
                  Send
                </button>

              </div>

            </>

          )}

        </div>
      )}
    </div>
  );
};

export default YourAIInterviewSessions;
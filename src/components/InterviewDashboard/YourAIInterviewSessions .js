import React, { useRef, useState } from "react";
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

const YourAIInterviewSessions = () => {
  // =====================================================
  // MODAL STATES
  // =====================================================

  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showRealInterview, setShowRealInterview] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

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

  const recognitionRef = useRef(null);
  const isConnectedRef = useRef(false);

  // =====================================================
  // CREATE SESSION FORM
  // =====================================================

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

  const handleCreateSession = () => {
    if (!company.trim()) {
      return;
    }

    if (!jobDescription.trim()) {
      return;
    }

    if (!resumeAdded) {
      return;
    }

    setShowCreateSession(false);
    setShowRealInterview(true);
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
      let newText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        newText +=
          event.results[i][0].transcript;
      }

      if (newText.trim()) {
        setTranscript((previous) => {
          if (!previous) {
            return newText.trim();
          }

          return `${previous} ${newText.trim()}`;
        });
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
  // GENERATE AI ANSWER
  // FRONTEND PLACEHOLDER
  // =====================================================

  const generateAnswer = () => {
    const question =
      manualQuestion.trim();

    if (!question) {
      return;
    }

    setAiAnswer(
      `Here's a suggested answer for "${question}".

I would answer this clearly by explaining the concept, giving a practical example, and relating it to my project experience.`
    );
  };

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

          <button className="active">
            All
          </button>

          <button>
            Active
          </button>

          <button>
            Ended
          </button>

        </div>

        <span className="yourai-total-sessions">
          0 Sessions
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

                  <button
                    type="button"
                    className={
                      resumeAdded
                        ? "yourai-context-btn added"
                        : "yourai-context-btn primary"
                    }
                    onClick={() =>
                      setResumeAdded(
                        !resumeAdded
                      )
                    }
                  >
                    <FiPlus />

                    {resumeAdded
                      ? "Resume Added"
                      : "Add Resume"}
                  </button>


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
                  !resumeAdded
                }
                onClick={
                  handleCreateSession
                }
              >
                Create Session
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

    </div>
  );
};

export default YourAIInterviewSessions;
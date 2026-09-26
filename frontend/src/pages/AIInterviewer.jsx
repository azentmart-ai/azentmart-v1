import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  PhoneOff,
  Sparkles,
  Calendar,
  Send,
  Search,
  UserRound,
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Brain,
  Award,
  RotateCcw,
  Mail,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

import { api } from "../lib/api";
import "./AIInterviewer.css";

export default function AIInterviewer() {
  /* =========================================================
     APPLICATIONS
  ========================================================= */

  const [apps, setApps] = useState([]);
  const [appId, setAppId] = useState("");
  const [search, setSearch] = useState("");
  const [loadingApps, setLoadingApps] = useState(true);

  /* =========================================================
     INTERVIEW
  ========================================================= */

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [interviewId, setInterviewId] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  /* IMPORTANT: schedule state */
  const [schedule, setSchedule] = useState("");

  const [msg, setMsg] = useState("");

  /* =========================================================
     CAMERA / MICROPHONE
  ========================================================= */

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  /* =========================================================
     TIMER
  ========================================================= */

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }, [seconds]);

  /* =========================================================
     NORMALIZE API RESPONSE
  ========================================================= */

  const extractArray = (result) => {
    if (Array.isArray(result)) return result;

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    if (Array.isArray(result?.items)) {
      return result.items;
    }

    if (Array.isArray(result?.results)) {
      return result.results;
    }

    if (Array.isArray(result?.candidates)) {
      return result.candidates;
    }

    if (Array.isArray(result?.applications)) {
      return result.applications;
    }

    if (Array.isArray(result?.data?.applications)) {
      return result.data.applications;
    }

    if (Array.isArray(result?.data?.candidates)) {
      return result.data.candidates;
    }

    return [];
  };

  /* =========================================================
     LOAD CANDIDATE APPLICATIONS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      try {
        setLoadingApps(true);
        setMsg("");

        const result = await api.pipeline();

        console.log(
          "AI INTERVIEWER PIPELINE:",
          result
        );

        let data = extractArray(result);

        /*
         * If pipeline doesn't return anything,
         * try candidates API.
         */
        if (
          data.length === 0 &&
          typeof api.candidates === "function"
        ) {
          const candidateResult =
            await api.candidates();

          console.log(
            "AI INTERVIEWER CANDIDATES:",
            candidateResult
          );

          data = extractArray(
            candidateResult
          );
        }

        if (!mounted) return;

        setApps(data);

        if (data.length === 0) {
          setMsg(
            "No candidate applications found."
          );
        }
      } catch (error) {
        console.error(
          "LOAD APPLICATIONS ERROR:",
          error
        );

        if (mounted) {
          setApps([]);
          setMsg(
            error?.message ||
              "Unable to load candidate applications."
          );
        }
      } finally {
        if (mounted) {
          setLoadingApps(false);
        }
      }
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getApplicationId = (item) => {
    return (
      item?.application_id ??
      item?.applicationId ??
      item?.application?.id ??
      item?.id ??
      ""
    );
  };

  const getCandidateId = (item) => {
    return (
      item?.candidate_id ??
      item?.candidateId ??
      item?.candidate?.id ??
      ""
    );
  };

  const getJobId = (item) => {
    return (
      item?.job_id ??
      item?.jobId ??
      item?.job?.id ??
      ""
    );
  };

  const getCandidateName = (item) => {
    return String(
      item?.candidate_name ??
        item?.candidateName ??
        item?.name ??
        item?.full_name ??
        item?.fullName ??
        item?.candidate?.name ??
        "Candidate"
    );
  };

  const getEmail = (item) => {
    return String(
      item?.email ??
        item?.candidate_email ??
        item?.candidateEmail ??
        item?.candidate?.email ??
        ""
    );
  };

  const getJobTitle = (item) => {
    return String(
      item?.job_title ??
        item?.jobTitle ??
        item?.position ??
        item?.role ??
        item?.job?.title ??
        "Open Position"
    );
  };

  const getStage = (item) => {
    return String(
      item?.stage ??
        item?.status ??
        item?.pipeline_stage ??
        item?.pipelineStage ??
        "Applied"
    );
  };

  const getScore = (item) => {
    const value =
      item?.score ??
      item?.match_score ??
      item?.matchScore ??
      item?.ai_score ??
      item?.aiScore ??
      item?.matching_score;

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    const number = Number(value);

    return Number.isNaN(number)
      ? null
      : Math.round(number);
  };

  const getSkills = (item) => {
    if (Array.isArray(item?.skills)) {
      return item.skills;
    }

    if (typeof item?.skills === "string") {
      return item.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredApps = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return apps;
    }

    return apps.filter((item) => {
      const name =
        getCandidateName(item).toLowerCase();

      const email =
        getEmail(item).toLowerCase();

      const job =
        getJobTitle(item).toLowerCase();

      const stage =
        getStage(item).toLowerCase();

      const id =
        String(
          getApplicationId(item)
        ).toLowerCase();

      return [
        name,
        email,
        job,
        stage,
        id,
      ]
        .join(" ")
        .includes(value);
    });
  }, [apps, search]);

  /* =========================================================
     SELECTED APPLICATION
  ========================================================= */

  const selected = useMemo(() => {
    return apps.find(
      (item) =>
        String(
          getApplicationId(item)
        ) === String(appId)
    );
  }, [apps, appId]);

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials = selected
    ? getCandidateName(selected)
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
          (word) => word[0]
        )
        .join("")
        .toUpperCase()
    : "AI";

  /* =========================================================
     AI VOICE
  ========================================================= */

  const speakQuestion = (text) => {
    if (!voiceEnabled || !text) {
      return;
    }

    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  };

  /* =========================================================
     CAMERA + MICROPHONE
  ========================================================= */

  const startMedia = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera and microphone are not supported in this browser."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play().catch(
          () => {}
        );
      }

      stream
        .getVideoTracks()
        .forEach(
          (track) => {
            track.enabled = true;
          }
        );

      stream
        .getAudioTracks()
        .forEach(
          (track) => {
            track.enabled = true;
          }
        );

      setCameraOn(true);
      setMicOn(true);

      return true;
    } catch (error) {
      console.error(
        "CAMERA / MICROPHONE ERROR:",
        error
      );

      setMsg(
        "Please allow camera and microphone permission to start the live interview."
      );

      return false;
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }

    setCameraOn(false);
    setMicOn(false);
  };

  /* =========================================================
     CAMERA TOGGLE
  ========================================================= */

  const toggleCamera = async () => {
    if (!streamRef.current) {
      await startMedia();
      return;
    }

    const tracks =
      streamRef.current.getVideoTracks();

    if (!tracks.length) return;

    const newState = !cameraOn;

    tracks.forEach((track) => {
      track.enabled = newState;
    });

    setCameraOn(newState);
  };

  /* =========================================================
     MICROPHONE TOGGLE
  ========================================================= */

  const toggleMicrophone = () => {
    if (!streamRef.current) {
      return;
    }

    const tracks =
      streamRef.current.getAudioTracks();

    if (!tracks.length) return;

    const newState = !micOn;

    tracks.forEach((track) => {
      track.enabled = newState;
    });

    setMicOn(newState);

    if (!newState) {
      stopListening();
    }
  };

  /* =========================================================
     SPEECH RECOGNITION
  ========================================================= */

  const getRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return null;
    }

    if (!recognitionRef.current) {
      const recognition =
        new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const result =
            event.results[i];

          if (result.isFinal) {
            finalText +=
              result[0].transcript;
          } else {
            interimText +=
              result[0].transcript;
          }
        }

        const combined =
          `${finalText} ${interimText}`
            .trim();

        setAnswer(combined);
      };

      recognition.onerror = (event) => {
        console.error(
          "SPEECH RECOGNITION ERROR:",
          event
        );

        setListening(false);

        if (
          event.error ===
          "not-allowed"
        ) {
          setMsg(
            "Microphone permission was denied."
          );
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current =
        recognition;
    }

    return recognitionRef.current;
  };

  const startListening = () => {
    if (!micOn) {
      setMsg(
        "Please enable the microphone first."
      );
      return;
    }

    const recognition =
      getRecognition();

    if (!recognition) {
      setMsg(
        "Speech recognition is not supported. Please use Chrome or Edge."
      );
      return;
    }

    try {
      setAnswer("");
      recognition.start();
    } catch (error) {
      console.log(
        "Speech recognition already running."
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // already stopped
      }
    }

    setListening(false);
  };

  /* =========================================================
     START INTERVIEW
  ========================================================= */

  const start = async () => {
    if (!selected) {
      setMsg(
        "Please select a candidate application first."
      );
      return;
    }

    const applicationId =
      getApplicationId(selected);

    if (!applicationId) {
      setMsg(
        "Selected application ID is missing."
      );
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      /*
       * FIRST:
       * Request camera and microphone.
       */

      const mediaReady =
        await startMedia();

      if (!mediaReady) {
        setLoading(false);
        return;
      }

      /*
       * SECOND:
       * Start backend interview.
       */

      const result =
        await api.startInterview({
          application_id:
            applicationId,
        });

      console.log(
        "START INTERVIEW RESPONSE:",
        result
      );

      const generatedQuestions =
        Array.isArray(
          result?.questions
        )
          ? result.questions
          : [];

      const generatedInterviewId =
        result?.interview_id ??
        result?.interviewId ??
        result?.id ??
        "";

      setQuestions(
        generatedQuestions
      );

      setInterviewId(
        generatedInterviewId
      );

      setCurrent(0);
      setAnswer("");
      setTranscript([]);
      setEvaluation(null);
      setSeconds(0);
      setRunning(true);

      /*
       * Speak first question.
       */

      if (
        generatedQuestions.length >
        0
      ) {
        setTimeout(() => {
          speakQuestion(
            generatedQuestions[0]
              ?.question
          );
        }, 700);
      } else {
        setMsg(
          "Interview started, but no questions were returned by the backend."
        );
      }
    } catch (error) {
      console.error(
        "START INTERVIEW ERROR:",
        error
      );

      stopMedia();

      setMsg(
        error?.message ||
          "Unable to start the AI interview."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SAVE ANSWER
  ========================================================= */

  const saveAnswer = async () => {
    if (
      !answer.trim() ||
      !questions[current] ||
      !interviewId
    ) {
      return;
    }

    stopListening();

    const question =
      questions[current];

    const candidateAnswer =
      answer.trim();

    setLoading(true);
    setMsg("");

    try {
      await api.answerInterview({
        interview_id:
          interviewId,
        question:
          question.question,
        answer:
          candidateAnswer,
        category:
          question.category,
      });

      const newTranscript = [
        ...transcript,
        {
          question:
            question.question,
          answer:
            candidateAnswer,
          category:
            question.category ||
            "General",
        },
      ];

      setTranscript(
        newTranscript
      );

      setAnswer("");

      /*
       * NEXT QUESTION
       */

      if (
        current <
        questions.length - 1
      ) {
        const nextIndex =
          current + 1;

        setCurrent(nextIndex);

        setTimeout(() => {
          speakQuestion(
            questions[nextIndex]
              ?.question
          );
        }, 500);
      } else {
        /*
         * LAST QUESTION
         */
        await finish();
      }
    } catch (error) {
      console.error(
        "ANSWER ERROR:",
        error
      );

      setMsg(
        error?.message ||
          "Unable to save candidate response."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FINISH INTERVIEW
  ========================================================= */

  const finish = async () => {
    if (!interviewId) {
      return;
    }

    stopListening();

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setLoading(true);

    try {
      const result =
        await api.finishInterview({
          interview_id:
            interviewId,
        });

      console.log(
        "FINISH INTERVIEW RESPONSE:",
        result
      );

      setEvaluation(result);
      setRunning(false);

      stopMedia();
    } catch (error) {
      console.error(
        "FINISH INTERVIEW ERROR:",
        error
      );

      setMsg(
        error?.message ||
          "Unable to complete the interview."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     END INTERVIEW
  ========================================================= */

  const endInterview = async () => {
    const confirmed =
      window.confirm(
        "End this interview now?"
      );

    if (!confirmed) return;

    stopListening();

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setLoading(true);

    try {
      if (interviewId) {
        const result =
          await api.finishInterview({
            interview_id:
              interviewId,
          });

        setEvaluation(result);
      }
    } catch (error) {
      console.error(
        "END INTERVIEW ERROR:",
        error
      );

      setMsg(
        error?.message ||
          "Unable to finish interview."
      );
    } finally {
      setRunning(false);
      stopMedia();
      setLoading(false);
    }
  };

  /* =========================================================
     SCHEDULE INTERVIEW
  ========================================================= */

  const scheduleInterview = async () => {
    if (!selected) {
      setMsg(
        "Please select a candidate application."
      );
      return;
    }

    if (!schedule) {
      setMsg(
        "Please select an interview date and time."
      );
      return;
    }

    const candidateId =
      getCandidateId(selected);

    const jobId =
      getJobId(selected);

    if (!candidateId) {
      setMsg(
        "Candidate ID is missing."
      );
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      await api.scheduleCandidate(
        candidateId,
        {
          job_id: jobId,
          scheduled_at:
            new Date(
              schedule
            ).toISOString(),
          duration_minutes: 45,
          mode: "AI_VIDEO",
        }
      );

      setMsg(
        "Interview scheduled successfully."
      );

      setSchedule("");
    } catch (error) {
      console.error(
        "SCHEDULE ERROR:",
        error
      );

      setMsg(
        error?.message ||
          "Unable to schedule interview."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetInterview = () => {
    stopListening();
    stopMedia();

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setQuestions([]);
    setCurrent(0);
    setAnswer("");
    setTranscript([]);
    setInterviewId("");
    setEvaluation(null);
    setRunning(false);
    setSeconds(0);
    setMsg("");
  };

  /* =========================================================
     VOICE TOGGLE
  ========================================================= */

  const toggleVoice = () => {
    const nextState =
      !voiceEnabled;

    setVoiceEnabled(nextState);

    if (!nextState) {
      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      setSpeaking(false);
    }
  };

  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress =
    questions.length > 0
      ? Math.round(
          ((current + 1) /
            questions.length) *
            100
        )
      : 0;

  const evaluationScore =
    evaluation?.score ??
    evaluation?.overall_score ??
    evaluation?.overallScore ??
    evaluation?.evaluation_score ??
    null;

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // ignored
        }
      }

      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }
    };
  }, []);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="ai-interviewer-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="aii-header">

        <div>

          <div className="aii-eyebrow">
            <Brain size={13} />
            AI RECRUITING WORKSPACE
          </div>

          <h1>
            AI Interviewer
          </h1>

          <p>
            Conduct live, resume-based AI
            interviews using voice, video,
            structured questions and automated
            evaluation.
          </p>

        </div>

        <div className="aii-header-status">
          <span className="status-dot"></span>
          AI interview engine
        </div>

      </header>


      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {msg && (
        <div className="aii-message">

          <div className="aii-message-icon">
            <CheckCircle2 size={15} />
          </div>

          <span>
            {msg}
          </span>

          <button
            type="button"
            onClick={() =>
              setMsg("")
            }
          >
            ×
          </button>

        </div>
      )}


      {/* =====================================================
          APPLICATION SELECTOR
      ===================================================== */}

      <section className="application-toolbar">

        <div className="application-toolbar-left">

          <div className="toolbar-label">
            <UserRound size={14} />
            Candidate application
          </div>

          <select
            className="candidate-select"
            value={appId}
            disabled={loadingApps}
            onChange={(e) => {

              stopListening();

              if (
                "speechSynthesis" in window
              ) {
                window.speechSynthesis.cancel();
              }

              setAppId(
                e.target.value
              );

              setQuestions([]);
              setCurrent(0);
              setAnswer("");
              setTranscript([]);
              setInterviewId("");
              setEvaluation(null);
              setRunning(false);
              setSeconds(0);
              setMsg("");

              if (streamRef.current) {
                stopMedia();
              }
            }}
          >

            <option value="">
              {loadingApps
                ? "Loading candidate applications..."
                : apps.length === 0
                ? "No candidate applications found"
                : "Choose a candidate application"}
            </option>

            {filteredApps.map(
              (item, index) => {

                const id =
                  getApplicationId(
                    item
                  ) ||
                  `candidate-${index}`;

                return (
                  <option
                    key={id}
                    value={id}
                  >
                    {getCandidateName(
                      item
                    )}
                    {" · "}
                    {getJobTitle(
                      item
                    )}
                    {" · "}
                    {getStage(item)}
                  </option>
                );
              }
            )}

          </select>

          {!loadingApps &&
            apps.length > 0 && (
              <small className="application-count">
                <Users size={11} />
                {filteredApps.length} application
                {filteredApps.length !== 1
                  ? "s"
                  : ""} available
              </small>
            )}

        </div>


        <div className="candidate-search">

          <Search size={15} />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search candidate, email or job..."
          />

        </div>

      </section>


      {/* =====================================================
          SELECTED CANDIDATE
      ===================================================== */}

      {selected && (
        <section className="selected-candidate">

          <div className="selected-avatar">
            {initials}
          </div>

          <div className="selected-info">

            <strong>
              {getCandidateName(
                selected
              )}
            </strong>

            <span>
              <BriefcaseBusiness
                size={12}
              />
              {getJobTitle(
                selected
              )}
            </span>

            {getEmail(
              selected
            ) && (
              <small>
                <Mail size={10} />
                {getEmail(
                  selected
                )}
              </small>
            )}

          </div>

          <div className="selected-divider"></div>

          <div className="candidate-meta">
            <span>
              STAGE
            </span>

            <strong className="stage-value">
              {getStage(
                selected
              )}
            </strong>
          </div>

          <div className="candidate-meta">
            <span>
              AI MATCH
            </span>

            <strong>
              {getScore(
                selected
              ) !== null
                ? `${getScore(
                    selected
                  )}%`
                : "—"}
            </strong>
          </div>

          <div className="candidate-meta">
            <span>
              SKILLS
            </span>

            <strong>
              {getSkills(
                selected
              ).length}
            </strong>
          </div>

          {evaluation && (
            <button
              type="button"
              className="secondary-btn"
              onClick={
                resetInterview
              }
            >
              <RotateCcw
                size={13}
              />
              New interview
            </button>
          )}

        </section>
      )}


      {/* =====================================================
          MAIN INTERVIEW AREA
      ===================================================== */}

      <div className="live-interview-workspace">

        {/* ===================================================
            VIDEO
        =================================================== */}

        <section className="live-interview-room">

          <div className="live-room-header">

            <div>

              <span className="live-room-eyebrow">
                {running
                  ? "LIVE AI INTERVIEW"
                  : "AI INTERVIEW ROOM"}
              </span>

              <h2>
                {selected
                  ? getCandidateName(
                      selected
                    )
                  : "Select a candidate to begin"}
              </h2>

            </div>

            <div className="room-header-right">

              {running && (
                <div className="timer">
                  <Clock3 size={13} />
                  {formattedTime}
                </div>
              )}

              {running && (
                <div className="recording-pill">
                  <span></span>
                  Recording
                </div>
              )}

            </div>

          </div>


          {/* =================================================
              CANDIDATE CAMERA
          ================================================= */}

          <div className="candidate-camera">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={
                cameraOn
                  ? "candidate-video active"
                  : "candidate-video"
              }
            />

            {!cameraOn && (
              <div className="camera-placeholder">

                <div className="camera-avatar">
                  {selected
                    ? initials
                    : "AI"}
                </div>

                <strong>
                  {selected
                    ? getCandidateName(
                        selected
                      )
                    : "Candidate"}
                </strong>

                <span>
                  {selected
                    ? "Camera is ready to start"
                    : "Select a candidate"}
                </span>

              </div>
            )}


            {/* AI MINI WINDOW */}

            <div className="ai-interviewer-overlay">

              <div
                className={`ai-mini-orb ${
                  speaking
                    ? "speaking"
                    : ""
                }`}
              >
                <Brain size={19} />
              </div>

              <div className="ai-overlay-text">

                <strong>
                  AI Interviewer
                </strong>

                <span>
                  {speaking
                    ? "Speaking..."
                    : listening
                    ? "Listening..."
                    : running
                    ? "Ready"
                    : "Waiting"}
                </span>

              </div>

            </div>


            {/* LIVE */}

            <div className="camera-live-badge">

              <span></span>

              {running
                ? "LIVE"
                : "PREVIEW"}

            </div>


            {/* LISTENING */}

            {listening && (
              <div className="listening-indicator">

                <div className="sound-bars">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                Listening to candidate...

              </div>
            )}

          </div>


          {/* =================================================
              CONTROLS
          ================================================= */}

          <div className="camera-controls">

            <div className="camera-left-controls">

              <button
                type="button"
                className={`camera-control ${
                  micOn
                    ? "active"
                    : "off"
                }`}
                onClick={
                  toggleMicrophone
                }
                title={
                  micOn
                    ? "Mute microphone"
                    : "Enable microphone"
                }
              >
                {micOn ? (
                  <Mic size={16} />
                ) : (
                  <MicOff size={16} />
                )}
              </button>


              <button
                type="button"
                className={`camera-control ${
                  cameraOn
                    ? "active"
                    : "off"
                }`}
                onClick={
                  toggleCamera
                }
                title={
                  cameraOn
                    ? "Turn camera off"
                    : "Turn camera on"
                }
              >
                {cameraOn ? (
                  <Video size={16} />
                ) : (
                  <VideoOff
                    size={16}
                  />
                )}
              </button>


              <button
                type="button"
                className={`camera-control ${
                  voiceEnabled
                    ? "active"
                    : "off"
                }`}
                onClick={
                  toggleVoice
                }
              >
                {voiceEnabled ? (
                  <Volume2 size={16} />
                ) : (
                  <VolumeX size={16} />
                )}
              </button>

            </div>


            <div className="camera-center-status">

              {running ? (
                <>
                  <span className="green-dot"></span>
                  AI interviewer active
                </>
              ) : (
                <>
                  <span className="gray-dot"></span>
                  Interview not started
                </>
              )}

            </div>


            <div>

              {!running ? (
                <button
                  type="button"
                  className="start-live-btn"
                  onClick={start}
                  disabled={
                    loading ||
                    !selected
                  }
                >

                  {loading ? (
                    <Loader2
                      size={15}
                      className="spin"
                    />
                  ) : (
                    <Play size={15} />
                  )}

                  {loading
                    ? "Preparing..."
                    : "Start interview"}

                </button>
              ) : (
                <button
                  type="button"
                  className="end-live-btn"
                  onClick={
                    endInterview
                  }
                  disabled={
                    loading
                  }
                >
                  <PhoneOff
                    size={15}
                  />
                  End interview
                </button>
              )}

            </div>

          </div>

        </section>


        {/* ===================================================
            RIGHT AI PANEL
        =================================================== */}

        <aside className="ai-question-panel">

          {/* PROGRESS */}

          <div className="ai-panel-card progress-card">

            <div className="progress-card-top">

              <div>

                <span className="panel-eyebrow">
                  INTERVIEW PROGRESS
                </span>

                <h3>
                  {questions.length
                    ? `${current + 1} / ${
                        questions.length
                      }`
                    : "Not started"}
                </h3>

              </div>

              <div className="progress-number">
                {progress}%
              </div>

            </div>

            <div className="progress-line">
              <span
                style={{
                  width: `${progress}%`,
                }}
              ></span>
            </div>

          </div>


          {/* CURRENT QUESTION */}

          <div className="ai-panel-card current-question-card">

            <div className="current-question-header">

              <div className="question-ai-icon">
                <Sparkles size={16} />
              </div>

              <div>

                <span className="panel-eyebrow">
                  CURRENT QUESTION
                </span>

                <strong>
                  {questions[current]
                    ?.category ||
                    "AI-generated interview"}
                </strong>

              </div>

            </div>


            {/* START */}

            {!running &&
              !evaluation && (
                <div className="start-question">

                  <div className="start-question-icon">
                    <MessageSquare
                      size={19}
                    />
                  </div>

                  <h4>
                    Start the interview
                  </h4>

                  <p>
                    The AI interviewer will
                    generate role-specific
                    questions using the
                    selected candidate's
                    resume and saved job
                    description.
                  </p>

                  <button
                    type="button"
                    className="start-ai-button"
                    onClick={start}
                    disabled={
                      loading ||
                      !selected
                    }
                  >

                    <Sparkles
                      size={14}
                    />

                    {loading
                      ? "Preparing..."
                      : "Start AI interview"}

                    <ChevronRight
                      size={14}
                    />

                  </button>

                </div>
              )}


            {/* ACTIVE */}

            {running &&
              questions[current] && (
                <div className="active-ai-question">

                  <div className="question-label">
                    QUESTION{" "}
                    {current + 1}
                  </div>

                  <div className="question-text">
                    {
                      questions[current]
                        .question
                    }
                  </div>


                  {/* ANSWER */}

                  <div className="voice-answer">

                    <div className="answer-header">

                      <span>
                        CANDIDATE RESPONSE
                      </span>

                      {listening && (
                        <span className="listening-text">
                          <span></span>
                          Listening
                        </span>
                      )}

                    </div>

                    <textarea
                      value={answer}
                      onChange={(e) =>
                        setAnswer(
                          e.target.value
                        )
                      }
                      placeholder={
                        listening
                          ? "Listening to candidate..."
                          : "Candidate response will appear here..."
                      }
                    />


                    <div className="answer-actions">

                      <button
                        type="button"
                        className={`mic-answer-btn ${
                          listening
                            ? "listening"
                            : ""
                        }`}
                        onClick={
                          listening
                            ? stopListening
                            : startListening
                        }
                      >

                        {listening ? (
                          <>
                            <MicOff
                              size={14}
                            />
                            Stop listening
                          </>
                        ) : (
                          <>
                            <Mic
                              size={14}
                            />
                            Speak answer
                          </>
                        )}

                      </button>


                      <button
                        type="button"
                        className="send-answer-btn"
                        onClick={
                          saveAnswer
                        }
                        disabled={
                          loading ||
                          !answer.trim()
                        }
                      >

                        {loading ? (
                          <Loader2
                            size={14}
                            className="spin"
                          />
                        ) : (
                          <Send
                            size={14}
                          />
                        )}

                        {current ===
                        questions.length -
                          1
                          ? "Finish & evaluate"
                          : "Submit answer"}

                      </button>

                    </div>

                  </div>

                </div>
              )}


            {/* EVALUATION */}

            {evaluation && (
              <div className="final-evaluation">

                <div className="evaluation-heading">

                  <div className="evaluation-award">
                    <Award size={20} />
                  </div>

                  <div>

                    <span>
                      INTERVIEW COMPLETE
                    </span>

                    <strong>
                      AI Evaluation
                    </strong>

                  </div>

                </div>


                <div className="final-score">

                  <strong>
                    {evaluationScore !==
                    null
                      ? evaluationScore
                      : "—"}
                  </strong>

                  <span>
                    / 100
                  </span>

                </div>


                {evaluation?.summary && (
                  <div className="evaluation-content">

                    <label>
                      Summary
                    </label>

                    <p>
                      {evaluation.summary}
                    </p>

                  </div>
                )}


                {evaluation?.recommendation && (
                  <div className="evaluation-content">

                    <label>
                      Recommendation
                    </label>

                    <p>
                      {
                        evaluation.recommendation
                      }
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>

        </aside>

      </div>


      {/* =====================================================
          TRANSCRIPT
      ===================================================== */}

      <section className="transcript-section">

        <div className="section-heading">

          <div>

            <span className="panel-eyebrow">
              INTERVIEW RECORD
            </span>

            <h2>
              Live conversation transcript
            </h2>

          </div>

          <span className="response-count">
            {transcript.length} response
            {transcript.length !== 1
              ? "s"
              : ""}
          </span>

        </div>


        {transcript.length === 0 ? (
          <div className="transcript-empty">

            <div className="transcript-empty-icon">
              <MessageSquare
                size={20}
              />
            </div>

            <div>

              <strong>
                No responses captured yet
              </strong>

              <p>
                Candidate answers will appear
                here during the interview.
              </p>

            </div>

          </div>
        ) : (
          <div className="transcript-list">

            {transcript.map(
              (item, index) => (
                <div
                  className="transcript-item"
                  key={`${index}-${item.question}`}
                >

                  <div className="transcript-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="transcript-content">

                    <div className="transcript-question">

                      <span>
                        AI INTERVIEWER
                      </span>

                      <strong>
                        {item.question}
                      </strong>

                    </div>

                    <div className="transcript-answer">

                      <span>
                        CANDIDATE
                      </span>

                      <p>
                        {item.answer}
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </section>


      {/* =====================================================
          SCHEDULE
      ===================================================== */}

      <section className="schedule-section">

        <div className="schedule-intro">

          <div className="schedule-icon">
            <Calendar size={20} />
          </div>

          <div>

            <span className="panel-eyebrow">
              INTERVIEW SCHEDULING
            </span>

            <h2>
              Schedule an AI interview
            </h2>

            <p>
              Schedule a 45-minute AI video
              interview for the selected candidate.
            </p>

          </div>

        </div>


        <div className="schedule-form">

          <div className="schedule-field">

            <label>
              Interview date & time
            </label>

            <input
              type="datetime-local"
              value={schedule}
              onChange={(e) =>
                setSchedule(
                  e.target.value
                )
              }
            />

          </div>

          <button
            type="button"
            className="schedule-btn"
            onClick={
              scheduleInterview
            }
            disabled={
              loading ||
              !selected
            }
          >

            <Calendar size={15} />

            Schedule interview

          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="aii-footer">

        <div>
          <Brain size={14} />
          Resume & job based AI interview
        </div>

        <span>
          Camera and microphone are used for the
          live interview experience. Evaluation
          should be based on interview responses
          and job-related evidence.
        </span>

      </div>

    </div>
  );
}
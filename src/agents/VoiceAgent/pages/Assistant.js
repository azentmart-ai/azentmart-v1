import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaRobot,
  FaGraduationCap,
  FaHeadset,
  FaBullseye,
  FaFileInvoiceDollar,
  FaTools,
  FaPhoneAlt,
  FaEllipsisH,
  FaSearch,
  FaPlus,
  FaComments,
  FaGlobe,
  FaTimes,
} from "react-icons/fa";

import "./Assistant.css";

/* =========================================================
   ASSISTANT DATA
========================================================= */

export const ASSISTANTS = [
  {
    id: "course-enquiry",
    name: "Course Enquiry",
    category: "EDUCATION",
    type: "INBOUND",
    icon: FaGraduationCap,
    description: "Answer course enquiries, fees and admission questions.",
    languages: [
      "English",
      "Tamil",
      "Hindi",
      "Telugu",
      "Malayalam",
      "Kannada",
    ],
    topics: [
      "Course details",
      "Course duration",
      "Fees",
      "Eligibility",
      "Admission",
    ],
    greeting:
      "Hello! Welcome to AzentMart. How can I help you with our courses today?",
  },

  {
    id: "admission-support",
    name: "Admission Support",
    category: "EDUCATION",
    type: "INBOUND",
    icon: FaGraduationCap,
    description: "Guide students through applications and admissions.",
    languages: [
      "English",
      "Tamil",
      "Hindi",
      "Telugu",
      "Malayalam",
      "Kannada",
    ],
    topics: [
      "Admission",
      "Applications",
      "Eligibility",
      "Documents",
    ],
    greeting:
      "Hello! I am your admission support assistant. How can I help you?",
  },

  {
    id: "customer-support",
    name: "Customer Support",
    category: "SUPPORT",
    type: "INBOUND",
    icon: FaHeadset,
    description: "Handle customer questions and service requests.",
    languages: [
      "English",
      "Tamil",
      "Hindi",
      "Telugu",
      "Malayalam",
      "Kannada",
    ],
    topics: [
      "Customer questions",
      "Complaints",
      "Service requests",
      "Account support",
    ],
    greeting:
      "Hello! Welcome to AzentMart customer support. How can I help you?",
  },

  {
    id: "lead-qualification",
    name: "Lead Qualification",
    category: "SALES",
    type: "OUTBOUND",
    icon: FaBullseye,
    description:
      "Identify prospects and qualify leads for your sales team.",
    languages: [
      "English",
      "Tamil",
      "Hindi",
      "Telugu",
      "Malayalam",
      "Kannada",
    ],
    topics: [
      "Customer requirements",
      "Product interest",
      "Budget",
      "Lead qualification",
    ],
    greeting:
      "Hello! I am calling from AzentMart. May I know what you are looking for?",
  },

  {
    id: "billing-support",
    name: "Billing Support",
    category: "SUPPORT",
    type: "INBOUND",
    icon: FaFileInvoiceDollar,
    description:
      "Handle invoices, payments and billing issues.",
    languages: [
      "English",
      "Tamil",
      "Hindi",
      "Telugu",
      "Malayalam",
      "Kannada",
    ],
    topics: [
      "Invoices",
      "Payments",
      "Refunds",
      "Billing issues",
    ],
    greeting:
      "Hello! I am your billing support assistant. How can I help you?",
  },

  {
    id: "technical-support",
    name: "Technical Support",
    category: "SUPPORT",
    type: "INBOUND",
    icon: FaTools,
    description:
      "Help users troubleshoot common technical issues.",
    languages: [
      "English",
      "Tamil",
      "Hindi",
      "Telugu",
      "Malayalam",
      "Kannada",
    ],
    topics: [
      "Technical issues",
      "Troubleshooting",
      "Login problems",
      "System errors",
    ],
    greeting:
      "Hello! I am your technical support assistant. What problem are you facing?",
  },
];

/* =========================================================
   VOICE CONVERSATION
========================================================= */

function VoiceConversation({
  assistant,
  mode,
  onClose,
}) {
  const socketRef = useRef(null);

  const streamRef = useRef(null);

  const audioContextRef = useRef(null);

  const sourceRef = useRef(null);

  const processorRef = useRef(null);

  const silentGainRef = useRef(null);

  const messagesEndRef = useRef(null);

  const mountedRef = useRef(true);

  const closingRef = useRef(false);

  const nextAudioTimeRef = useRef(0);

  const [connected, setConnected] = useState(false);

  const [connecting, setConnecting] = useState(true);

  const [listening, setListening] = useState(false);

  const [speaking, setSpeaking] = useState(false);

  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);

  /* =========================================================
     ADD MESSAGE
  ========================================================= */

  const addMessage = useCallback((role, text) => {
    if (!text || !String(text).trim()) {
      return;
    }

    const cleanText = String(text).trim();

    setMessages((previous) => {
      const last = previous[previous.length - 1];

      /*
       * Merge consecutive transcript chunks
       * from the same speaker.
       */

      if (last && last.role === role) {
        return [
          ...previous.slice(0, -1),
          {
            ...last,
            text: `${last.text} ${cleanText}`.trim(),
          },
        ];
      }

      return [
        ...previous,
        {
          id: `${role}-${Date.now()}-${Math.random()}`,
          role,
          text: cleanText,
        },
      ];
    });
  }, []);

  /* =========================================================
     FLOAT32 -> PCM16
  ========================================================= */

  const floatToPCM16 = useCallback((input) => {
    const output = new Int16Array(input.length);

    for (let i = 0; i < input.length; i += 1) {
      let sample = input[i];

      if (sample > 1) {
        sample = 1;
      }

      if (sample < -1) {
        sample = -1;
      }

      output[i] =
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff;
    }

    return output;
  }, []);

  /* =========================================================
     RESAMPLE -> 16KHZ
  ========================================================= */

  const downsampleTo16k = useCallback(
    (buffer, sampleRate) => {
      const targetRate = 16000;

      if (sampleRate === targetRate) {
        return floatToPCM16(buffer);
      }

      if (sampleRate < targetRate) {
        return floatToPCM16(buffer);
      }

      const ratio = sampleRate / targetRate;

      const newLength = Math.round(
        buffer.length / ratio
      );

      const result =
        new Float32Array(newLength);

      let resultIndex = 0;

      let inputIndex = 0;

      while (
        resultIndex < result.length &&
        inputIndex < buffer.length
      ) {
        const nextInput = Math.round(
          (resultIndex + 1) * ratio
        );

        let total = 0;

        let count = 0;

        for (
          let i = inputIndex;
          i < nextInput &&
          i < buffer.length;
          i += 1
        ) {
          total += buffer[i];

          count += 1;
        }

        result[resultIndex] =
          count ? total / count : 0;

        resultIndex += 1;

        inputIndex = nextInput;
      }

      return floatToPCM16(result);
    },
    [floatToPCM16]
  );

  /* =========================================================
     WEBSOCKET URL
  ========================================================= */

  const getWebSocketURL = useCallback(() => {
    const protocol =
      window.location.protocol === "https:"
        ? "wss:"
        : "ws:";

    const params = new URLSearchParams();

    /*
     * IMPORTANT
     *
     * The Assistant page has frontend IDs such as:
     *
     * course-enquiry
     * admission-support
     * customer-support
     *
     * The backend may use database IDs.
     *
     * Therefore send the assistant name.
     */

    if (assistant?.name) {
      params.set(
        "assistant_name",
        assistant.name
      );
    }

    /*
     * Automatic language detection
     */

    params.set("language", "auto");

    /*
     * Authentication
     */

    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (token) {
      params.set("token", token);
    }

    /*
     * Conversation mode
     */

    params.set(
      "mode",
      mode === "roleplay"
        ? "roleplay"
        : "test"
    );

    const url =
      `${protocol}//127.0.0.1:8000` +
      `/api/voice/live?${params.toString()}`;

    console.log(
      "[VOICE] Assistant:",
      assistant?.name
    );

    console.log(
      "[VOICE] Mode:",
      mode
    );

    console.log(
      "[VOICE] WebSocket:",
      url
    );

    return url;
  }, [assistant, mode]);

  /* =========================================================
     PLAY AI AUDIO
     PCM16 / 24KHZ
  ========================================================= */

  const playPCM16Audio = useCallback(
    (arrayBuffer) => {
      const context =
        audioContextRef.current;

      if (!context) {
        return;
      }

      try {
        const pcm =
          new Int16Array(arrayBuffer);

        if (!pcm.length) {
          return;
        }

        /*
         * Backend audio is expected
         * to be PCM16 24KHz.
         */

        const sampleRate = 24000;

        const floatData =
          new Float32Array(
            pcm.length
          );

        for (
          let i = 0;
          i < pcm.length;
          i += 1
        ) {
          floatData[i] =
            pcm[i] / 32768;
        }

        const buffer =
          context.createBuffer(
            1,
            floatData.length,
            sampleRate
          );

        buffer
          .getChannelData(0)
          .set(floatData);

        const source =
          context.createBufferSource();

        source.buffer = buffer;

        source.connect(
          context.destination
        );

        const now =
          context.currentTime;

        if (
          nextAudioTimeRef.current < now
        ) {
          nextAudioTimeRef.current =
            now;
        }

        source.start(
          nextAudioTimeRef.current
        );

        nextAudioTimeRef.current +=
          buffer.duration;

        setSpeaking(true);

        source.onended = () => {
          if (
            context.currentTime >=
            nextAudioTimeRef.current - 0.05
          ) {
            setSpeaking(false);
          }
        };
      } catch (err) {
        console.error(
          "[VOICE] Playback error:",
          err
        );

        setError(
          "Unable to play AI audio."
        );
      }
    },
    []
  );

  /* =========================================================
     START MICROPHONE
  ========================================================= */

  const startMicrophone = useCallback(
    async () => {
      if (streamRef.current) {
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          }
        );

      streamRef.current =
        stream;

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        throw new Error(
          "Your browser does not support voice audio."
        );
      }

      const context =
        new AudioContext();

      audioContextRef.current =
        context;

      if (
        context.state === "suspended"
      ) {
        await context.resume();
      }

      const source =
        context.createMediaStreamSource(
          stream
        );

      sourceRef.current =
        source;

      /*
       * Smaller buffer means
       * lower microphone latency.
       */

      const processor =
        context.createScriptProcessor(
          2048,
          1,
          1
        );

      processorRef.current =
        processor;

      const silentGain =
        context.createGain();

      silentGain.gain.value = 0;

      silentGainRef.current =
        silentGain;

      processor.onaudioprocess =
        (event) => {
          const socket =
            socketRef.current;

          if (
            !socket ||
            socket.readyState !==
              WebSocket.OPEN ||
            closingRef.current
          ) {
            return;
          }

          const input =
            event.inputBuffer
              .getChannelData(0);

          const pcm =
            downsampleTo16k(
              input,
              context.sampleRate
            );

          try {
            socket.send(
              pcm.buffer
            );
          } catch (err) {
            console.error(
              "[VOICE] Microphone send error:",
              err
            );
          }
        };

      source.connect(processor);

      processor.connect(
        silentGain
      );

      silentGain.connect(
        context.destination
      );

      setListening(true);
    },
    [downsampleTo16k]
  );

  /* =========================================================
     STOP MICROPHONE
  ========================================================= */

  const stopMicrophone =
    useCallback(() => {
      try {
        if (processorRef.current) {
          processorRef.current.onaudioprocess =
            null;

          processorRef.current.disconnect();

          processorRef.current = null;
        }

        if (sourceRef.current) {
          sourceRef.current.disconnect();

          sourceRef.current = null;
        }

        if (silentGainRef.current) {
          silentGainRef.current.disconnect();

          silentGainRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

          streamRef.current = null;
        }

        if (audioContextRef.current) {
          const context =
            audioContextRef.current;

          audioContextRef.current =
            null;

          if (
            context.state !==
            "closed"
          ) {
            context
              .close()
              .catch(() => {});
          }
        }
      } catch (err) {
        console.error(
          "[VOICE] Cleanup error:",
          err
        );
      }

      setListening(false);
    }, []);

  /* =========================================================
     SERVER MESSAGE
  ========================================================= */

  const handleServerMessage =
    useCallback(
      async (event) => {
        /*
         * AI binary audio
         */

        if (
          event.data instanceof
          ArrayBuffer
        ) {
          playPCM16Audio(
            event.data
          );

          return;
        }

        /*
         * Blob audio
         */

        if (
          event.data instanceof Blob
        ) {
          try {
            const buffer =
              await event.data.arrayBuffer();

            playPCM16Audio(
              buffer
            );
          } catch (err) {
            console.error(
              "[VOICE] Blob audio error:",
              err
            );
          }

          return;
        }

        /*
         * JSON
         */

        if (
          typeof event.data !==
          "string"
        ) {
          return;
        }

        let data;

        try {
          data = JSON.parse(
            event.data
          );
        } catch (err) {
          console.error(
            "[VOICE] JSON error:",
            err
          );

          return;
        }

        console.log(
          "[VOICE] Server:",
          data
        );

        /* SESSION STARTED */

        if (
          data.type ===
          "session_started"
        ) {
          setConnected(true);

          setConnecting(false);

          setError("");

          return;
        }

        /* CONNECTED */

        if (
          data.type ===
          "connected"
        ) {
          setConnected(true);

          setConnecting(false);

          setListening(true);

          return;
        }

        /* USER TRANSCRIPT */

        if (
          data.type ===
          "user_transcript"
        ) {
          const text =
            data.text ||
            data.transcript ||
            "";

          if (text.trim()) {
            addMessage(
              "user",
              text
            );
          }

          setListening(false);

          return;
        }

        /* AI TRANSCRIPT */

        if (
          data.type ===
          "assistant_transcript"
        ) {
          const text =
            data.text ||
            data.transcript ||
            data.message ||
            "";

          if (text.trim()) {
            addMessage(
              "assistant",
              text
            );
          }

          return;
        }

        /* AI AUDIO START */

        if (
          data.type ===
          "assistant_audio_start"
        ) {
          setSpeaking(true);

          setListening(false);

          return;
        }

        /*
         * TURN COMPLETE
         *
         * IMPORTANT:
         * Do not stop microphone.
         *
         * This allows the user
         * to continue talking.
         */

        if (
          data.type ===
          "turn_complete"
        ) {
          setSpeaking(false);

          if (
            mountedRef.current &&
            !closingRef.current
          ) {
            setListening(true);
          }

          return;
        }

        /* INTERRUPTED */

        if (
          data.type ===
          "interrupted"
        ) {
          setSpeaking(false);

          nextAudioTimeRef.current =
            0;

          if (
            mountedRef.current &&
            !closingRef.current
          ) {
            setListening(true);
          }

          return;
        }

        /* BACKEND ERROR */

        if (
          data.type === "error"
        ) {
          console.error(
            "[VOICE] Backend error:",
            data.message
          );

          setError(
            data.message ||
              "Voice conversation error."
          );

          setSpeaking(false);
        }
      },
      [
        addMessage,
        playPCM16Audio,
      ]
    );

  /* =========================================================
     CONNECT WEBSOCKET
  ========================================================= */

  const connectVoice =
    useCallback(
      async () => {
        return new Promise(
          (resolve, reject) => {
            try {
              const url =
                getWebSocketURL();

              console.log(
                "[VOICE] Connecting:",
                url
              );

              const socket =
                new WebSocket(url);

              socket.binaryType =
                "arraybuffer";

              socketRef.current =
                socket;

              socket.onopen = () => {
                console.log(
                  "[VOICE] WebSocket connected"
                );

                setConnected(true);

                setConnecting(false);

                setError("");

                resolve(socket);
              };

              socket.onmessage =
                handleServerMessage;

              socket.onerror =
                (event) => {
                  console.error(
                    "[VOICE] WebSocket error:",
                    event
                  );

                  setError(
                    "Unable to connect to the voice server."
                  );

                  setConnecting(false);

                  reject(
                    new Error(
                      "Voice WebSocket connection failed."
                    )
                  );
                };

              socket.onclose =
                (event) => {
                  console.log(
                    "[VOICE] WebSocket closed:",
                    event.code,
                    event.reason
                  );

                  if (
                    socketRef.current ===
                    socket
                  ) {
                    socketRef.current =
                      null;
                  }

                  if (
                    mountedRef.current &&
                    !closingRef.current
                  ) {
                    setConnected(
                      false
                    );

                    setListening(
                      false
                    );

                    setSpeaking(
                      false
                    );
                  }
                };
            } catch (err) {
              reject(err);
            }
          }
        );
      },
      [
        getWebSocketURL,
        handleServerMessage,
      ]
    );

  /* =========================================================
     START VOICE
  ========================================================= */

  const startVoice =
    useCallback(async () => {
      try {
        closingRef.current =
          false;

        setError("");

        setMessages([]);

        nextAudioTimeRef.current =
          0;

        setConnecting(true);

        /*
         * Connect WebSocket
         */

        await connectVoice();

        /*
         * Start microphone
         */

        await startMicrophone();

        setConnected(true);

        setConnecting(false);

        setListening(true);
      } catch (err) {
        console.error(
          "[VOICE] Start failed:",
          err
        );

        stopMicrophone();

        if (socketRef.current) {
          try {
            socketRef.current.close();
          } catch {}
        }

        socketRef.current =
          null;

        setConnected(false);

        setConnecting(false);

        setListening(false);

        setError(
          err.message ||
            "Unable to start voice conversation."
        );
      }
    }, [
      connectVoice,
      startMicrophone,
      stopMicrophone,
    ]);

  /* =========================================================
     AUTO START
  ========================================================= */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        startVoice();
      }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [startVoice]);

  /* =========================================================
     CLOSE
  ========================================================= */

  const closeConversation =
    useCallback(() => {
      closingRef.current =
        true;

      stopMicrophone();

      if (socketRef.current) {
        try {
          socketRef.current.close(
            1000,
            "User ended conversation"
          );
        } catch {}
      }

      socketRef.current =
        null;

      setConnected(false);

      setConnecting(false);

      setListening(false);

      setSpeaking(false);

      nextAudioTimeRef.current =
        0;

      onClose();
    }, [
      onClose,
      stopMicrophone,
    ]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    mountedRef.current =
      true;

    return () => {
      mountedRef.current =
        false;

      closingRef.current =
        true;

      stopMicrophone();

      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch {}
      }

      socketRef.current =
        null;
    };
  }, [stopMicrophone]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    if (
      messagesEndRef.current
    ) {
      messagesEndRef.current.scrollIntoView(
        {
          behavior: "auto",
          block: "end",
        }
      );
    }
  }, [messages]);

  /* =========================================================
     VOICE UI
  ========================================================= */

  return (
    <div className="voice-overlay">

      {/* BACKDROP */}

      <div
        className="voice-backdrop"
        onClick={closeConversation}
      />

      {/* WINDOW */}

      <div className="voice-window">

        {/* HEADER */}

        <div className="voice-header">

          <div className="voice-brand">

            <div className="voice-brand-icon">
              <FaRobot />
            </div>

            <div>

              <h3>
                {assistant?.name ||
                  "AzentMart AI Assistant"}
              </h3>

              <span>

                <i
                  className={
                    connected
                      ? "voice-online"
                      : ""
                  }
                />

                {connecting
                  ? "Connecting..."
                  : connected
                    ? "Live conversation"
                    : "Disconnected"}

              </span>

            </div>

          </div>

          <button
            className="voice-close"
            onClick={closeConversation}
            type="button"
          >
            <FaTimes />
          </button>

        </div>

        {/* BODY */}

        <div className="voice-body">

          {/* AI ORB */}

          <div
            className={`voice-orb ${
              listening || speaking
                ? "voice-orb-active"
                : ""
            }`}
          >

            <div className="voice-orb-inner">
              <FaRobot />
            </div>

          </div>

          {/* STATUS */}

          <h2>

            {connecting
              ? "Connecting..."
              : speaking
                ? "AI is speaking"
                : listening
                  ? "I'm listening"
                  : assistant?.name}

          </h2>

          <p className="voice-subtitle">

            {mode === "roleplay"
              ? "Role Play • Speak naturally"
              : "Test • Speak naturally with your AI assistant"}

          </p>

          {/* MESSAGES */}

          <div className="voice-messages">

            {messages.length === 0 &&
              !error && (
                <div className="voice-empty-message">
                  {connecting
                    ? "Starting live voice conversation..."
                    : "Speak naturally. Your AI assistant is listening."}
                </div>
              )}

            {messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={`voice-message ${message.role}`}
                >

                  <small>
                    {message.role ===
                    "user"
                      ? "YOU"
                      : "AZENTMART AI"}
                  </small>

                  <div>
                    {message.text}
                  </div>

                </div>
              )
            )}

            <div
              ref={messagesEndRef}
            />

          </div>

          {/* VOICE WAVE */}

          <div
            className={`voice-wave ${
              listening || speaking
                ? "wave-active"
                : ""
            }`}
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          {/* STATUS */}

          <div className="voice-listening-text">

            {connecting
              ? "Connecting..."
              : speaking
                ? "AI is speaking..."
                : listening
                  ? "Listening..."
                  : connected
                    ? "Connected"
                    : "Ready"}

          </div>

          {/* ERROR */}

          {error && (
            <div className="voice-error">
              {error}
            </div>
          )}

          {/* END */}

          <button
            className="end-conversation"
            onClick={closeConversation}
            type="button"
          >
            End Conversation
          </button>

        </div>

        {/* FOOTER */}

        <div className="voice-footer">

          <span>🔒 Secure</span>

          <span>•</span>

          <span>Multilingual</span>

          <span>•</span>

          <span>Real-time</span>

          <span>•</span>

          <span>
            {connected
              ? "Connected"
              : "Connecting"}
          </span>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MAIN ASSISTANT PAGE
========================================================= */

function Assistant() {
  const navigate =
    useNavigate();

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("ALL");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    voiceOpen,
    setVoiceOpen,
  ] = useState(false);

  const [
    selectedAssistant,
    setSelectedAssistant,
  ] = useState(null);

  const [
    voiceMode,
    setVoiceMode,
  ] = useState("test");

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = [
    "ALL",
    "EDUCATION",
    "SUPPORT",
    "SALES",
  ];

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredAssistants =
    useMemo(() => {
      return ASSISTANTS.filter(
        (assistant) => {
          const categoryMatch =
            activeCategory === "ALL" ||
            assistant.category ===
              activeCategory;

          const searchValue =
            search
              .toLowerCase()
              .trim();

          const searchMatch =
            !searchValue ||
            assistant.name
              .toLowerCase()
              .includes(searchValue) ||
            assistant.description
              .toLowerCase()
              .includes(searchValue);

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      activeCategory,
      search,
    ]);

  /* =========================================================
     OPEN VOICE
  ========================================================= */

  const openVoice = (
    assistant,
    mode
  ) => {
    console.log(
      "[VOICE] Opening assistant:",
      assistant?.name
    );

    console.log(
      "[VOICE] Conversation mode:",
      mode
    );

    setSelectedAssistant(
      assistant
    );

    setVoiceMode(mode);

    setVoiceOpen(true);
  };

  /* =========================================================
     CLOSE VOICE
  ========================================================= */

  const closeVoice = () => {
    setVoiceOpen(false);

    setSelectedAssistant(null);
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="assistant-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="assistant-header">

        <div className="assistant-header-left">

          <div className="assistant-header-icon">
            <FaRobot />
          </div>

          <div>

            <div className="assistant-eyebrow">
              AI VOICE CONTROL CENTER
            </div>

            <h1>
              Assistants
            </h1>

            <p>
              Create and manage AI voice assistants.
            </p>

          </div>

        </div>

        <button
          className="create-assistant-btn"
          onClick={() =>
            navigate(
              "/agents/voice/dashboard/assistant-configuration/new"
            )
          }
          type="button"
        >

          <FaPlus />

          Create Assistant

        </button>

      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="assistant-toolbar">

        <div className="assistant-count">

          <span className="status-dot" />

          <strong>
            {filteredAssistants.length}
          </strong>

          <span>
            assistants available
          </span>

        </div>

        <div className="assistant-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search assistants..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

      </div>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <div className="assistant-categories">

        {categories.map(
          (category) => {
            const active =
              activeCategory ===
              category;

            return (
              <button
                key={category}
                className={
                  active
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                type="button"
              >

                {category ===
                  "ALL" && (
                  <FaRobot />
                )}

                {category ===
                  "EDUCATION" && (
                  <FaGraduationCap />
                )}

                {category ===
                  "SUPPORT" && (
                  <FaHeadset />
                )}

                {category ===
                  "SALES" && (
                  <FaBullseye />
                )}

                {category
                  .charAt(0)
                  .toUpperCase() +
                  category
                    .slice(1)
                    .toLowerCase()}

              </button>
            );
          }
        )}

      </div>

      {/* =====================================================
          ASSISTANT GRID
      ===================================================== */}

      <div className="assistant-grid">

        {filteredAssistants.map(
          (assistant) => {
            const Icon =
              assistant.icon;

            return (
              <div
                className="assistant-card"
                key={assistant.id}
              >

                {/* CARD HEADER */}

                <div className="assistant-card-top">

                  <div className="assistant-icon">
                    <Icon />
                  </div>

                  <div className="assistant-card-title">

                    <div className="assistant-name-row">

                      <h2>
                        {assistant.name}
                      </h2>

                      <span
                        className={
                          assistant.type ===
                          "OUTBOUND"
                            ? "type-badge outbound"
                            : "type-badge inbound"
                        }
                      >
                        {assistant.type}
                      </span>

                    </div>

                    <span className="assistant-category">
                      {assistant.category}
                    </span>

                  </div>

                  <button
                    className="more-btn"
                    title="More"
                    type="button"
                  >
                    <FaEllipsisH />
                  </button>

                </div>

                {/* DESCRIPTION */}

                <p className="assistant-description">
                  {assistant.description}
                </p>

                {/* LANGUAGES */}

                <div className="language-section">

                  <div className="section-label">

                    <FaGlobe />

                    <span>
                      Languages
                    </span>

                    <span className="language-count">
                      {assistant.languages.length}
                    </span>

                  </div>

                  <div className="language-list">

                    {assistant.languages
                      .slice(0, 4)
                      .map(
                        (language) => (
                          <span
                            key={language}
                            className="language-chip"
                          >
                            {language}
                          </span>
                        )
                      )}

                    {assistant.languages.length >
                      4 && (
                      <span className="language-chip">
                        +
                        {assistant.languages.length -
                          4}
                      </span>
                    )}

                  </div>

                </div>

                {/* CAPABILITIES */}

                <div className="topic-section">

                  <div className="section-label">

                    <FaComments />

                    <span>
                      Capabilities
                    </span>

                  </div>

                  <div className="topic-list">

                    {assistant.topics
                      .slice(0, 3)
                      .map(
                        (topic) => (
                          <span
                            key={topic}
                          >
                            {topic}
                          </span>
                        )
                      )}

                  </div>

                </div>

                {/* COMPANY */}

                <div className="assistant-company">

                  <span className="company-building">
                    ▦
                  </span>

                  AzentMart

                </div>

                {/* ACTIONS */}

                <div className="assistant-card-footer">

                  {/* ROLE PLAY */}

                  <button
                    className="role-play-btn"
                    onClick={() =>
                      openVoice(
                        assistant,
                        "roleplay"
                      )
                    }
                    type="button"
                  >

                    <FaGlobe />

                    Role Play

                  </button>

                  {/* TEST */}

                  <button
                    className="test-btn"
                    onClick={() =>
                      openVoice(
                        assistant,
                        "test"
                      )
                    }
                    type="button"
                  >

                    <FaPhoneAlt />

                    Test

                  </button>

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredAssistants.length ===
        0 && (
        <div className="assistant-empty">

          <div className="empty-icon">
            <FaRobot />
          </div>

          <h3>
            No assistants found
          </h3>

          <p>
            Try another search or category.
          </p>

        </div>
      )}

      {/* =====================================================
          VOICE CONVERSATION
      ===================================================== */}

      {voiceOpen &&
        selectedAssistant && (
          <VoiceConversation
            assistant={
              selectedAssistant
            }
            mode={voiceMode}
            onClose={closeVoice}
          />
        )}

    </div>
  );
}

export default Assistant;
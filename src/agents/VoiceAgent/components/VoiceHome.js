import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./VoiceHome.css";

function VoiceHome() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [activeNav, setActiveNav] = useState("Home");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [error, setError] = useState("");

  const [assistantName, setAssistantName] =
    useState("AzentMart AI");

  const [sessionId, setSessionId] = useState("");

  const [conversationMessages, setConversationMessages] =
    useState([]);

  // =========================================================
  // REFS
  // =========================================================

  const socketRef = useRef(null);

  const streamRef = useRef(null);

  const audioContextRef = useRef(null);

  const microphoneSourceRef = useRef(null);

  const processorRef = useRef(null);

  const silentGainRef = useRef(null);

  const mountedRef = useRef(true);

  const closingRef = useRef(false);

  const nextAudioTimeRef = useRef(0);

  const messagesEndRef = useRef(null);

  // IMPORTANT:
  // Prevent multiple microphone starts.
  const microphoneStartingRef = useRef(false);

  // =========================================================
  // PAGE DATA
  // =========================================================

  const solutions = [
    {
      number: "01",
      title: "Lead Qualification",
      text: "Identify interested prospects and qualify leads automatically.",
      icon: "↗",
    },
    {
      number: "02",
      title: "Customer Support",
      text: "Answer customer questions naturally and instantly.",
      icon: "◌",
    },
    {
      number: "03",
      title: "Admission Enquiry",
      text: "Handle course, eligibility and admission enquiries.",
      icon: "▣",
    },
    {
      number: "04",
      title: "Customer Follow-up",
      text: "Automatically handle reminders and customer follow-ups.",
      icon: "♡",
    },
  ];

  const features = [
    {
      title: "Natural Voice Conversations",
      text: "Human-like conversations with real-time voice responses.",
    },
    {
      title: "Inbound & Outbound Calls",
      text: "Handle incoming and outgoing customer conversations.",
    },
    {
      title: "Multilingual Conversations",
      text: "Customers can speak naturally in their preferred language.",
    },
    {
      title: "Call Intelligence",
      text: "Convert conversations into useful transcripts and outcomes.",
    },
    {
      title: "Lead Capture",
      text: "Collect customer requirements during the conversation.",
    },
    {
      title: "Follow-up Automation",
      text: "Keep customer conversations moving automatically.",
    },
  ];

  const industries = [
    "Education",
    "Sales",
    "Customer Support",
    "Real Estate",
    "Healthcare",
    "Finance",
  ];

  // =========================================================
  // SCROLL
  // =========================================================

  const scrollToSection = useCallback((id, name) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setActiveNav(name);
  }, []);

  // =========================================================
  // NAV SCROLL
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        ["home", "Home"],
        ["solutions", "Solutions"],
        ["how-it-works", "How It Works"],
        ["features", "Features"],
        ["industries", "Industries"],
      ];

      for (const [id, name] of sections) {
        const element = document.getElementById(id);

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.top <= 180 && rect.bottom >= 180) {
          setActiveNav(name);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // AUTO SCROLL CONVERSATION
  // =========================================================

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [conversationMessages]);

  // =========================================================
  // ADD CONVERSATION MESSAGE
  // =========================================================

  const addConversationMessage = useCallback(
    (role, text) => {
      if (!text || !text.trim()) {
        return;
      }

      const cleanText = text.trim();

      setConversationMessages((previous) => {
        const lastMessage =
          previous[previous.length - 1];

        /*
         * Only update the previous message when it is
         * explicitly a continuation of the same turn.
         *
         * Otherwise ALWAYS create a new message.
         */

        if (
          lastMessage &&
          lastMessage.role === role &&
          lastMessage.isStreaming === true
        ) {
          return [
            ...previous.slice(0, -1),
            {
              ...lastMessage,
              text: cleanText,
            },
          ];
        }

        return [
          ...previous,
          {
            id:
              `${Date.now()}-${Math.random()}`,
            role,
            text: cleanText,
            isStreaming: false,
          },
        ];
      });
    },
    []
  );

  // =========================================================
  // FLOAT -> PCM16
  // =========================================================

  const floatToPCM16 = useCallback((input) => {
    const output = new Int16Array(
      input.length
    );

    for (let i = 0; i < input.length; i++) {
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

  // =========================================================
  // RESAMPLE TO 16 KHZ
  // =========================================================

  const downsampleTo16k = useCallback(
    (buffer, sampleRate) => {
      const targetRate = 16000;

      if (sampleRate === targetRate) {
        return floatToPCM16(buffer);
      }

      if (sampleRate < targetRate) {
        return floatToPCM16(buffer);
      }

      const ratio =
        sampleRate / targetRate;

      const newLength =
        Math.round(
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
        const nextInput =
          Math.round(
            (resultIndex + 1) * ratio
          );

        let total = 0;
        let count = 0;

        for (
          let i = inputIndex;
          i < nextInput &&
          i < buffer.length;
          i++
        ) {
          total += buffer[i];
          count++;
        }

        result[resultIndex] =
          count > 0
            ? total / count
            : 0;

        resultIndex++;

        inputIndex = nextInput;
      }

      return floatToPCM16(result);
    },
    [floatToPCM16]
  );

  // =========================================================
  // WEBSOCKET URL
  // =========================================================

  const getWebSocketURL = useCallback(() => {
    const protocol =
      window.location.protocol === "https:"
        ? "wss:"
        : "ws:";

    let url =
      `${protocol}//127.0.0.1:8000/api/voice/live`;

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {
      url +=
        `?token=${encodeURIComponent(token)}`;
    }

    return url;
  }, []);

  // =========================================================
  // PLAY GEMINI PCM AUDIO
  // =========================================================

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

        const sampleRate = 24000;

        const floatData =
          new Float32Array(
            pcm.length
          );

        for (
          let i = 0;
          i < pcm.length;
          i++
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

        const currentTime =
          context.currentTime;

        if (
          nextAudioTimeRef.current <
          currentTime
        ) {
          nextAudioTimeRef.current =
            currentTime;
        }

        source.start(
          nextAudioTimeRef.current
        );

        nextAudioTimeRef.current +=
          buffer.duration;

        setIsSpeaking(true);

        source.onended = () => {
          if (
            context.currentTime >=
            nextAudioTimeRef.current - 0.05
          ) {
            setIsSpeaking(false);

            /*
             * IMPORTANT:
             * After AI finishes speaking,
             * make sure microphone remains alive.
             */

            if (
              mountedRef.current &&
              !closingRef.current
            ) {
              setIsListening(true);
            }
          }
        };
      } catch (error) {
        console.error(
          "[VOICE] Audio playback error:",
          error
        );
      }
    },
    []
  );

  // =========================================================
  // CHECK MICROPHONE
  // =========================================================

  const isMicrophoneAlive = useCallback(() => {
    const stream =
      streamRef.current;

    const context =
      audioContextRef.current;

    const processor =
      processorRef.current;

    if (!stream) {
      return false;
    }

    const tracks =
      stream.getAudioTracks();

    if (!tracks.length) {
      return false;
    }

    const trackAlive =
      tracks.some(
        (track) =>
          track.readyState === "live"
      );

    if (!trackAlive) {
      return false;
    }

    if (!context) {
      return false;
    }

    if (context.state === "closed") {
      return false;
    }

    if (!processor) {
      return false;
    }

    return true;
  }, []);

  // =========================================================
  // START MICROPHONE
  // =========================================================

  const startMicrophone = useCallback(
    async () => {
      if (
        microphoneStartingRef.current
      ) {
        return;
      }

      /*
       * If microphone is already working,
       * DO NOT recreate it.
       */

      if (isMicrophoneAlive()) {
        setIsListening(true);
        return;
      }

      microphoneStartingRef.current =
        true;

      try {
        console.log(
          "[VOICE] Starting microphone..."
        );

        // -----------------------------------------
        // CLEAN OLD MICROPHONE FIRST
        // -----------------------------------------

        if (processorRef.current) {
          try {
            processorRef.current.disconnect();
          } catch {}
          processorRef.current =
            null;
        }

        if (
          microphoneSourceRef.current
        ) {
          try {
            microphoneSourceRef.current.disconnect();
          } catch {}
          microphoneSourceRef.current =
            null;
        }

        if (silentGainRef.current) {
          try {
            silentGainRef.current.disconnect();
          } catch {}
          silentGainRef.current =
            null;
        }

        if (streamRef.current) {
          streamRef.current
            .getTracks()
            .forEach((track) => {
              try {
                track.stop();
              } catch {}
            });

          streamRef.current = null;
        }

        if (audioContextRef.current) {
          try {
            await audioContextRef.current.close();
          } catch {}

          audioContextRef.current =
            null;
        }

        // -----------------------------------------
        // GET MICROPHONE
        // -----------------------------------------

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

        streamRef.current = stream;

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

        microphoneSourceRef.current =
          source;

        const processor =
          context.createScriptProcessor(
            4096,
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
                WebSocket.OPEN
            ) {
              return;
            }

            if (closingRef.current) {
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
            } catch (error) {
              console.error(
                "[VOICE] Send audio error:",
                error
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

        setIsListening(true);

        console.log(
          "[VOICE] Microphone started."
        );

        console.log(
          "[VOICE] Sample rate:",
          context.sampleRate
        );
      } finally {
        microphoneStartingRef.current =
          false;
      }
    },
    [
      downsampleTo16k,
      isMicrophoneAlive,
    ]
  );

  // =========================================================
  // ENSURE MICROPHONE AFTER EVERY TURN
  // =========================================================

  const ensureMicrophone = useCallback(
    async () => {
      if (
        closingRef.current ||
        !mountedRef.current
      ) {
        return;
      }

      if (
        !socketRef.current ||
        socketRef.current.readyState !==
          WebSocket.OPEN
      ) {
        return;
      }

      if (!isMicrophoneAlive()) {
        console.log(
          "[VOICE] Microphone is not alive."
        );

        console.log(
          "[VOICE] Restarting microphone..."
        );

        try {
          await startMicrophone();

          console.log(
            "[VOICE] Microphone restarted."
          );
        } catch (error) {
          console.error(
            "[VOICE] Microphone restart failed:",
            error
          );

          setError(
            "Microphone stopped. Please allow microphone access and try again."
          );
        }
      } else {
        console.log(
          "[VOICE] Microphone still active."
        );

        setIsListening(true);
      }
    },
    [
      isMicrophoneAlive,
      startMicrophone,
    ]
  );

  // =========================================================
  // STOP MICROPHONE
  // =========================================================

  const stopMicrophone =
    useCallback(() => {
      try {
        if (processorRef.current) {
          processorRef.current.disconnect();

          processorRef.current.onaudioprocess =
            null;

          processorRef.current =
            null;
        }

        if (
          microphoneSourceRef.current
        ) {
          microphoneSourceRef.current.disconnect();

          microphoneSourceRef.current =
            null;
        }

        if (silentGainRef.current) {
          silentGainRef.current.disconnect();

          silentGainRef.current =
            null;
        }

        if (streamRef.current) {
          streamRef.current
            .getTracks()
            .forEach((track) => {
              try {
                track.stop();
              } catch {}
            });

          streamRef.current =
            null;
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
      } catch (error) {
        console.error(
          "[VOICE] Stop microphone error:",
          error
        );
      }

      setIsListening(false);
    }, []);

  // =========================================================
  // HANDLE SERVER MESSAGE
  // =========================================================

  const handleServerMessage =
    useCallback(
      async (event) => {
        // =====================================================
        // BINARY AUDIO
        // =====================================================

        if (
          event.data instanceof ArrayBuffer
        ) {
          playPCM16Audio(
            event.data
          );

          return;
        }

        // =====================================================
        // BLOB AUDIO
        // =====================================================

        if (
          event.data instanceof Blob
        ) {
          try {
            const buffer =
              await event.data.arrayBuffer();

            playPCM16Audio(buffer);
          } catch (error) {
            console.error(
              "[VOICE] Blob audio error:",
              error
            );
          }

          return;
        }

        // =====================================================
        // JSON
        // =====================================================

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
        } catch (error) {
          console.error(
            "[VOICE] JSON error:",
            error
          );

          return;
        }

        console.log(
          "[VOICE] Server message:",
          data
        );

        // =====================================================
        // SESSION STARTED
        // =====================================================

        if (
          data.type ===
          "session_started"
        ) {
          setIsConnected(true);
          setError("");

          if (
            data.assistant_name
          ) {
            setAssistantName(
              data.assistant_name
            );
          }

          if (data.session_id) {
            setSessionId(
              data.session_id
            );
          }

          return;
        }

        // =====================================================
        // CONNECTED
        // =====================================================

        if (
          data.type === "connected"
        ) {
          setIsConnected(true);
          setError("");

          if (
            data.assistant_name
          ) {
            setAssistantName(
              data.assistant_name
            );
          }

          if (data.session_id) {
            setSessionId(
              data.session_id
            );
          }

          // Make absolutely sure microphone
          // is alive after WebSocket connection.
          setTimeout(() => {
            ensureMicrophone();
          }, 100);

          return;
        }

        // =====================================================
        // USER TRANSCRIPT
        // =====================================================

        if (
          data.type ===
          "user_transcript"
        ) {
          console.log(
            "[VOICE] USER FINAL:",
            data.text
          );

          if (data.text) {
            addConversationMessage(
              "user",
              data.text
            );
          }

          return;
        }

        // =====================================================
        // ASSISTANT TRANSCRIPT
        // =====================================================

        if (
          data.type ===
          "assistant_transcript"
        ) {
          console.log(
            "[VOICE] AI FINAL:",
            data.text
          );

          if (data.text) {
            addConversationMessage(
              "assistant",
              data.text
            );
          }

          return;
        }

        // =====================================================
        // AI AUDIO START
        // =====================================================

        if (
          data.type ===
          "assistant_audio_start"
        ) {
          setIsSpeaking(true);

          return;
        }

        // =====================================================
        // TURN COMPLETE
        // =====================================================

        if (
          data.type ===
          "turn_complete"
        ) {
          console.log(
            "[VOICE] TURN COMPLETE"
          );

          setIsSpeaking(false);

          /*
           * THIS IS THE IMPORTANT FIX.
           *
           * turn_complete means:
           *
           * AI finished THIS turn.
           *
           * It does NOT mean:
           *
           * conversation finished.
           */

          if (
            mountedRef.current &&
            !closingRef.current
          ) {
            setIsListening(true);

            // Check microphone again.
            setTimeout(() => {
              ensureMicrophone();
            }, 100);
          }

          return;
        }

        // =====================================================
        // INTERRUPTED
        // =====================================================

        if (
          data.type ===
          "interrupted"
        ) {
          console.log(
            "[VOICE] AI interrupted."
          );

          setIsSpeaking(false);

          nextAudioTimeRef.current =
            0;

          if (
            mountedRef.current &&
            !closingRef.current
          ) {
            setTimeout(() => {
              ensureMicrophone();
            }, 100);
          }

          return;
        }

        // =====================================================
        // ERROR
        // =====================================================

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

          setIsSpeaking(false);

          return;
        }
      },
      [
        playPCM16Audio,
        addConversationMessage,
        ensureMicrophone,
      ]
    );

  // =========================================================
  // CONNECT WEBSOCKET
  // =========================================================

  const connectVoice =
    useCallback(async () => {
      return new Promise(
        (resolve, reject) => {
          try {
            const token =
              localStorage.getItem(
                "access_token"
              );

            const url =
              getWebSocketURL();

            console.log(
              "================================"
            );

            console.log(
              "[VOICE] Connecting..."
            );

            console.log(
              "[VOICE] URL:",
              url
            );

            console.log(
              "[VOICE] Token:",
              token
                ? "FOUND"
                : "NOT FOUND"
            );

            console.log(
              "[VOICE] Continuous mode: ON"
            );

            console.log(
              "================================"
            );

            const socket =
              new WebSocket(url);

            socket.binaryType =
              "arraybuffer";

            socketRef.current =
              socket;

            socket.onopen = () => {
              console.log(
                "[VOICE] WebSocket OPEN"
              );

              setIsConnected(true);

              setError("");

              resolve(socket);
            };

            socket.onmessage =
              handleServerMessage;

            socket.onerror = (event) => {
              console.error(
                "[VOICE] WebSocket ERROR:",
                event
              );

              setError(
                "Unable to connect to the voice server. Make sure FastAPI is running on port 8000."
              );

              reject(
                new Error(
                  "Voice WebSocket connection failed."
                )
              );
            };

            socket.onclose =
              (event) => {
                console.log(
                  "[VOICE] WebSocket CLOSED:",
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
                  setIsConnected(
                    false
                  );

                  setIsListening(
                    false
                  );

                  setIsSpeaking(
                    false
                  );
                }
              };
          } catch (error) {
            console.error(
              "[VOICE] Connection exception:",
              error
            );

            reject(error);
          }
        }
      );
    }, [
      getWebSocketURL,
      handleServerMessage,
    ]);

  // =========================================================
  // START FULL VOICE SESSION
  // =========================================================

  const startVoiceConversation =
    useCallback(async () => {
      if (isConnecting) {
        return;
      }

      if (isConnected) {
        return;
      }

      closingRef.current =
        false;

      setError("");

      setIsConnecting(true);

      try {
        console.log(
          "[VOICE] Starting continuous voice conversation..."
        );

        // -----------------------------------------
        // CONNECT WEBSOCKET
        // -----------------------------------------

        await connectVoice();

        // -----------------------------------------
        // START MICROPHONE
        // -----------------------------------------

        await startMicrophone();

        setIsConnecting(false);

        setIsConnected(true);

        setIsListening(true);

        console.log(
          "[VOICE] ================================="
        );

        console.log(
          "[VOICE] CONTINUOUS CONVERSATION READY"
        );

        console.log(
          "[VOICE] Microphone ACTIVE"
        );

        console.log(
          "[VOICE] WebSocket ACTIVE"
        );

        console.log(
          "[VOICE] ================================="
        );
      } catch (error) {
        console.error(
          "[VOICE] Start error:",
          error
        );

        stopMicrophone();

        if (socketRef.current) {
          try {
            socketRef.current.close();
          } catch {}

          socketRef.current =
            null;
        }

        setIsConnecting(false);

        setIsConnected(false);

        setIsListening(false);

        setIsSpeaking(false);

        setError(
          error.message ||
            "Unable to start voice conversation."
        );
      }
    }, [
      connectVoice,
      isConnected,
      isConnecting,
      startMicrophone,
      stopMicrophone,
    ]);

  // =========================================================
  // OPEN VOICE CHAT
  // =========================================================

  const openVoiceChat =
    useCallback(() => {
      closingRef.current =
        false;

      setConversationMessages([]);

      setIsChatOpen(true);

      setError("");

      setSessionId("");

      setAssistantName(
        "AzentMart AI"
      );

      setTimeout(() => {
        startVoiceConversation();
      }, 150);
    }, [
      startVoiceConversation,
    ]);

  // =========================================================
  // CLOSE VOICE CHAT
  // =========================================================

  const closeVoiceChat =
    useCallback(() => {
      console.log(
        "[VOICE] User ended conversation."
      );

      closingRef.current =
        true;

      stopMicrophone();

      const socket =
        socketRef.current;

      if (socket) {
        try {
          if (
            socket.readyState ===
              WebSocket.OPEN ||
            socket.readyState ===
              WebSocket.CONNECTING
          ) {
            socket.close(
              1000,
              "User ended conversation"
            );
          }
        } catch (error) {
          console.error(
            "[VOICE] Close error:",
            error
          );
        }
      }

      socketRef.current =
        null;

      setIsChatOpen(false);

      setIsConnecting(false);

      setIsConnected(false);

      setIsListening(false);

      setIsSpeaking(false);

      nextAudioTimeRef.current =
        0;
    }, [stopMicrophone]);

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current =
        false;

      closingRef.current =
        true;

      stopMicrophone();

      if (socketRef.current) {
        try {
          socketRef.current.close(
            1000,
            "Page closed"
          );
        } catch {}
      }

      socketRef.current =
        null;
    };
  }, [stopMicrophone]);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="voice-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="voice-header">
        <div className="voice-nav">

          <button
            className="brand"
            onClick={() =>
              scrollToSection(
                "home",
                "Home"
              )
            }
          >
            <div className="brand-logo">
              A
            </div>

            <div className="brand-text">
              <strong>
                AzentMart
              </strong>

              <span>
                AI VOICE
              </span>
            </div>
          </button>

          <nav className="nav-links">
            {[
              ["home", "Home"],
              ["solutions", "Solutions"],
              [
                "how-it-works",
                "How It Works",
              ],
              ["features", "Features"],
              [
                "industries",
                "Industries",
              ],
            ].map(
              ([id, name]) => (
                <button
                  key={name}
                  className={
                    activeNav === name
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={() =>
                    scrollToSection(
                      id,
                      name
                    )
                  }
                >
                  {name}
                </button>
              )
            )}
          </nav>

          <div className="nav-actions">

            <button
              className="sign-in-btn"
              onClick={() =>
                navigate(
                  "/agents/voice/signup"
                )
              }
            >
              Sign up
            </button>

            <button
              className="get-started-btn"
              onClick={() =>
                navigate(
                  "/agents/voice/login"
                )
              }
            >
              Login
              <span>→</span>
            </button>

          </div>

        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section
          id="home"
          className="hero-section"
        >
          <div className="hero-container">

            <div className="hero-content">

              <div className="eyebrow">
                <span className="status-dot"></span>
                AI VOICE FOR BUSINESS
              </div>

              <h1>
                Turn every call
                <br />
                into a{" "}
                <span>
                  business
                </span>
                <br />
                opportunity.
              </h1>

              <p className="hero-description">
                AzentMart AI handles
                customer conversations
                automatically — from lead
                qualification and customer
                support to admission
                enquiries and customer
                follow-ups.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-btn"
                  onClick={() =>
                    scrollToSection(
                      "solutions",
                      "Solutions"
                    )
                  }
                >
                  Explore Voice AI
                  <span>→</span>
                </button>

                <button
                  className="secondary-btn"
                  onClick={
                    openVoiceChat
                  }
                >
                  <span className="play-icon">
                    ▶
                  </span>

                  Try Voice Demo
                </button>

              </div>

              <div className="hero-meta">
                <span>
                  24/7 Voice Availability
                </span>

                <i></i>

                <span>
                  Inbound & Outbound
                </span>

                <i></i>

                <span>
                  Multilingual
                </span>
              </div>

            </div>

            <div className="hero-visual">

              <div className="call-card">

                <div className="call-top">

                  <div className="live-status">
                    <span></span>
                    LIVE AI CALL
                  </div>

                  <span className="call-time">
                    00:48
                  </span>

                </div>

                <div className="call-divider"></div>

                <div className="caller">

                  <div className="caller-avatar">
                    P
                  </div>

                  <div className="caller-info">
                    <strong>
                      Priya Kumar
                    </strong>

                    <span>
                      Admission enquiry
                    </span>
                  </div>

                  <div className="wave-small">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

                <div className="conversation">

                  <div className="message ai-message">

                    <div className="ai-avatar">
                      A
                    </div>

                    <div>
                      <small>
                        AZENTMART AI
                      </small>

                      <p>
                        Hello Priya, how
                        can I help you
                        today?
                      </p>
                    </div>

                  </div>

                  <div className="message customer-message">

                    <div>
                      <small>
                        CUSTOMER
                      </small>

                      <p>
                        I want to know
                        about the admission
                        process.
                      </p>
                    </div>

                    <div className="customer-avatar">
                      P
                    </div>

                  </div>

                  <div className="message ai-message">

                    <div className="ai-avatar">
                      A
                    </div>

                    <div>
                      <small>
                        AZENTMART AI
                      </small>

                      <p>
                        Sure. Which
                        course are you
                        interested in?
                      </p>
                    </div>

                  </div>

                </div>

                <div className="listening">

                  <div className="voice-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <span>
                    Natural voice
                    conversation
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="stats-container">

            <div className="stat">
              <strong>
                10,000+
              </strong>
              <span>
                Calls handled
              </span>
            </div>

            <div className="stat">
              <strong>
                2,500+
              </strong>
              <span>
                Leads engaged
              </span>
            </div>

            <div className="stat">
              <strong>
                24/7
              </strong>
              <span>
                Voice availability
              </span>
            </div>

            <div className="stat">
              <strong>
                8+
              </strong>
              <span>
                Languages
              </span>
            </div>

          </div>

        </section>

        {/* =====================================================
            SOLUTIONS
        ===================================================== */}

        <section
          id="solutions"
          className="section solutions-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                BUSINESS SOLUTIONS
              </span>

              <h2>
                Voice AI built for
                <br />
                <span>
                  real conversations.
                </span>
              </h2>

            </div>

            <p>
              Automate repetitive calls
              while keeping every customer
              interaction natural and useful.
            </p>

          </div>

          <div className="solution-grid">

            {solutions.map(
              (item) => (
                <div
                  className="solution-card"
                  key={item.number}
                >

                  <div className="card-number">
                    {item.number}
                  </div>

                  <div className="solution-icon">
                    {item.icon}
                  </div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.text}
                  </p>

                  <button
                    className="text-link"
                    onClick={
                      openVoiceChat
                    }
                  >
                    Try it
                    <span>→</span>
                  </button>

                </div>
              )
            )}

          </div>

        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          id="how-it-works"
          className="section process-section"
        >

          <div className="process-heading">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              From customer call
              <br />
              <span>
                to business action.
              </span>
            </h2>

          </div>

          <div className="process-grid">

            {[
              [
                "01",
                "Customer connects",
                "A customer calls your business or starts a voice conversation.",
              ],
              [
                "02",
                "AI understands",
                "The AI understands the customer's intent and requirements.",
              ],
              [
                "03",
                "AI responds",
                "The AI responds naturally using real-time voice.",
              ],
              [
                "04",
                "Action happens",
                "Qualify, support, capture details or follow up automatically.",
              ],
            ].map(
              ([
                number,
                title,
                text,
              ]) => (
                <div
                  className="process-card"
                  key={number}
                >

                  <div className="process-top">
                    <span>
                      {number}
                    </span>

                    <div>
                      ✦
                    </div>
                  </div>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>

                </div>
              )
            )}

          </div>

        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="section features-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                VOICE INTELLIGENCE
              </span>

              <h2>
                Every conversation
                <br />
                <span>
                  becomes useful.
                </span>
              </h2>

            </div>

          </div>

          <div className="features-grid">

            {features.map(
              (feature, index) => (
                <div
                  className="feature-card"
                  key={
                    feature.title
                  }
                >

                  <div className="feature-icon">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div>

                    <h3>
                      {feature.title}
                    </h3>

                    <p>
                      {feature.text}
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </section>

        {/* =====================================================
            INDUSTRIES
        ===================================================== */}

        <section
          id="industries"
          className="section industries-section"
        >

          <div className="industries-heading">

            <span className="section-label">
              INDUSTRIES
            </span>

            <h2>
              One voice platform.
              <br />
              <span>
                Many business needs.
              </span>
            </h2>

          </div>

          <div className="industry-grid">

            {industries.map(
              (industry, index) => (
                <div
                  className="industry-card"
                  key={industry}
                >

                  <span className="industry-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3>
                    {industry}
                  </h3>

                  <p>
                    Use real-time AI
                    voice conversations
                    for{" "}
                    {industry.toLowerCase()}{" "}
                    related customer
                    interactions.
                  </p>

                  <button
                    className="industry-link"
                    onClick={
                      openVoiceChat
                    }
                  >
                    Try Voice AI
                    <span>→</span>
                  </button>

                </div>
              )
            )}

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="cta-section">

          <div className="cta-content">

            <div>

              <span className="section-label">
                READY TO START?
              </span>

              <h2>
                Make every customer
                <br />
                conversation count.
              </h2>

              <p>
                Talk with AzentMart AI
                and experience a
                real-time voice
                conversation.
              </p>

            </div>

            <button
              className="cta-button"
              onClick={
                openVoiceChat
              }
            >
              Talk to AI
              <span>→</span>
            </button>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="voice-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="footer-logo">
              A
            </div>

            <div>
              <strong>
                AzentMart AI
              </strong>

              <p>
                Real-time AI voice
                conversations for
                modern businesses.
              </p>
            </div>

          </div>

          <div className="footer-column">

            <h4>
              Platform
            </h4>

            <button
              onClick={() =>
                scrollToSection(
                  "solutions",
                  "Solutions"
                )
              }
            >
              Solutions
            </button>

            <button
              onClick={() =>
                scrollToSection(
                  "features",
                  "Features"
                )
              }
            >
              Features
            </button>

            <button
              onClick={() =>
                scrollToSection(
                  "how-it-works",
                  "How It Works"
                )
              }
            >
              How It Works
            </button>

          </div>

          <div className="footer-column">

            <h4>
              Voice AI
            </h4>

            <button
              onClick={
                openVoiceChat
              }
            >
              Lead Qualification
            </button>

            <button
              onClick={
                openVoiceChat
              }
            >
              Customer Support
            </button>

            <button
              onClick={
                openVoiceChat
              }
            >
              Multilingual Voice
            </button>

          </div>

          <div className="footer-column">

            <h4>
              Account
            </h4>

            <button
              onClick={() =>
                navigate(
                  "/agents/voice/login"
                )
              }
            >
              Login
            </button>

            <button
              onClick={() =>
                navigate(
                  "/agents/voice/signup"
                )
              }
            >
              Create Account
            </button>

            <button
              onClick={
                openVoiceChat
              }
            >
              Try Voice Demo
            </button>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 AzentMart AI.
            All rights reserved.
          </span>

          <span>
            Voice AI · Multilingual ·
            Real-time
          </span>

        </div>

      </footer>

      {/* =====================================================
          FLOATING TALK TO AI
      ===================================================== */}

      <button
        className="floating-ai"
        onClick={
          openVoiceChat
        }
      >
        <span className="floating-star">
          ✦
        </span>

        Talk to AI

        <span>↗</span>
      </button>

      {/* =====================================================
          VOICE CHAT POPUP
      ===================================================== */}

      {isChatOpen && (
        <div
          className="voice-chat-overlay"
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeVoiceChat();
            }
          }}
        >

          <div
            className="voice-chat-panel voice-only-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="voice-chat-header">

              <div className="voice-chat-brand">

                <div className="voice-chat-logo">
                  A
                </div>

                <div>

                  <strong>
                    {assistantName}
                  </strong>

                  <span>

                    <i
                      className={
                        isConnected
                          ? "online-dot active"
                          : "online-dot"
                      }
                    ></i>

                    {isConnecting
                      ? "Connecting..."
                      : isConnected
                        ? "Live conversation"
                        : "Voice assistant"}

                  </span>

                </div>

              </div>

              <button
                className="voice-chat-close"
                onClick={
                  closeVoiceChat
                }
              >
                ×
              </button>

            </div>

            {/* =================================================
                VOICE BODY
            ================================================= */}

            <div className="voice-only-body">

              {/* VOICE ORB */}

              <div
                className={
                  isSpeaking
                    ? "voice-orb speaking"
                    : isListening
                      ? "voice-orb listening"
                      : "voice-orb"
                }
              >
                <div className="voice-orb-inner">
                  ✦
                </div>
              </div>

              <h2>

                {isConnecting
                  ? "Connecting..."
                  : isSpeaking
                    ? "AzentMart AI is speaking"
                    : isListening
                      ? "I'm listening"
                      : "AzentMart AI"}

              </h2>

              <p className="voice-only-description">

                {isConnecting
                  ? "Connecting you to the live voice assistant..."
                  : isSpeaking
                    ? "You can interrupt me anytime."
                    : isListening
                      ? "Speak naturally. You can continue the conversation."
                      : "Start a voice conversation and speak naturally."}

              </p>

              {/* =================================================
                  CONVERSATION HISTORY
              ================================================= */}

              <div className="voice-conversation">

                {conversationMessages.length ===
                0 ? (
                  <div className="conversation-empty">

                    <span>
                      🎙
                    </span>

                    <p>
                      Your conversation
                      will appear here.
                    </p>

                  </div>
                ) : (
                  conversationMessages.map(
                    (message) => (
                      <div
                        key={
                          message.id
                        }
                        className={
                          message.role ===
                          "user"
                            ? "conversation-message user-message"
                            : "conversation-message assistant-message"
                        }
                      >

                        {message.role ===
                          "assistant" && (
                          <div className="conversation-avatar">
                            A
                          </div>
                        )}

                        <div className="conversation-bubble">

                          <span className="conversation-label">
                            {message.role ===
                            "user"
                              ? "YOU"
                              : "AZENTMART AI"}
                          </span>

                          <p>
                            {message.text}
                          </p>

                        </div>

                        {message.role ===
                          "user" && (
                          <div className="conversation-avatar user-avatar">
                            U
                          </div>
                        )}

                      </div>
                    )
                  )
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>

              {/* =================================================
                  LIVE WAVE
              ================================================= */}

              <div
                className={
                  isSpeaking ||
                  isListening
                    ? "live-wave active"
                    : "live-wave"
                }
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              {/* =================================================
                  LANGUAGE
              ================================================= */}

              <div className="voice-language-badge">

                <span>
                  🌐
                </span>

                <div>

                  <strong>
                    Automatic Language
                  </strong>

                  <small>
                    English · Tamil ·
                    Hindi · Telugu ·
                    Malayalam · Kannada ·
                    Bengali +
                  </small>

                </div>

              </div>

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="voice-error">

                  <span>
                    !
                  </span>

                  <p>
                    {error}
                  </p>

                  <button
                    onClick={() =>
                      setError("")
                    }
                  >
                    ×
                  </button>

                </div>
              )}

            </div>

            {/* =================================================
                CONTROLS
            ================================================= */}

            <div className="voice-control-area">

              <div
                className={
                  isListening
                    ? "voice-visualizer active"
                    : "voice-visualizer"
                }
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="voice-status-text">

                <strong>

                  {isConnecting
                    ? "Connecting..."
                    : isSpeaking
                      ? "AI is speaking..."
                      : isListening
                        ? "Listening..."
                        : isConnected
                          ? "Ready"
                          : "Ready"}

                </strong>

                <span>

                  {isConnecting
                    ? "Connecting to AzentMart AI..."
                    : isConnected
                      ? "Speak naturally. Continue the conversation."
                      : "Press start to begin."}

                </span>

              </div>

              {!isConnected &&
                !isConnecting && (
                  <button
                    className="stop-voice-button"
                    onClick={
                      startVoiceConversation
                    }
                  >
                    🎙 Start Voice
                    Conversation
                  </button>
                )}

              {(isConnected ||
                isConnecting) && (
                <button
                  className="stop-voice-button"
                  onClick={
                    closeVoiceChat
                  }
                >
                  End Conversation
                </button>
              )}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="voice-chat-footer">

              🔒 Secure

              <span>
                •
              </span>

              Multilingual

              <span>
                •
              </span>

              Real-time

              {sessionId && (
                <>
                  <span>
                    •
                  </span>

                  Connected
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default VoiceHome;
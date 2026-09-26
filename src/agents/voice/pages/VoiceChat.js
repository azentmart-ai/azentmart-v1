import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaTimes,
  FaRobot,
} from "react-icons/fa";

import "./VoiceChat.css";

/* =========================================================
   VOICE CHAT

   Same live voice method used by landing page.

   Supports:
   - Test
   - Role Play
   - Selected assistant
   - Automatic language detection
   - Continuous conversation
   - User transcript
   - AI transcript
   - Partial transcript
   - PCM16 microphone audio
   - PCM16 AI audio
========================================================= */

const VoiceChat = ({
  assistant,
  mode = "test",
  onClose,
}) => {
  /* =======================================================
     WEBSOCKET
  ======================================================= */

  const socketRef = useRef(null);

  /* =======================================================
     MICROPHONE
  ======================================================= */

  const streamRef = useRef(null);

  const audioContextRef = useRef(null);

  const microphoneSourceRef =
    useRef(null);

  const processorRef =
    useRef(null);

  const silentGainRef =
    useRef(null);

  /* =======================================================
     CHAT
  ======================================================= */

  const messagesEndRef =
    useRef(null);

  /* =======================================================
     LIFECYCLE
  ======================================================= */

  const mountedRef =
    useRef(true);

  const closingRef =
    useRef(false);

  /* =======================================================
     AUDIO PLAYBACK
  ======================================================= */

  const nextAudioTimeRef =
    useRef(0);

  /* =======================================================
     STATES
  ======================================================= */

  const [isConnected, setIsConnected] =
    useState(false);

  const [isConnecting, setIsConnecting] =
    useState(true);

  const [isListening, setIsListening] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [error, setError] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  /* =======================================================
     PARTIAL TRANSCRIPTS
  ======================================================= */

  const partialUserRef =
    useRef("");

  const partialAssistantRef =
    useRef("");

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }

    messagesEndRef.current.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages]);

  /* =======================================================
     ADD MESSAGE
  ======================================================= */

  const addMessage = useCallback(
    (role, text) => {
      if (
        !text ||
        !String(text).trim()
      ) {
        return;
      }

      const cleanText =
        String(text).trim();

      setMessages((previous) => {
        const updated = [
          ...previous,
        ];

        const last =
          updated[
            updated.length - 1
          ];

        /*
         * Merge consecutive
         * transcript chunks.
         */

        if (
          last &&
          last.role === role
        ) {
          updated[
            updated.length - 1
          ] = {
            ...last,
            text:
              `${last.text} ${cleanText}`.trim(),
          };

          return updated;
        }

        updated.push({
          id:
            `${role}-${Date.now()}-${Math.random()}`,
          role,
          text: cleanText,
        });

        return updated;
      });
    },
    []
  );

  /* =======================================================
     UPDATE PARTIAL MESSAGE

     This makes transcript appear
     immediately instead of waiting
     for the final transcript.
  ======================================================= */

  const updatePartialMessage =
    useCallback(
      (role, text) => {
        if (
          !text ||
          !String(text).trim()
        ) {
          return;
        }

        const cleanText =
          String(text).trim();

        setMessages((previous) => {
          const updated = [
            ...previous,
          ];

          const last =
            updated[
              updated.length - 1
            ];

          if (
            last &&
            last.role === role &&
            last.partial === true
          ) {
            updated[
              updated.length - 1
            ] = {
              ...last,
              text: cleanText,
            };

            return updated;
          }

          updated.push({
            id:
              `${role}-partial-${Date.now()}`,
            role,
            text: cleanText,
            partial: true,
          });

          return updated;
        });
      },
      []
    );

  /* =======================================================
     FINALIZE PARTIAL MESSAGE
  ======================================================= */

  const finalizePartialMessage =
    useCallback(
      (role, text) => {
        if (
          !text ||
          !String(text).trim()
        ) {
          return;
        }

        const cleanText =
          String(text).trim();

        setMessages((previous) => {
          const updated = [
            ...previous,
          ];

          const last =
            updated[
              updated.length - 1
            ];

          if (
            last &&
            last.role === role &&
            last.partial === true
          ) {
            updated[
              updated.length - 1
            ] = {
              ...last,
              text: cleanText,
              partial: false,
            };

            return updated;
          }

          updated.push({
            id:
              `${role}-${Date.now()}-${Math.random()}`,
            role,
            text: cleanText,
            partial: false,
          });

          return updated;
        });
      },
      []
    );

  /* =======================================================
     FLOAT -> PCM16
  ======================================================= */

  const floatToPCM16 =
    useCallback((input) => {
      const output =
        new Int16Array(
          input.length
        );

      for (
        let i = 0;
        i < input.length;
        i++
      ) {
        let sample =
          input[i];

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

  /* =======================================================
     RESAMPLE -> 16KHZ
  ======================================================= */

  const downsampleTo16k =
    useCallback(
      (
        buffer,
        sampleRate
      ) => {
        const targetRate =
          16000;

        if (
          sampleRate ===
          targetRate
        ) {
          return floatToPCM16(
            buffer
          );
        }

        if (
          sampleRate <
          targetRate
        ) {
          return floatToPCM16(
            buffer
          );
        }

        const ratio =
          sampleRate /
          targetRate;

        const newLength =
          Math.round(
            buffer.length /
              ratio
          );

        const result =
          new Float32Array(
            newLength
          );

        let resultIndex = 0;

        let inputIndex = 0;

        while (
          resultIndex <
            result.length &&
          inputIndex <
            buffer.length
        ) {
          const nextInput =
            Math.round(
              (resultIndex + 1) *
                ratio
            );

          let total = 0;

          let count = 0;

          for (
            let i = inputIndex;
            i < nextInput &&
            i < buffer.length;
            i++
          ) {
            total +=
              buffer[i];

            count++;
          }

          result[
            resultIndex
          ] =
            count
              ? total / count
              : 0;

          resultIndex++;

          inputIndex =
            nextInput;
        }

        return floatToPCM16(
          result
        );
      },
      [floatToPCM16]
    );

  /* =======================================================
     WEBSOCKET URL

     IMPORTANT:
     Sends:
     - assistant_id
     - assistant_name
     - mode
     - language=auto
     - token
  ======================================================= */

  const getWebSocketURL =
    useCallback(() => {
      const protocol =
        window.location
          .protocol ===
        "https:"
          ? "wss:"
          : "ws:";

      const params =
        new URLSearchParams();

      /*
       * Authentication
       */

      const token =
        localStorage.getItem(
          "access_token"
        ) ||
        localStorage.getItem(
          "token"
        );

      if (token) {
        params.set(
          "token",
          token
        );
      }

      /*
       * Assistant database ID
       *
       * If your assistant object
       * contains numeric id, send it.
       */

      if (
        assistant?.id !==
          undefined &&
        assistant?.id !== null
      ) {
        params.set(
          "assistant_id",
          String(
            assistant.id
          )
        );
      }

      /*
       * Assistant name
       *
       * Useful when frontend IDs
       * are strings like:
       *
       * course-enquiry
       */

      if (assistant?.name) {
        params.set(
          "assistant_name",
          assistant.name
        );
      }

      /*
       * Automatic language
       */

      params.set(
        "language",
        "auto"
      );

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
        `/api/voice/live?` +
        params.toString();

      console.log(
        "================================"
      );

      console.log(
        "[VOICE] Assistant:",
        assistant?.name
      );

      console.log(
        "[VOICE] Assistant ID:",
        assistant?.id
      );

      console.log(
        "[VOICE] Mode:",
        mode
      );

      console.log(
        "[VOICE] Language: auto"
      );

      console.log(
        "[VOICE] WebSocket:",
        url
      );

      console.log(
        "================================"
      );

      return url;
    }, [
      assistant,
      mode,
    ]);

  /* =======================================================
     PLAY AI PCM16 AUDIO
  ======================================================= */

  const playPCM16Audio =
    useCallback(
      (arrayBuffer) => {
        const context =
          audioContextRef.current;

        if (!context) {
          return;
        }

        try {
          const pcm =
            new Int16Array(
              arrayBuffer
            );

          if (!pcm.length) {
            return;
          }

          /*
           * Same output sample
           * rate used by landing
           * voice implementation.
           */

          const sampleRate =
            24000;

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
              pcm[i] /
              32768;
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

          source.buffer =
            buffer;

          source.connect(
            context.destination
          );

          const currentTime =
            context.currentTime;

          /*
           * Prevent audio gap.
           */

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
              nextAudioTimeRef.current -
                0.05
            ) {
              setIsSpeaking(
                false
              );
            }
          };
        } catch (err) {
          console.error(
            "AI audio playback error:",
            err
          );
        }
      },
      []
    );

  /* =======================================================
     START MICROPHONE
  ======================================================= */

  const startMicrophone =
    useCallback(async () => {
      if (
        streamRef.current
      ) {
        return;
      }

      const stream =
        await navigator
          .mediaDevices
          .getUserMedia({
            audio: {
              channelCount: 1,
              echoCancellation:
                true,
              noiseSuppression:
                true,
              autoGainControl:
                true,
            },
          });

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
        context.state ===
        "suspended"
      ) {
        await context.resume();
      }

      const source =
        context.createMediaStreamSource(
          stream
        );

      microphoneSourceRef.current =
        source;

      /*
       * IMPORTANT:
       *
       * 2048 instead of 4096.
       *
       * This reduces microphone
       * processing latency.
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

      silentGain.gain.value =
        0;

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

          if (
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
              "Audio send error:",
              err
            );
          }
        };

      source.connect(
        processor
      );

      processor.connect(
        silentGain
      );

      silentGain.connect(
        context.destination
      );

      setIsListening(true);
    }, [
      downsampleTo16k,
    ]);

  /* =======================================================
     STOP MICROPHONE
  ======================================================= */

  const stopMicrophone =
    useCallback(() => {
      try {
        if (
          processorRef.current
        ) {
          processorRef.current
            .disconnect();

          processorRef.current
            .onaudioprocess =
            null;

          processorRef.current =
            null;
        }

        if (
          microphoneSourceRef.current
        ) {
          microphoneSourceRef.current
            .disconnect();

          microphoneSourceRef.current =
            null;
        }

        if (
          silentGainRef.current
        ) {
          silentGainRef.current
            .disconnect();

          silentGainRef.current =
            null;
        }

        if (
          streamRef.current
        ) {
          streamRef.current
            .getTracks()
            .forEach(
              (track) => {
                track.stop();
              }
            );

          streamRef.current =
            null;
        }

        if (
          audioContextRef.current
        ) {
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
              .catch(
                () => {}
              );
          }
        }
      } catch (err) {
        console.error(
          "Microphone cleanup error:",
          err
        );
      }

      setIsListening(false);
    }, []);

  /* =======================================================
     SERVER MESSAGE
  ======================================================= */

  const handleServerMessage =
    useCallback(
      async (event) => {
        /*
         * ================================================
         * AI AUDIO
         * ================================================
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
          event.data instanceof
          Blob
        ) {
          try {
            const buffer =
              await event.data.arrayBuffer();

            playPCM16Audio(
              buffer
            );
          } catch (err) {
            console.error(
              "Blob audio error:",
              err
            );
          }

          return;
        }

        /*
         * ================================================
         * JSON
         * ================================================
         */

        if (
          typeof event.data !==
          "string"
        ) {
          return;
        }

        let data;

        try {
          data =
            JSON.parse(
              event.data
            );
        } catch (err) {
          console.error(
            "JSON error:",
            err
          );

          return;
        }

        console.log(
          "[VOICE SERVER]",
          data
        );

        /*
         * ================================================
         * SESSION
         * ================================================
         */

        if (
          data.type ===
          "session_started"
        ) {
          setIsConnected(
            true
          );

          setIsConnecting(
            false
          );

          setError("");

          return;
        }

        /*
         * ================================================
         * CONNECTED
         * ================================================
         */

        if (
          data.type ===
          "connected"
        ) {
          setIsConnected(
            true
          );

          setIsListening(
            true
          );

          setIsConnecting(
            false
          );

          setError("");

          return;
        }

        /*
         * ================================================
         * USER PARTIAL TRANSCRIPT
         *
         * Supports several possible
         * backend event names.
         * ================================================
         */

        if (
          data.type ===
            "user_transcript_partial" ||
          data.type ===
            "partial_user_transcript" ||
          data.type ===
            "user_partial"
        ) {
          const text =
            data.text ||
            data.transcript ||
            "";

          partialUserRef.current =
            text;

          updatePartialMessage(
            "user",
            text
          );

          setIsListening(
            false
          );

          return;
        }

        /*
         * ================================================
         * USER FINAL TRANSCRIPT
         * ================================================
         */

        if (
          data.type ===
            "user_transcript" ||
          data.type ===
            "user_transcription" ||
          data.type ===
            "final_user_transcript"
        ) {
          const text =
            data.text ||
            data.transcript ||
            partialUserRef.current ||
            "";

          partialUserRef.current =
            "";

          finalizePartialMessage(
            "user",
            text
          );

          setIsListening(
            false
          );

          return;
        }

        /*
         * ================================================
         * AI PARTIAL TRANSCRIPT
         * ================================================
         */

        if (
          data.type ===
            "assistant_transcript_partial" ||
          data.type ===
            "partial_assistant_transcript" ||
          data.type ===
            "assistant_partial"
        ) {
          const text =
            data.text ||
            data.transcript ||
            "";

          partialAssistantRef.current =
            text;

          updatePartialMessage(
            "assistant",
            text
          );

          return;
        }

        /*
         * ================================================
         * AI FINAL TRANSCRIPT
         * ================================================
         */

        if (
          data.type ===
            "assistant_transcript" ||
          data.type ===
            "assistant_transcription" ||
          data.type ===
            "final_assistant_transcript"
        ) {
          const text =
            data.text ||
            data.transcript ||
            data.message ||
            partialAssistantRef.current ||
            "";

          partialAssistantRef.current =
            "";

          finalizePartialMessage(
            "assistant",
            text
          );

          return;
        }

        /*
         * ================================================
         * GENERIC TRANSCRIPT
         * ================================================
         */

        if (
          data.type ===
          "transcript"
        ) {
          const role =
            data.role ||
            data.speaker;

          const text =
            data.text ||
            data.transcript ||
            "";

          if (
            role === "user"
          ) {
            addMessage(
              "user",
              text
            );
          } else {
            addMessage(
              "assistant",
              text
            );
          }

          return;
        }

        /*
         * ================================================
         * AI AUDIO START
         * ================================================
         */

        if (
          data.type ===
          "assistant_audio_start"
        ) {
          setIsSpeaking(
            true
          );

          setIsListening(
            false
          );

          return;
        }

        /*
         * ================================================
         * TURN COMPLETE
         *
         * DO NOT CLOSE MICROPHONE.
         *
         * Conversation continues.
         * ================================================
         */

        if (
          data.type ===
          "turn_complete"
        ) {
          setIsSpeaking(
            false
          );

          if (
            mountedRef.current &&
            !closingRef.current
          ) {
            setIsListening(
              true
            );
          }

          return;
        }

        /*
         * ================================================
         * INTERRUPTED
         * ================================================
         */

        if (
          data.type ===
          "interrupted"
        ) {
          setIsSpeaking(
            false
          );

          nextAudioTimeRef.current =
            0;

          if (
            mountedRef.current &&
            !closingRef.current
          ) {
            setIsListening(
              true
            );
          }

          return;
        }

        /*
         * ================================================
         * ERROR
         * ================================================
         */

        if (
          data.type ===
          "error"
        ) {
          console.error(
            "Voice backend error:",
            data.message
          );

          setError(
            data.message ||
              "Voice conversation error."
          );

          setIsSpeaking(
            false
          );

          return;
        }
      },
      [
        addMessage,
        finalizePartialMessage,
        playPCM16Audio,
        updatePartialMessage,
      ]
    );

  /* =======================================================
     CONNECT
  ======================================================= */

  const connectVoice =
    useCallback(async () => {
      return new Promise(
        (
          resolve,
          reject
        ) => {
          try {
            const url =
              getWebSocketURL();

            const socket =
              new WebSocket(
                url
              );

            socket.binaryType =
              "arraybuffer";

            socketRef.current =
              socket;

            socket.onopen =
              () => {
                console.log(
                  "[VOICE] WebSocket connected"
                );

                setIsConnected(
                  true
                );

                setIsConnecting(
                  false
                );

                setError("");

                resolve(
                  socket
                );
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

                setIsConnecting(
                  false
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
          } catch (err) {
            reject(err);
          }
        }
      );
    }, [
      getWebSocketURL,
      handleServerMessage,
    ]);

  /* =======================================================
     START CONVERSATION
  ======================================================= */

  const startVoiceConversation =
    useCallback(async () => {
      try {
        closingRef.current =
          false;

        setError("");

        setMessages([]);

        partialUserRef.current =
          "";

        partialAssistantRef.current =
          "";

        nextAudioTimeRef.current =
          0;

        setIsConnecting(
          true
        );

        /*
         * WebSocket first
         */

        await connectVoice();

        /*
         * Microphone second
         */

        await startMicrophone();

        setIsConnecting(
          false
        );

        setIsConnected(
          true
        );

        setIsListening(
          true
        );
      } catch (err) {
        console.error(
          "Voice start error:",
          err
        );

        stopMicrophone();

        if (
          socketRef.current
        ) {
          try {
            socketRef.current.close();
          } catch {}
        }

        socketRef.current =
          null;

        setIsConnecting(
          false
        );

        setIsConnected(
          false
        );

        setIsListening(
          false
        );

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

  /* =======================================================
     AUTO START
  ======================================================= */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        startVoiceConversation();
      }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [
    startVoiceConversation,
  ]);

  /* =======================================================
     CLOSE CHAT
  ======================================================= */

  const closeChat =
    useCallback(() => {
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
        } catch {}
      }

      socketRef.current =
        null;

      setIsConnected(
        false
      );

      setIsConnecting(
        false
      );

      setIsListening(
        false
      );

      setIsSpeaking(
        false
      );

      nextAudioTimeRef.current =
        0;

      onClose();
    }, [
      onClose,
      stopMicrophone,
    ]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    mountedRef.current =
      true;

    return () => {
      mountedRef.current =
        false;

      closingRef.current =
        true;

      stopMicrophone();

      if (
        socketRef.current
      ) {
        try {
          socketRef.current.close();
        } catch {}
      }

      socketRef.current =
        null;
    };
  }, [
    stopMicrophone,
  ]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="voice-chat-overlay"
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closeChat();
        }
      }}
    >

      <div
        className="voice-chat-panel"
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
              <FaRobot />
            </div>

            <div>

              <strong>
                {assistant?.name ||
                  "AzentMart AI"}
              </strong>

              <span>

                <i
                  className={
                    isConnected
                      ? "online-dot active"
                      : "online-dot"
                  }
                />

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
            onClick={closeChat}
            type="button"
          >
            <FaTimes />
          </button>

        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="voice-chat-body">

          {/* ROBOT */}

          <div
            className={
              isListening ||
              isSpeaking
                ? "welcome-orb active"
                : "welcome-orb"
            }
          >
            <div className="welcome-orb-glow" />

            <div className="welcome-orb-core">
              <FaRobot />
            </div>
          </div>

          {/* STATUS TITLE */}

          <h3>

            {isConnecting
              ? "Connecting..."
              : isSpeaking
                ? "AI is speaking"
                : isListening
                  ? "I'm listening"
                  : mode ===
                    "roleplay"
                    ? "Role Play"
                    : "Test Assistant"}

          </h3>

          <p className="voice-subtitle">

            {mode === "roleplay"
              ? "Role Play • Speak naturally with your AI assistant"
              : "Test • Speak naturally with your AI assistant"}

          </p>

          {/* LANGUAGE */}

          {messages.length ===
            0 && (
            <div className="language-hint">
              🌐 Automatic language detection
            </div>
          )}

          {/* =================================================
              CHAT
          ================================================= */}

          {messages.length >
            0 && (
            <div className="voice-chat-messages">

              {messages.map(
                (message) => (
                  <div
                    key={
                      message.id
                    }
                    className={
                      message.role ===
                      "user"
                        ? "chat-message user"
                        : "chat-message assistant"
                    }
                  >

                    {message.role ===
                      "assistant" && (
                      <div className="message-avatar">
                        <FaRobot />
                      </div>
                    )}

                    <div className="message-content">

                      <small>
                        {message.role ===
                        "user"
                          ? "YOU"
                          : "AZENTMART AI"}
                      </small>

                      <div className="message-bubble">
                        {message.text}
                      </div>

                    </div>

                    {message.role ===
                      "user" && (
                      <div className="message-avatar user-avatar">
                        U
                      </div>
                    )}

                  </div>
                )
              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>
          )}

          {/* =================================================
              AI SPEAKING
          ================================================= */}

          {isSpeaking && (
            <div className="typing-indicator">

              <span />
              <span />
              <span />

              <label>
                AzentMart AI is speaking...
              </label>

            </div>
          )}

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
                type="button"
              >
                ×
              </button>

            </div>
          )}

          {/* =================================================
              LISTENING
          ================================================= */}

          <div className="voice-status">

            <div
              className={
                isListening
                  ? "voice-wave active"
                  : "voice-wave"
              }
            >

              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />

            </div>

            <div className="voice-status-text">

              {isConnecting
                ? "Connecting..."
                : isSpeaking
                  ? "AI is speaking..."
                  : isListening
                    ? "Listening..."
                    : isConnected
                      ? "Connected"
                      : "Ready"}

            </div>

          </div>

          {/* =================================================
              END CONVERSATION
          ================================================= */}

          <button
            className="end-conversation"
            onClick={closeChat}
            type="button"
          >
            End Conversation
          </button>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="voice-chat-footer">

          <span>
            🔒 Secure
          </span>

          <span>•</span>

          <span>
            Multilingual
          </span>

          <span>•</span>

          <span>
            Real-time
          </span>

          <span>•</span>

          <span>
            {isConnected
              ? "Connected"
              : "Connecting"}
          </span>

        </div>

      </div>
    </div>
  );
};

export default VoiceChat;
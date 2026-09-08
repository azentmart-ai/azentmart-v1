import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaLink,
  FaSyncAlt,
  FaCheckCircle,
  FaPlug,
  FaCopy,
  FaTimes,
  FaSave,
  FaExclamationCircle,
} from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const apiUrl = (path) => `${API_BASE_URL}${path}`;

const IntegrationsPage = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [webhookChecking, setWebhookChecking] = useState(false);

  const [phoneInfo, setPhoneInfo] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState("");

  const [registrationSkipped, setRegistrationSkipped] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const [formData, setFormData] = useState({
    phone_number_id: "",
    waba_id: "",
    access_token: "",
    verify_token: "",
    pin: "",
  });

  const webhookPath = "/api/whatsapp/webhook";

  // ============================================================
  // MESSAGES
  // ============================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ============================================================
  // LOAD WHATSAPP CONFIG
  // ============================================================

  const loadWhatsAppConfig = async () => {
    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(
        apiUrl("/api/whatsapp/config"),
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        setConnected(false);
        setConnectionMessage(
          "Please login to check WhatsApp connection."
        );
        return;
      }

      if (!response.ok) {
        setConnected(false);
        setConnectionMessage(
          data?.message ||
            data?.error ||
            "Unable to check WhatsApp configuration."
        );
        return;
      }

      if (data.connected === true) {
        setConnected(true);
        setPhoneInfo(data.phone_info || null);

        setConnectionMessage(
          data.phone_info?.display_phone_number
            ? `Connected: ${data.phone_info.display_phone_number}`
            : "WhatsApp Business account is connected."
        );

        return;
      }

      setConnected(false);
      setPhoneInfo(null);

      setConnectionMessage(
        data?.message ||
          "WhatsApp Business is not connected."
      );
    } catch (err) {
      console.error(
        "WhatsApp config GET error:",
        err
      );

      setConnected(false);

      setConnectionMessage(
        "Could not connect to the WhatsApp backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWhatsAppConfig();
  }, []);

  // ============================================================
  // INPUT
  // ============================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // MANAGE WHATSAPP
  // ============================================================

  const handleManageWhatsApp = () => {
    clearMessages();
    setRegistrationError("");
    setModalOpen(true);
  };

  // ============================================================
  // RECONNECT
  // ============================================================

  const handleReconnectWhatsApp = async () => {
    clearMessages();
    setRegistrationError("");

    setModalOpen(true);

    await loadWhatsAppConfig();
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setRegistrationError("");
  };

  // ============================================================
  // SAVE CONFIGURATION
  // ============================================================

  const handleSaveConfiguration = async (event) => {
    event.preventDefault();

    clearMessages();
    setRegistrationError("");

    if (!formData.phone_number_id.trim()) {
      setError("Phone Number ID is required.");
      return;
    }

    if (!formData.access_token.trim()) {
      setError("Access Token is required.");
      return;
    }

    if (
      formData.pin.trim() &&
      !/^\d{6}$/.test(formData.pin.trim())
    ) {
      setError("PIN must be exactly 6 digits.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        phone_number_id:
          formData.phone_number_id.trim(),

        waba_id:
          formData.waba_id.trim(),

        access_token:
          formData.access_token.trim(),

        verify_token:
          formData.verify_token.trim(),

        pin:
          formData.pin.trim(),
      };

      const response = await fetch(
        apiUrl("/api/whatsapp/config"),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        setError(
          "You are not authenticated. Please login again."
        );
        return;
      }

      if (!response.ok) {
        setError(
          data?.error ||
            data?.message ||
            "Failed to save WhatsApp configuration."
        );

        return;
      }

      if (
        data.success === false &&
        data.registration_error
      ) {
        setConnected(false);

        setRegistrationError(
          data.registration_error
        );

        setPhoneInfo(
          data.phone_info || null
        );

        setSuccess(
          "Configuration was saved, but phone registration failed."
        );

        return;
      }

      if (data.success === true) {
        setConnected(true);

        setPhoneInfo(
          data.phone_info || null
        );

        setRegistrationSkipped(
          data.registration_skipped === true
        );

        if (
          data.registration_skipped === true
        ) {
          setSuccess(
            "WhatsApp credentials saved successfully. Phone registration was skipped because no PIN was provided."
          );
        } else if (
          data.registered === true
        ) {
          setSuccess(
            "WhatsApp connected and phone number registered successfully."
          );
        } else {
          setSuccess(
            "WhatsApp configuration saved successfully."
          );
        }

        setConnectionMessage(
          data.phone_info?.display_phone_number
            ? `Connected: ${data.phone_info.display_phone_number}`
            : "WhatsApp Business account is connected."
        );

        // Clear sensitive values
        setFormData((previous) => ({
          ...previous,
          access_token: "",
          verify_token: "",
          pin: "",
        }));

        setTimeout(() => {
          setModalOpen(false);
        }, 800);

        return;
      }

      setSuccess(
        "WhatsApp configuration was saved."
      );
    } catch (err) {
      console.error(
        "WhatsApp config POST error:",
        err
      );

      setError(
        "Could not connect to the WhatsApp backend."
      );
    } finally {
      setSaving(false);

      setTimeout(() => {
        loadWhatsAppConfig();
      }, 300);
    }
  };

  // ============================================================
  // WEBHOOK STATUS
  // ============================================================

  const handleWebhook = async () => {
    setWebhookChecking(true);
    clearMessages();

    try {
      const response = await fetch(
        apiUrl("/api/whatsapp/config"),
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        setError(
          "Please login before checking webhook status."
        );

        return;
      }

      if (!response.ok) {
        setError(
          data?.message ||
            data?.error ||
            "Unable to check webhook status."
        );

        return;
      }

      if (data.connected === true) {
        setConnected(true);

        setPhoneInfo(
          data.phone_info || null
        );

        setSuccess(
          "WhatsApp connection is healthy. Webhook endpoint is ready to receive messages when Meta is subscribed."
        );

        return;
      }

      setConnected(false);

      setError(
        data?.message ||
          "WhatsApp is not connected, so webhook messaging cannot be verified."
      );
    } catch (err) {
      console.error(
        "Webhook status error:",
        err
      );

      setError(
        "Could not reach the WhatsApp backend."
      );
    } finally {
      setWebhookChecking(false);
    }
  };

  // ============================================================
  // COPY WEBHOOK
  // ============================================================

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      setSuccess(
        "Webhook endpoint copied."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(
        "Copy error:",
        err
      );

      setError(
        "Could not copy webhook endpoint."
      );
    }
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = async () => {
    await loadWhatsAppConfig();
  };

  // ============================================================
  // STYLES
  // ============================================================

  const colors = {
    page: "#081116",
    card: "#0d1a20",
    cardSecondary: "#111f26",
    border: "#20313a",
    borderLight: "#263b45",

    heading: "#f5f7f8",
    text: "#cbd5db",
    muted: "#8da0aa",

    purple: "#7c3aed",
    purpleLight: "#a78bfa",
    purpleBg: "#251642",

    green: "#22c55e",
    greenBg: "#0b3020",

    red: "#ef4444",
    redBg: "#351719",

    white: "#ffffff",
  };

  const pageStyle = {
    width: "100%",
    maxWidth: "none",
    minHeight: "100vh",
    margin: 0,
    padding: "28px 30px 40px",
    boxSizing: "border-box",
    background: colors.page,
    color: colors.heading,
  };

  const headerStyle = {
    width: "100%",
    marginBottom: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  };

  const cardStyle = {
    width: "100%",
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    marginBottom: "18px",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const cardHeaderStyle = {
    padding: "18px 20px",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  };

  const cardBodyStyle = {
    padding: "24px 20px 20px",
  };

  const labelStyle = {
    color: colors.muted,
    fontSize: "12px",
    marginBottom: "7px",
  };

  const valueStyle = {
    color: colors.text,
    fontSize: "14px",
    fontWeight: "500",
  };

  const buttonBase = {
    borderRadius: "7px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  };

  const statusStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: active
      ? colors.greenBg
      : colors.redBg,
    color: active
      ? colors.green
      : colors.red,
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  });

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div style={pageStyle}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={headerStyle}>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.2,
              fontWeight: "600",
              color: colors.heading,
            }}
          >
            Integrations
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: colors.muted,
              fontSize: "14px",
            }}
          >
            Connect and manage your WhatsApp integrations
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh connection"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "7px",
            border: "none",
            background: colors.white,
            color: "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <FaSyncAlt size={13} />
        </button>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            background: colors.redBg,
            border: `1px solid #5b2528`,
            color: "#fca5a5",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
          }}
        >
          <FaExclamationCircle size={14} />

          <span style={{ flex: 1 }}>
            {error}
          </span>

          <button
            onClick={() => setError("")}
            style={{
              border: "none",
              background: "transparent",
              color: "#fca5a5",
              cursor: "pointer",
            }}
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      {success && (
        <div
          style={{
            background: colors.greenBg,
            border: `1px solid #174d32`,
            color: "#86efac",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
          }}
        >
          <FaCheckCircle size={14} />

          <span style={{ flex: 1 }}>
            {success}
          </span>

          <button
            onClick={() => setSuccess("")}
            style={{
              border: "none",
              background: "transparent",
              color: "#86efac",
              cursor: "pointer",
            }}
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* ======================================================
          WHATSAPP BUSINESS
      ====================================================== */}

      <div style={cardStyle}>

        <div style={cardHeaderStyle}>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: colors.greenBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaWhatsapp
                size={23}
                color={colors.green}
              />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: "600",
                  color: colors.heading,
                }}
              >
                WhatsApp Business
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: colors.muted,
                  fontSize: "13px",
                }}
              >
                Connect your WhatsApp Business account
              </p>
            </div>

          </div>

          <div style={statusStyle(connected)}>
            <FaCheckCircle size={12} />

            {loading
              ? "Checking..."
              : connected
              ? "Connected"
              : "Not Connected"}
          </div>

        </div>

        <div style={cardBodyStyle}>

          {/* TWO COLUMN INFORMATION */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              columnGap: "40px",
              rowGap: "25px",
            }}
          >

            <div>
              <div style={labelStyle}>
                Provider
              </div>

              <div style={valueStyle}>
                WhatsApp Cloud API
              </div>
            </div>

            <div>
              <div style={labelStyle}>
                Connection
              </div>

              <div
                style={{
                  ...valueStyle,
                  color: connected
                    ? colors.green
                    : colors.red,
                }}
              >
                {loading
                  ? "Checking..."
                  : connected
                  ? "Active"
                  : "Inactive"}
              </div>
            </div>

            <div>
              <div style={labelStyle}>
                Messaging
              </div>

              <div
                style={{
                  ...valueStyle,
                  color: connected
                    ? colors.green
                    : colors.red,
                }}
              >
                {connected
                  ? "Enabled"
                  : "Not Connected"}
              </div>
            </div>

            <div>
              <div style={labelStyle}>
                Webhooks
              </div>

              <div
                style={{
                  ...valueStyle,
                  color: connected
                    ? colors.green
                    : colors.red,
                }}
              >
                {connected
                  ? "Enabled"
                  : "Not Connected"}
              </div>
            </div>

          </div>

          {/* PHONE */}

          {phoneInfo && (
            <div
              style={{
                marginTop: "22px",
                padding: "15px",
                background: colors.cardSecondary,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: colors.muted,
                  marginBottom: "6px",
                }}
              >
                WhatsApp Number
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: colors.heading,
                  fontWeight: "500",
                }}
              >
                {phoneInfo.display_phone_number ||
                  phoneInfo.phone_number ||
                  "Connected"}
              </div>

              {phoneInfo.verified_name && (
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "12px",
                    color: colors.muted,
                  }}
                >
                  Business Name:{" "}
                  {phoneInfo.verified_name}
                </div>
              )}
            </div>
          )}

          {/* REGISTRATION SKIPPED */}

          {registrationSkipped && (
            <div
              style={{
                marginTop: "15px",
                padding: "11px 13px",
                background: "#302710",
                border: "1px solid #5a481b",
                borderRadius: "8px",
                color: "#facc15",
                fontSize: "12px",
              }}
            >
              Credentials are valid, but phone registration
              was skipped because no 6-digit PIN was supplied.
            </div>
          )}

          {/* REGISTRATION ERROR */}

          {registrationError && (
            <div
              style={{
                marginTop: "15px",
                padding: "11px 13px",
                background: colors.redBg,
                border: "1px solid #5b2528",
                borderRadius: "8px",
                color: "#fca5a5",
                fontSize: "12px",
              }}
            >
              <strong>
                Phone registration failed:
              </strong>

              <div style={{ marginTop: "5px" }}>
                {registrationError}
              </div>
            </div>
          )}

          {/* CONNECTION MESSAGE */}

          {connectionMessage && !error && (
            <div
              style={{
                marginTop: "15px",
                fontSize: "12px",
                color: colors.muted,
              }}
            >
              {connectionMessage}
            </div>
          )}

          {/* BUTTONS */}

          <div
            style={{
              marginTop: "22px",
              paddingTop: "17px",
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              gap: "9px",
            }}
          >

            <button
              onClick={handleManageWhatsApp}
              style={{
                ...buttonBase,
                border: "none",
                background: colors.purple,
                color: colors.white,
              }}
            >
              <FaWhatsapp size={13} />
              Manage WhatsApp
            </button>

            <button
              onClick={handleReconnectWhatsApp}
              disabled={loading}
              style={{
                ...buttonBase,
                border: `1px solid ${colors.borderLight}`,
                background: colors.cardSecondary,
                color: colors.text,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <FaSyncAlt size={12} />
              Reconnect
            </button>

          </div>

        </div>
      </div>

      {/* ======================================================
          WEBHOOK
      ====================================================== */}

      <div style={cardStyle}>

        <div style={cardHeaderStyle}>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: colors.purpleBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaLink
                size={21}
                color={colors.purpleLight}
              />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: "600",
                  color: colors.heading,
                }}
              >
                WhatsApp Webhook
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: colors.muted,
                  fontSize: "13px",
                }}
              >
                Receive incoming WhatsApp messages and status updates
              </p>
            </div>

          </div>

          <div style={statusStyle(connected)}>
            <FaCheckCircle size={12} />
            {connected ? "Active" : "Inactive"}
          </div>

        </div>

        <div style={cardBodyStyle}>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              columnGap: "40px",
            }}
          >

            <div>
              <div style={labelStyle}>
                Status
              </div>

              <div
                style={{
                  ...valueStyle,
                  color: connected
                    ? colors.green
                    : colors.red,
                }}
              >
                {connected
                  ? "Listening for messages"
                  : "Not connected"}
              </div>
            </div>

            <div>
              <div style={labelStyle}>
                Events
              </div>

              <div style={valueStyle}>
                Messages & Statuses
              </div>
            </div>

          </div>

          {/* WEBHOOK ENDPOINT */}

          <div
            style={{
              marginTop: "22px",
              padding: "14px",
              background: colors.cardSecondary,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: "8px",
            }}
          >

            <div
              style={{
                color: colors.muted,
                fontSize: "11px",
                marginBottom: "8px",
              }}
            >
              Webhook Endpoint
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >

              <code
                style={{
                  color: colors.purpleLight,
                  fontSize: "12px",
                  wordBreak: "break-all",
                }}
              >
                {webhookPath}
              </code>

              <button
                onClick={() =>
                  handleCopy(webhookPath)
                }
                title="Copy webhook path"
                style={{
                  width: "32px",
                  height: "32px",
                  flexShrink: 0,
                  borderRadius: "6px",
                  border: `1px solid ${colors.borderLight}`,
                  background: colors.card,
                  color: colors.purpleLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FaCopy size={12} />
              </button>

            </div>

          </div>

          {/* WEBHOOK BUTTON */}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "17px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >

            <button
              onClick={handleWebhook}
              disabled={webhookChecking}
              style={{
                ...buttonBase,
                border: `1px solid ${colors.borderLight}`,
                background: colors.cardSecondary,
                color: colors.text,
                cursor: webhookChecking
                  ? "not-allowed"
                  : "pointer",
                opacity: webhookChecking
                  ? 0.6
                  : 1,
              }}
            >
              <FaPlug size={12} />

              {webhookChecking
                ? "Checking..."
                : "Webhook Status"}
            </button>

          </div>

        </div>
      </div>

      {/* ======================================================
          INFO
      ====================================================== */}

      <div
        style={{
          ...cardStyle,
          padding: "18px 20px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "9px",
              background: colors.greenBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaWhatsapp
              size={18}
              color={colors.green}
            />
          </div>

          <div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: colors.heading,
              }}
            >
              WhatsApp Integration
            </div>

            <div
              style={{
                marginTop: "4px",
                fontSize: "12px",
                color: colors.muted,
              }}
            >
              {connected
                ? "Your WhatsApp Business integration is configured for messaging and webhook events."
                : "Connect your WhatsApp Business account to enable messaging and webhook events."}
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#101b21",
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                padding: "19px 20px",
                borderBottom:
                  `1px solid ${colors.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                    color: colors.heading,
                    fontSize: "19px",
                    fontWeight: "600",
                  }}
                >
                  WhatsApp Business
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: colors.muted,
                    fontSize: "12px",
                  }}
                >
                  Connect your WhatsApp Cloud API
                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                style={{
                  border: "none",
                  background: "transparent",
                  color: colors.muted,
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "17px",
                }}
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSaveConfiguration
              }
            >

              <div
                style={{
                  padding: "21px",
                }}
              >

                {/* PHONE NUMBER ID */}

                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: colors.text,
                      marginBottom: "7px",
                    }}
                  >
                    Phone Number ID *
                  </label>

                  <input
                    type="text"
                    name="phone_number_id"
                    value={
                      formData.phone_number_id
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter Phone Number ID"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border:
                        `1px solid ${colors.borderLight}`,
                      borderRadius: "7px",
                      padding: "10px 11px",
                      fontSize: "12px",
                      outline: "none",
                      background: colors.cardSecondary,
                      color: colors.heading,
                    }}
                  />

                </div>

                {/* WABA ID */}

                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: colors.text,
                      marginBottom: "7px",
                    }}
                  >
                    WABA ID
                  </label>

                  <input
                    type="text"
                    name="waba_id"
                    value={
                      formData.waba_id
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter WhatsApp Business Account ID"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border:
                        `1px solid ${colors.borderLight}`,
                      borderRadius: "7px",
                      padding: "10px 11px",
                      fontSize: "12px",
                      outline: "none",
                      background: colors.cardSecondary,
                      color: colors.heading,
                    }}
                  />

                </div>

                {/* ACCESS TOKEN */}

                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: colors.text,
                      marginBottom: "7px",
                    }}
                  >
                    Access Token *
                  </label>

                  <textarea
                    name="access_token"
                    value={
                      formData.access_token
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Paste WhatsApp Cloud API access token"
                    autoComplete="off"
                    rows={4}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border:
                        `1px solid ${colors.borderLight}`,
                      borderRadius: "7px",
                      padding: "10px 11px",
                      fontSize: "12px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                      background: colors.cardSecondary,
                      color: colors.heading,
                    }}
                  />

                </div>

                {/* VERIFY TOKEN */}

                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: colors.text,
                      marginBottom: "7px",
                    }}
                  >
                    Verify Token
                  </label>

                  <input
                    type="text"
                    name="verify_token"
                    value={
                      formData.verify_token
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter webhook verify token"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border:
                        `1px solid ${colors.borderLight}`,
                      borderRadius: "7px",
                      padding: "10px 11px",
                      fontSize: "12px",
                      outline: "none",
                      background: colors.cardSecondary,
                      color: colors.heading,
                    }}
                  />

                </div>

                {/* PIN */}

                <div>

                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: colors.text,
                      marginBottom: "7px",
                    }}
                  >
                    6-Digit PIN
                  </label>

                  <input
                    type="password"
                    name="pin"
                    value={
                      formData.pin
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Optional 6-digit PIN"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border:
                        `1px solid ${colors.borderLight}`,
                      borderRadius: "7px",
                      padding: "10px 11px",
                      fontSize: "12px",
                      outline: "none",
                      background: colors.cardSecondary,
                      color: colors.heading,
                    }}
                  />

                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "11px",
                      color: colors.muted,
                    }}
                  >
                    Required for phone registration
                    when applicable. Leave empty for
                    Meta test numbers.
                  </p>

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div
                style={{
                  padding: "15px 21px",
                  borderTop:
                    `1px solid ${colors.border}`,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "9px",
                }}
              >

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  style={{
                    ...buttonBase,
                    border:
                      `1px solid ${colors.borderLight}`,
                    background:
                      colors.cardSecondary,
                    color: colors.text,
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...buttonBase,
                    border: "none",
                    background: colors.purple,
                    color: colors.white,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <FaSave size={12} />

                  {saving
                    ? "Connecting..."
                    : "Save Configuration"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default IntegrationsPage;
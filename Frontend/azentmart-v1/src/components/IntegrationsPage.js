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

/*
 * ============================================================
 * WHATSAPP INTEGRATIONS PAGE
 * ============================================================
 *
 * Frontend only.
 *
 * Existing backend endpoint:
 * GET    /api/whatsapp/config
 * POST   /api/whatsapp/config
 * DELETE /api/whatsapp/config
 *
 * No database changes are required.
 * No backend changes are required.
 *
 * If frontend and backend are on different domains/ports,
 * create a .env file in the frontend project:
 *
 * REACT_APP_API_BASE_URL=http://localhost:3000
 *
 * If both are served from the same origin, leave it empty.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const apiUrl = (path) => {
  return `${API_BASE_URL}${path}`;
};

const IntegrationsPage = () => {
  // ==========================================================
  // STATE
  // ==========================================================

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

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState({
    phone_number_id: "",
    waba_id: "",
    access_token: "",
    verify_token: "",
    pin: "",
  });

  // ==========================================================
  // WEBHOOK PATH
  // ==========================================================

  const webhookPath = "/api/whatsapp/webhook";

  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ==========================================================
  // LOAD WHATSAPP CONFIG
  // ==========================================================

  const loadWhatsAppConfig = async () => {
    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(apiUrl("/api/whatsapp/config"), {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        setConnected(false);
        setConnectionMessage("Please login to check WhatsApp connection.");
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
        data?.message || "WhatsApp Business is not connected."
      );
    } catch (err) {
      console.error("WhatsApp config GET error:", err);

      setConnected(false);

      setConnectionMessage(
        "Could not connect to the WhatsApp backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD CONFIG WHEN PAGE OPENS
  // ==========================================================

  useEffect(() => {
    loadWhatsAppConfig();
  }, []);

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // OPEN MANAGE WHATSAPP
  // ==========================================================

  const handleManageWhatsApp = () => {
    clearMessages();

    setRegistrationError("");

    setModalOpen(true);
  };

  // ==========================================================
  // RECONNECT
  // ==========================================================

  const handleReconnectWhatsApp = async () => {
    clearMessages();

    setRegistrationError("");

    /*
     * We intentionally don't try to retrieve the existing
     * access token because the backend does not return the
     * sensitive token.
     *
     * The user enters the credentials again and saves.
     */

    setModalOpen(true);

    await loadWhatsAppConfig();
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setRegistrationError("");
  };

  // ==========================================================
  // SAVE WHATSAPP CONFIGURATION
  // ==========================================================

  const handleSaveConfiguration = async (event) => {
    event.preventDefault();

    clearMessages();

    setRegistrationError("");

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

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
        phone_number_id: formData.phone_number_id.trim(),
        waba_id: formData.waba_id.trim(),
        access_token: formData.access_token.trim(),
        verify_token: formData.verify_token.trim(),
        pin: formData.pin.trim(),
      };

      const response = await fetch(apiUrl("/api/whatsapp/config"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ------------------------------------------------------
      // AUTH ERROR
      // ------------------------------------------------------

      if (response.status === 401) {
        setError("You are not authenticated. Please login again.");
        return;
      }

      // ------------------------------------------------------
      // OTHER BACKEND ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        setError(
          data?.error ||
            data?.message ||
            "Failed to save WhatsApp configuration."
        );

        return;
      }

      // ------------------------------------------------------
      // REGISTRATION ERROR
      // ------------------------------------------------------

      if (
        data.success === false &&
        data.registration_error
      ) {
        setConnected(false);

        setRegistrationError(data.registration_error);

        setPhoneInfo(data.phone_info || null);

        setSuccess(
          "Configuration was saved, but phone registration failed."
        );

        return;
      }

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      if (data.success === true) {
        setConnected(true);

        setPhoneInfo(data.phone_info || null);

        setRegistrationSkipped(
          data.registration_skipped === true
        );

        if (data.registration_skipped === true) {
          setSuccess(
            "WhatsApp credentials saved successfully. Phone registration was skipped because no PIN was provided."
          );
        } else if (data.registered === true) {
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

        /*
         * Clear sensitive values after successful save.
         */
        setFormData((previous) => ({
          ...previous,
          access_token: "",
          verify_token: "",
          pin: "",
        }));

        /*
         * Close modal after successful connection.
         */
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

      /*
       * Refresh the actual backend status.
       */
      setTimeout(() => {
        loadWhatsAppConfig();
      }, 300);
    }
  };

  // ==========================================================
  // WEBHOOK STATUS
  // ==========================================================

  const handleWebhook = async () => {
    setWebhookChecking(true);

    clearMessages();

    try {
      /*
       * We use the existing config endpoint to verify that the
       * WhatsApp credentials are healthy.
       *
       * We do NOT create/change any backend webhook route here.
       */

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

        setPhoneInfo(data.phone_info || null);

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

  // ==========================================================
  // COPY WEBHOOK
  // ==========================================================

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      setSuccess("Webhook endpoint copied.");

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Copy error:", err);

      setError("Could not copy webhook endpoint.");
    }
  };

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    await loadWhatsAppConfig();
  };

  // ==========================================================
  // STATUS COLORS
  // ==========================================================

  const statusBackground = connected
    ? "#dcfce7"
    : "#fee2e2";

  const statusColor = connected
    ? "#15803d"
    : "#b91c1c";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fc",
        padding: "30px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ==================================================== */}
      {/* PAGE HEADER */}
      {/* ==================================================== */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "600",
                color: "#172033",
              }}
            >
              Integrations
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Connect and manage your WhatsApp integrations
            </p>
          </div>

          {/* REFRESH BUTTON */}

          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh connection"
            style={{
              border: "1px solid #ddd6fe",
              background: "#ffffff",
              color: "#7c3aed",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <FaSyncAlt
              size={14}
              style={{
                transform: loading
                  ? "rotate(360deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* ERROR MESSAGE */}
      {/* ==================================================== */}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: "9px",
            padding: "13px 15px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
          }}
        >
          <FaExclamationCircle size={15} />

          <span
            style={{
              flex: 1,
            }}
          >
            {error}
          </span>

          <button
            onClick={() => setError("")}
            style={{
              border: "none",
              background: "transparent",
              color: "#b91c1c",
              cursor: "pointer",
            }}
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUCCESS MESSAGE */}
      {/* ==================================================== */}

      {success && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#15803d",
            borderRadius: "9px",
            padding: "13px 15px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
          }}
        >
          <FaCheckCircle size={15} />

          <span
            style={{
              flex: 1,
            }}
          >
            {success}
          </span>

          <button
            onClick={() => setSuccess("")}
            style={{
              border: "none",
              background: "transparent",
              color: "#15803d",
              cursor: "pointer",
            }}
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* WHATSAPP BUSINESS */}
      {/* ==================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          marginBottom: "22px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {/* CARD HEADER */}

        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eeeeee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaWhatsapp
                size={25}
                style={{
                  color: "#16a34a",
                }}
              />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#172033",
                }}
              >
                WhatsApp Business
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Connect your WhatsApp Business account
              </p>
            </div>
          </div>

          {/* STATUS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: statusBackground,
              color: statusColor,
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <FaCheckCircle size={13} />

            {loading
              ? "Checking..."
              : connected
              ? "Connected"
              : "Not Connected"}
          </div>
        </div>

        {/* CARD BODY */}

        <div
          style={{
            padding: "25px 20px 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "28px",
            }}
          >
            {/* PROVIDER */}

            <div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginBottom: "7px",
                }}
              >
                Provider
              </div>

              <div
                style={{
                  color: "#172033",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                WhatsApp Cloud API
              </div>
            </div>

            {/* CONNECTION */}

            <div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginBottom: "7px",
                }}
              >
                Connection
              </div>

              <div
                style={{
                  color: connected
                    ? "#16a34a"
                    : "#dc2626",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {loading
                  ? "Checking..."
                  : connected
                  ? "Active"
                  : "Inactive"}
              </div>
            </div>

            {/* MESSAGING */}

            <div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginBottom: "7px",
                }}
              >
                Messaging
              </div>

              <div
                style={{
                  color: connected
                    ? "#16a34a"
                    : "#dc2626",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {connected
                  ? "Enabled"
                  : "Not Connected"}
              </div>
            </div>

            {/* WEBHOOKS */}

            <div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginBottom: "7px",
                }}
              >
                Webhooks
              </div>

              <div
                style={{
                  color: connected
                    ? "#16a34a"
                    : "#dc2626",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {connected
                  ? "Enabled"
                  : "Not Connected"}
              </div>
            </div>
          </div>

          {/* PHONE INFO */}

          {phoneInfo && (
            <div
              style={{
                marginTop: "20px",
                padding: "14px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #eeeeee",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "6px",
                }}
              >
                WhatsApp Number
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#172033",
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
                    marginTop: "4px",
                    fontSize: "13px",
                    color: "#6b7280",
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
                padding: "12px 14px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "8px",
                color: "#92400e",
                fontSize: "13px",
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
                padding: "12px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
                fontSize: "13px",
              }}
            >
              <strong>
                Phone registration failed:
              </strong>

              <div
                style={{
                  marginTop: "5px",
                }}
              >
                {registrationError}
              </div>
            </div>
          )}

          {/* CONNECTION MESSAGE */}

          {connectionMessage && !error && (
            <div
              style={{
                marginTop: "15px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {connectionMessage}
            </div>
          )}

          {/* BUTTONS */}

          <div
            style={{
              marginTop: "25px",
              paddingTop: "18px",
              borderTop: "1px solid #eeeeee",
              display: "flex",
              gap: "10px",
            }}
          >
            {/* MANAGE */}

            <button
              onClick={handleManageWhatsApp}
              style={{
                border: "none",
                background: "#7c3aed",
                color: "#ffffff",
                padding: "10px 17px",
                borderRadius: "7px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaWhatsapp size={14} />

              Manage WhatsApp
            </button>

            {/* RECONNECT */}

            <button
              onClick={handleReconnectWhatsApp}
              disabled={loading}
              style={{
                border: "1px solid #ddd6fe",
                background: "#ffffff",
                color: "#7c3aed",
                padding: "10px 17px",
                borderRadius: "7px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "13px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <FaSyncAlt size={13} />

              Reconnect
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* WHATSAPP WEBHOOK */}
      {/* ==================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          marginBottom: "22px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eeeeee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaLink
                size={23}
                style={{
                  color: "#7c3aed",
                }}
              />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#172033",
                }}
              >
                WhatsApp Webhook
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Receive incoming WhatsApp messages and status
                updates
              </p>
            </div>
          </div>

          {/* ACTIVE STATUS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: connected
                ? "#dcfce7"
                : "#fee2e2",
              color: connected
                ? "#15803d"
                : "#b91c1c",
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <FaCheckCircle size={13} />

            {connected ? "Active" : "Inactive"}
          </div>
        </div>

        {/* BODY */}

        <div
          style={{
            padding: "25px 20px 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "28px",
            }}
          >
            {/* STATUS */}

            <div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginBottom: "7px",
                }}
              >
                Status
              </div>

              <div
                style={{
                  color: connected
                    ? "#16a34a"
                    : "#dc2626",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {connected
                  ? "Listening for messages"
                  : "Not connected"}
              </div>
            </div>

            {/* EVENTS */}

            <div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginBottom: "7px",
                }}
              >
                Events
              </div>

              <div
                style={{
                  color: "#172033",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Messages & Statuses
              </div>
            </div>
          </div>

          {/* WEBHOOK URL DISPLAY */}

          <div
            style={{
              marginTop: "22px",
              padding: "15px",
              background: "#f8f7ff",
              border: "1px solid #e9e5ff",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                color: "#6b7280",
                fontSize: "12px",
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
                gap: "10px",
              }}
            >
              <code
                style={{
                  color: "#4c1d95",
                  fontSize: "13px",
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
                  border: "1px solid #ddd6fe",
                  background: "#ffffff",
                  color: "#7c3aed",
                  width: "34px",
                  height: "34px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FaCopy size={13} />
              </button>
            </div>
          </div>

          {/* WEBHOOK BUTTON */}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "18px",
              borderTop: "1px solid #eeeeee",
            }}
          >
            <button
              onClick={handleWebhook}
              disabled={webhookChecking}
              style={{
                border: "1px solid #ddd6fe",
                background: "#ffffff",
                color: "#7c3aed",
                padding: "10px 17px",
                borderRadius: "7px",
                cursor: webhookChecking
                  ? "not-allowed"
                  : "pointer",
                fontSize: "13px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: webhookChecking
                  ? 0.6
                  : 1,
              }}
            >
              <FaPlug size={13} />

              {webhookChecking
                ? "Checking..."
                : "Webhook Status"}
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* INFO CARD */}
      {/* ==================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "20px",
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
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaWhatsapp
              size={19}
              style={{
                color: "#16a34a",
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#172033",
              }}
            >
              WhatsApp Integration
            </div>

            <div
              style={{
                marginTop: "4px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {connected
                ? "Your WhatsApp Business integration is configured for messaging and webhook events."
                : "Connect your WhatsApp Business account to enable messaging and webhook events."}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* CONNECT / RECONNECT MODAL */}
      {/* ==================================================== */}

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.55)",
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
              background: "#ffffff",
              borderRadius: "14px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                padding: "20px",
                borderBottom:
                  "1px solid #eeeeee",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#172033",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  WhatsApp Business
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#6b7280",
                    fontSize: "13px",
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
                  background:
                    "transparent",
                  color: "#6b7280",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "18px",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={
                handleSaveConfiguration
              }
            >
              <div
                style={{
                  padding: "22px",
                }}
              >
                {/* PHONE NUMBER ID */}

                <div
                  style={{
                    marginBottom: "17px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom:
                        "7px",
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
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      padding:
                        "11px 12px",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* WABA ID */}

                <div
                  style={{
                    marginBottom: "17px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom:
                        "7px",
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
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      padding:
                        "11px 12px",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* ACCESS TOKEN */}

                <div
                  style={{
                    marginBottom: "17px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom:
                        "7px",
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
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      padding:
                        "11px 12px",
                      fontSize: "13px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily:
                        "inherit",
                    }}
                  />
                </div>

                {/* VERIFY TOKEN */}

                <div
                  style={{
                    marginBottom: "17px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom:
                        "7px",
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
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      padding:
                        "11px 12px",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* PIN */}

                <div
                  style={{
                    marginBottom: "5px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom:
                        "7px",
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
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      padding:
                        "11px 12px",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />

                  <p
                    style={{
                      margin:
                        "6px 0 0",
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    Required for phone
                    registration when
                    applicable. Leave empty
                    for Meta test numbers.
                  </p>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div
                style={{
                  padding: "16px 22px",
                  borderTop:
                    "1px solid #eeeeee",
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  style={{
                    border:
                      "1px solid #d1d5db",
                    background:
                      "#ffffff",
                    color: "#374151",
                    padding:
                      "10px 17px",
                    borderRadius:
                      "7px",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    border: "none",
                    background:
                      "#7c3aed",
                    color: "#ffffff",
                    padding:
                      "10px 17px",
                    borderRadius:
                      "7px",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    opacity: saving
                      ? 0.7
                      : 1,
                  }}
                >
                  <FaSave
                    size={13}
                  />

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
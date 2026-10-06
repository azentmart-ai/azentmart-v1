import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaKey,
  FaCopy,
  FaSyncAlt,
  FaTrash,
  FaCode,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const ApiPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // ============================================================
  // REAL BACKEND STATE
  // ============================================================
  const [apiKeys, setApiKeys] = useState([]);

  const [apiName, setApiName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================
  // LOAD API KEYS FROM BACKEND
  // GET /api/account/api-keys
  // ============================================================
  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/account/api-keys", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load API keys."
        );
      }

      setApiKeys(Array.isArray(data?.keys) ? data.keys : []);
    } catch (err) {
      console.error("Failed to load API keys:", err);
      setError(
        err.message || "Failed to load API keys."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD ON PAGE OPEN
  // ============================================================
  useEffect(() => {
    loadApiKeys();
  }, []);

  // ============================================================
  // CREATE API KEY
  // POST /api/account/api-keys
  // ============================================================
  const handleCreateKey = async () => {
    if (!apiName.trim()) {
      alert("Please enter an API key name.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/account/api-keys",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: apiName.trim(),
            scopes: [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to create API key."
        );
      }

      /*
       * IMPORTANT:
       * The backend returns the plaintext API key only once.
       * We attach it to the returned key object so the user
       * can copy it immediately.
       */
      const createdKey = {
        ...(data.key || {}),
        key: data.plaintext,
        created:
          data.key?.created_at
            ? new Date(
                data.key.created_at
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Just now",
        status:
          data.key?.revoked_at
            ? "Revoked"
            : "Active",
      };

      /*
       * Add the newly created key to the top.
       * We do NOT call GET immediately because the backend
       * intentionally never returns the plaintext again.
       */
      setApiKeys((prev) => [
        createdKey,
        ...prev,
      ]);

      setApiName("");
      setShowModal(false);

      setSuccessMessage(
        "API key created successfully. Copy your key now — it will not be shown again."
      );
    } catch (err) {
      console.error(
        "Failed to create API key:",
        err
      );

      setError(
        err.message ||
          "Failed to create API key."
      );
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // COPY API KEY
  // ============================================================
  const handleCopy = async (apiKey, id) => {
    try {
      await navigator.clipboard.writeText(apiKey);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);

      alert(
        "Unable to copy the API key."
      );
    }
  };

  // ============================================================
  // REGENERATE
  //
  // Existing backend does NOT have a regenerate endpoint.
  // Therefore we do NOT fake regeneration.
  //
  // Instead, tell the user to revoke the old key and create
  // a new one.
  // ============================================================
  const handleRegenerate = () => {
    alert(
      "Regenerate is not available in the current backend. Revoke this key and create a new API key instead."
    );
  };

  // ============================================================
  // DELETE / REVOKE API KEY
  // DELETE /api/account/api-keys/[id]
  // ============================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this API key?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `/api/account/api-keys/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to revoke API key."
        );
      }

      /*
       * Backend uses soft revoke.
       * Remove it from the active frontend list.
       */
      setApiKeys((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      setSuccessMessage(
        "API key revoked successfully."
      );
    } catch (err) {
      console.error(
        "Failed to revoke API key:",
        err
      );

      setError(
        err.message ||
          "Failed to revoke API key."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================
  const formatCreatedDate = (item) => {
    if (item.created) {
      return item.created;
    }

    if (item.created_at) {
      return new Date(
        item.created_at
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return "Unknown";
  };

  // ============================================================
  // DISPLAY KEY
  //
  // Existing backend GET does NOT return plaintext.
  // key_prefix is safe to show.
  //
  // Newly created keys temporarily contain `key`, so we show
  // the plaintext only for that newly-created object.
  // ============================================================
  const getDisplayKey = (item) => {
    if (item.key) {
      return item.key;
    }

    if (item.key_prefix) {
      return `${item.key_prefix}••••••••••••••••`;
    }

    return "••••••••••••••••••••";
  };

  return (
    <div className="api-page">

      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="api-header">

        <div>

          <h1>API</h1>

          <p>
            Manage API keys and access your Azentmart
            WhatsApp services.
          </p>

        </div>

        <button
          className="api-create-btn"
          onClick={() => {
            setApiName("");
            setError("");
            setShowModal(true);
          }}
        >
          <FaPlus />
          Create API Key
        </button>

      </div>


      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}
      {successMessage && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#ecfdf5",
            color: "#047857",
            border: "1px solid #a7f3d0",
          }}
        >
          <FaCheck
            style={{
              marginRight: "8px",
            }}
          />

          {successMessage}
        </div>
      )}


      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}
      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}


      {/* ======================================================
          API KEYS
      ====================================================== */}
      <div className="api-section">

        <div className="api-section-header">

          <div>

            <h2>API Keys</h2>

            <p>
              Create and manage keys used by your
              applications.
            </p>

          </div>

          <span className="api-key-count">
            {apiKeys.length}{" "}
            {apiKeys.length === 1
              ? "Key"
              : "Keys"}
          </span>

        </div>


        <div className="api-key-list">

          {/* ==================================================
              LOADING
          ================================================== */}
          {loading ? (

            <div
              className="api-empty"
            >

              <FaKey />

              <h3>
                Loading API keys...
              </h3>

              <p>
                Please wait while we load your
                API keys.
              </p>

            </div>

          ) : apiKeys.length === 0 ? (

            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="api-empty">

              <FaKey />

              <h3>
                No API keys
              </h3>

              <p>
                Create an API key to connect your
                application.
              </p>

              <button
                className="api-create-btn"
                onClick={() => {
                  setApiName("");
                  setError("");
                  setShowModal(true);
                }}
              >
                <FaPlus />
                Create API Key
              </button>

            </div>

          ) : (

            /* ==================================================
               API KEY LIST
            ================================================== */

            apiKeys.map((item) => (

              <div
                className="api-key-card"
                key={item.id}
              >

                <div className="api-key-left">

                  <div className="api-key-icon">
                    <FaKey />
                  </div>

                  <div className="api-key-info">

                    <div className="api-key-title">

                      <h3>
                        {item.name}
                      </h3>

                      <span className="api-active">

                        <FaCheck />

                        {item.revoked_at
                          ? "Revoked"
                          : item.status ||
                            "Active"}

                      </span>

                    </div>


                    <div className="api-key-value">

                      {getDisplayKey(item)}

                    </div>


                    <small>
                      Created{" "}
                      {formatCreatedDate(
                        item
                      )}
                    </small>

                  </div>

                </div>


                <div className="api-key-actions">

                  {/* COPY */}

                  <button
                    className="api-action-btn"
                    title="Copy"
                    onClick={() =>
                      handleCopy(
                        item.key ||
                          item.key_prefix ||
                          "",
                        item.id
                      )
                    }
                    disabled={!item.key}
                  >

                    {copiedId === item.id ? (
                      <FaCheck />
                    ) : (
                      <FaCopy />
                    )}

                  </button>


                  {/* REGENERATE */}

                  <button
                    className="api-action-btn"
                    title="Regenerate"
                    onClick={() =>
                      handleRegenerate(
                        item.id
                      )
                    }
                  >

                    <FaSyncAlt />

                  </button>


                  {/* DELETE / REVOKE */}

                  <button
                    className="api-action-btn delete"
                    title="Revoke API key"
                    onClick={() =>
                      handleDelete(
                        item.id
                      )
                    }
                    disabled={
                      deletingId === item.id
                    }
                  >

                    {deletingId === item.id ? (
                      "..."
                    ) : (
                      <FaTrash />
                    )}

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>


      {/* ======================================================
          API ENDPOINTS
      ====================================================== */}
      <div className="api-section">

        <div className="api-section-header">

          <div>

            <h2>
              API Endpoints
            </h2>

            <p>
              Available endpoints for your WhatsApp
              application.
            </p>

          </div>

        </div>


        <div className="api-endpoint-list">

          <div className="api-endpoint-card">

            <span className="api-method post">
              POST
            </span>

            <div className="api-endpoint-info">

              <code>
                /api/messages
              </code>

              <span>
                Send a WhatsApp message.
              </span>

            </div>

          </div>


          <div className="api-endpoint-card">

            <span className="api-method get">
              GET
            </span>

            <div className="api-endpoint-info">

              <code>
                /api/conversations
              </code>

              <span>
                Retrieve WhatsApp conversations.
              </span>

            </div>

          </div>


          <div className="api-endpoint-card">

            <span className="api-method get">
              GET
            </span>

            <div className="api-endpoint-info">

              <code>
                /api/contacts
              </code>

              <span>
                Retrieve customer contacts.
              </span>

            </div>

          </div>


          <div className="api-endpoint-card">

            <span className="api-method post">
              POST
            </span>

            <div className="api-endpoint-info">

              <code>
                /api/webhooks
              </code>

              <span>
                Receive WhatsApp webhook events.
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          API INFORMATION
      ====================================================== */}
      <div className="api-info-box">

        <div className="api-info-icon">
          <FaCode />
        </div>

        <div>

          <h3>
            Using the API
          </h3>

          <p>
            Include your API key in the Authorization
            header when making requests.
          </p>

          <div className="api-code-box">
            Authorization: Bearer YOUR_API_KEY
          </div>

        </div>

      </div>


      {/* ======================================================
          CREATE API KEY MODAL
      ====================================================== */}
      {showModal && (

        <div className="api-modal-overlay">

          <div className="api-modal">

            <div className="api-modal-header">

              <div>

                <h3>
                  Create API Key
                </h3>

                <p>
                  Create a new API key for your
                  application.
                </p>

              </div>

              <button
                className="api-modal-close"
                onClick={() =>
                  setShowModal(false)
                }
                disabled={creating}
              >
                <FaTimes />
              </button>

            </div>


            {/* FORM */}

            <div className="api-form">

              <label>
                API Key Name *
              </label>

              <input
                type="text"
                value={apiName}
                placeholder="e.g. Production API"
                onChange={(event) =>
                  setApiName(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !creating
                  ) {
                    handleCreateKey();
                  }
                }}
                disabled={creating}
              />

              <small>
                Use a name that helps you identify
                this API key.
              </small>

            </div>


            {/* FOOTER */}

            <div className="api-modal-footer">

              <button
                className="api-cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
                disabled={creating}
              >
                Cancel
              </button>

              <button
                className="api-save-btn"
                onClick={handleCreateKey}
                disabled={
                  creating ||
                  !apiName.trim()
                }
              >

                <FaKey />

                {creating
                  ? "Creating..."
                  : "Create API Key"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ApiPage;
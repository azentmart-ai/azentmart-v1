import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaChartLine,
  FaArrowUp,
  FaCheckCircle,
  FaCalendarAlt,
  FaSyncAlt,
  FaPlus,
  FaShieldAlt,
} from "react-icons/fa";

import { supabase } from "../lib/supabase";

function BillingPage() {
  // ============================================================
  // ACCOUNT DATA
  // ============================================================

  const [accountId, setAccountId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // ============================================================
  // CREDIT DATA
  // ============================================================

  const [creditBalance, setCreditBalance] = useState(0);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const [totalCreditsPurchased, setTotalCreditsPurchased] =
    useState(0);

  const [loadingCredits, setLoadingCredits] = useState(true);
  const [creditError, setCreditError] = useState("");

  // ============================================================
  // CREDIT PACKAGE STATE
  // ============================================================

  const [selectedCredits, setSelectedCredits] = useState(250);
  const [customAmount, setCustomAmount] = useState("");

  // ============================================================
  // CREDIT OPTIONS
  // ============================================================

  const creditOptions = [
    {
      credits: 250,
      price: 250,
      label: "250",
    },
    {
      credits: 1000,
      price: 1000,
      label: "1K",
    },
    {
      credits: 5000,
      price: 5000,
      label: "5K",
    },
    {
      credits: 10000,
      price: 10000,
      label: "10K",
    },
  ];

  // ============================================================
  // TRANSACTIONS
  // ============================================================

  const transactions = [];

  // ============================================================
  // LOAD CREDIT DATA
  // ============================================================

  const loadCreditData = async () => {
    try {
      setLoadingCredits(true);
      setCreditError("");

      // ----------------------------------------------------------
      // STEP 1: CURRENT USER
      // ----------------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "Supabase auth error:",
          userError
        );

        setCreditError(
          `Unable to get logged-in user: ${userError.message}`
        );

        return;
      }

      if (!user) {
        setCreditError(
          "No logged-in user found. Please sign in again."
        );

        return;
      }

      setCurrentUserId(user.id);

      // ----------------------------------------------------------
      // STEP 2: ACCOUNT PROFILE
      // ----------------------------------------------------------

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "user_id, account_id, account_role"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Supabase profile error:",
          profileError
        );

        setCreditError(
          `Unable to find your account profile: ${profileError.message}`
        );

        return;
      }

      if (!profile) {
        setCreditError(
          "No account profile found for the logged-in user."
        );

        return;
      }

      if (!profile.account_id) {
        setCreditError(
          "Your user profile does not have an account assigned."
        );

        return;
      }

      setAccountId(profile.account_id);

      // ----------------------------------------------------------
      // STEP 3: CREDIT ACCOUNT
      // ----------------------------------------------------------

      const {
        data: creditData,
        error: creditErrorResponse,
      } = await supabase
        .from("account_credits")
        .select(
          "account_id, balance, total_purchased, total_used"
        )
        .eq("account_id", profile.account_id)
        .maybeSingle();

      if (creditErrorResponse) {
        console.error(
          "Supabase credit error:",
          creditErrorResponse
        );

        setCreditError(
          `Unable to load credit account: ${creditErrorResponse.message}`
        );

        return;
      }

      if (!creditData) {
        setCreditBalance(0);
        setTotalCreditsUsed(0);
        setTotalCreditsPurchased(0);

        setCreditError(
          "No credit account found for the current account."
        );

        return;
      }

      // ----------------------------------------------------------
      // STEP 4: UPDATE UI
      // ----------------------------------------------------------

      setCreditBalance(
        Number(creditData.balance) || 0
      );

      setTotalCreditsUsed(
        Number(creditData.total_used) || 0
      );

      setTotalCreditsPurchased(
        Number(creditData.total_purchased) || 0
      );
    } catch (error) {
      console.error(
        "Unexpected credit loading error:",
        error
      );

      setCreditError(
        error.message ||
          "Failed to load credit information."
      );
    } finally {
      setLoadingCredits(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadCreditData();
  }, []);

  // ============================================================
  // ACTIVE OPTION
  // ============================================================

  const activeOption =
    creditOptions.find(
      (item) =>
        item.credits === selectedCredits
    ) || creditOptions[0];

  // ============================================================
  // DISPLAY VALUES
  // ============================================================

  const displayCredits = customAmount
    ? Number(customAmount)
    : activeOption.credits;

  const displayPrice = customAmount
    ? Number(customAmount)
    : activeOption.price;

  // ============================================================
  // CUSTOM AMOUNT
  // ============================================================

  const handleCustomAmount = (value) => {
    setCustomAmount(value);

    const amount = Number(value);

    if (!amount) {
      setSelectedCredits(250);
      return;
    }

    setSelectedCredits(amount);
  };

  // ============================================================
  // RAZORPAY SCRIPT
  // ============================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(true)
        );

        existingScript.addEventListener(
          "error",
          () => resolve(false)
        );

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ============================================================
  // ADD CREDITS
  // ============================================================

  const handleAddCredits = async () => {
    if (
      !displayCredits ||
      displayCredits < 250
    ) {
      alert(
        "Minimum top-up is 250 credits (₹250)."
      );

      return;
    }

    const creditsToPurchase =
      Number(displayCredits);

    if (
      !Number.isFinite(creditsToPurchase) ||
      creditsToPurchase < 250
    ) {
      alert(
        "Please enter a valid credit amount."
      );

      return;
    }

    try {
      // --------------------------------------------------------
      // LOAD RAZORPAY
      // --------------------------------------------------------

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        alert(
          "Unable to load Razorpay Checkout. Please check your internet connection and try again."
        );

        return;
      }

      // --------------------------------------------------------
      // CREATE ORDER
      // --------------------------------------------------------

      const orderResponse =
        await fetch(
          "/api/razorpay/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              credits: creditsToPurchase,
            }),
          }
        );

      const orderData =
        await orderResponse.json();

      if (
        !orderResponse.ok ||
        !orderData.success
      ) {
        console.error(
          "Razorpay order creation failed:",
          orderData
        );

        throw new Error(
          orderData.error ||
            "Unable to create Razorpay order."
        );
      }

      // --------------------------------------------------------
      // RAZORPAY OPTIONS
      // --------------------------------------------------------

      const options = {
        key: orderData.keyId,

        amount: orderData.amount,

        currency:
          orderData.currency || "INR",

        name: "AzentmartAI",

        description:
          `${creditsToPurchase.toLocaleString(
            "en-IN"
          )} Calling Credits`,

        order_id:
          orderData.orderId,

        handler:
          async function (
            paymentResponse
          ) {
            try {
              const verifyResponse =
                await fetch(
                  "/api/razorpay/verify-payment",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      razorpay_order_id:
                        paymentResponse.razorpay_order_id,

                      razorpay_payment_id:
                        paymentResponse.razorpay_payment_id,

                      razorpay_signature:
                        paymentResponse.razorpay_signature,

                      credits:
                        creditsToPurchase,

                      accountId,

                      userId:
                        currentUserId,
                    }),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              if (
                !verifyResponse.ok ||
                !verifyData.success
              ) {
                console.error(
                  "Payment verification failed:",
                  verifyData
                );

                alert(
                  verifyData.error ||
                    "Payment was completed, but verification failed."
                );

                return;
              }

              alert(
                `${creditsToPurchase.toLocaleString(
                  "en-IN"
                )} credits purchased successfully!`
              );

              await loadCreditData();
            } catch (
              verificationError
            ) {
              console.error(
                "Verification error:",
                verificationError
              );

              alert(
                "Payment was completed, but the verification request failed."
              );
            }
          },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay Checkout closed."
            );
          },
        },

        prefill: {
          email: "",
          contact: "",
        },

        notes: {
          credits:
            String(creditsToPurchase),

          account_id: accountId
            ? String(accountId)
            : "",

          user_id: currentUserId
            ? String(currentUserId)
            : "",
        },

        theme: {
          color: "#6d4aff",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay checkout error:",
        error
      );

      alert(
        error.message ||
          "Unable to start Razorpay payment. Please try again."
      );
    }
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = async () => {
    await loadCreditData();
  };

  // ============================================================
  // FORMAT
  // ============================================================

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN"
    );

  // ============================================================
  // STYLES
  // ============================================================

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      background: "#081116",
      color: "#f5f7f8",
      padding:
        "30px 30px 45px",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    header: {
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "flex-start",
      marginBottom: "28px",
    },

    back: {
      background: "transparent",
      border: "none",
      padding: 0,
      color: "#7da2bd",
      fontSize: "13px",
      cursor: "pointer",
      marginBottom: "14px",
    },

    title: {
      margin: 0,
      fontSize: "30px",
      lineHeight: "1.2",
      fontWeight: "600",
      letterSpacing: "-0.5px",
      color: "#f5f7f8",
    },

    subtitle: {
      margin:
        "8px 0 0",
      fontSize: "13px",
      color: "#82a0b4",
    },

    refreshButton: {
      border: "none",
      background: "#ffffff",
      color: "#36404a",
      borderRadius: "7px",
      padding:
        "11px 17px",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
    },

    error: {
      background: "#351719",
      border:
        "1px solid #63262a",
      color: "#fca5a5",
      padding:
        "12px 15px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "13px",
    },

    summaryGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
      gap: "18px",
      marginBottom: "26px",
    },

    summaryCard: {
      background: "#0e1a20",
      border:
        "1px solid #20313a",
      borderRadius: "9px",
      padding: "17px 18px",
      display: "flex",
      alignItems: "center",
      gap: "13px",
    },

    summaryIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "9px",
      border:
        "1px solid #263942",
      background: "#101f26",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#dbe5ea",
      flexShrink: 0,
    },

    summaryLabel: {
      display: "block",
      color: "#8299a7",
      fontSize: "11px",
      marginBottom: "5px",
    },

    summaryNumber: {
      fontSize: "23px",
      fontWeight: "650",
      color: "#00c897",
      marginRight: "5px",
    },

    summaryUnit: {
      color: "#8299a7",
      fontSize: "11px",
    },

    mainGrid: {
      display: "grid",
      gridTemplateColumns:
        "minmax(0, 1fr) minmax(0, 1fr)",
      gap: "20px",
      marginBottom: "20px",
    },

    panel: {
      background: "#0e1a20",
      border:
        "1px solid #20313a",
      borderRadius: "10px",
      padding: "24px",
      minHeight: "385px",
      boxSizing: "border-box",
    },

    panelTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "600",
      color: "#edf3f5",
    },

    description: {
      color: "#82a0b4",
      fontSize: "12px",
      lineHeight: "1.7",
      margin:
        "14px 0 20px",
    },

    rateBox: {
      display: "flex",
      gap: "12px",
      padding: "16px",
      border:
        "1px solid #24363f",
      background: "#0d181e",
      borderRadius: "9px",
    },

    rateIcon: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: "#334558",
      color: "#a9c1d1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    rateTitle: {
      margin: 0,
      fontSize: "12px",
      fontWeight: "600",
      color: "#edf3f5",
    },

    rateText: {
      margin:
        "5px 0 0",
      fontSize: "11px",
      lineHeight: "1.6",
      color: "#7f98a7",
    },

    optionGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
      gap: "9px",
      marginTop: "18px",
    },

    option: {
      border:
        "1px solid #2a3d46",
      background: "#18262d",
      color: "#dce5e9",
      borderRadius: "7px",
      padding:
        "13px 8px",
      cursor: "pointer",
      minHeight: "62px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition:
        "all 0.15s ease",
    },

    selectedOption: {
      border:
        "1px solid #7c4dff",
      background: "#251747",
      boxShadow:
        "0 0 0 1px rgba(124,77,255,0.12)",
    },

    optionLabel: {
      fontSize: "12px",
      fontWeight: "700",
    },

    optionPrice: {
      marginTop: "5px",
      fontSize: "10px",
      color: "#91a7b4",
    },

    customBox: {
      marginTop: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent:
        "space-between",
      gap: "10px",
      padding:
        "11px 13px",
      border:
        "1px solid #273a43",
      borderRadius: "8px",
      background: "#0d181e",
    },

    customLabel: {
      fontSize: "11px",
      color: "#8da5b3",
    },

    customInput: {
      width: "135px",
      boxSizing: "border-box",
      border: "none",
      outline: "none",
      background: "#17262d",
      borderRadius: "6px",
      color: "#e8eef1",
      padding:
        "8px 10px",
      fontSize: "11px",
      textAlign: "right",
    },

    purchaseSummary: {
      marginTop: "16px",
      border:
        "1px solid #273a43",
      borderRadius: "9px",
      background: "#0b161b",
      overflow: "hidden",
    },

    purchaseHeader: {
      padding:
        "12px 15px",
      borderBottom:
        "1px solid #24363e",
      color: "#8da5b3",
      fontSize: "10px",
      fontWeight: "600",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    },

    purchaseRows: {
      padding:
        "4px 15px",
    },

    purchaseRow: {
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "center",
      padding:
        "11px 0",
      borderBottom:
        "1px solid #1c2c33",
    },

    purchaseRowLast: {
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "center",
      padding:
        "13px 0",
    },

    purchaseLabel: {
      color: "#8299a7",
      fontSize: "11px",
    },

    purchaseCredits: {
      color: "#f1f6f8",
      fontSize: "13px",
      fontWeight: "650",
    },

    purchasePrice: {
      color: "#00c897",
      fontSize: "19px",
      fontWeight: "700",
    },

    purchaseRate: {
      color: "#7d95a2",
      fontSize: "10px",
    },

    purchaseButton: {
      width: "100%",
      marginTop: "13px",
      border: "none",
      background:
        "linear-gradient(90deg, #6d3ee8, #7447ef)",
      color: "#ffffff",
      borderRadius: "7px",
      padding:
        "12px 15px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
    },

    secureText: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      marginTop: "9px",
      color: "#687f8c",
      fontSize: "9px",
    },

    transactionPanel: {
      background: "#0e1a20",
      border:
        "1px solid #20313a",
      borderRadius: "10px",
      overflow: "hidden",
    },

    transactionHeader: {
      padding:
        "20px 22px",
      borderBottom:
        "1px solid #20313a",
    },

    transactionTitle: {
      margin: 0,
      fontSize: "16px",
      color: "#edf3f5",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    transactionDescription: {
      margin:
        "6px 0 0",
      fontSize: "11px",
      color: "#78919f",
    },

    emptyTransactions: {
      padding:
        "50px 20px",
      textAlign: "center",
      color: "#6e8795",
    },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div style={styles.page}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={styles.header}>

        <div>

          <button
            type="button"
            style={styles.back}
          >
            ← Back
          </button>

          <h1 style={styles.title}>
            Billing &amp; Credits
          </h1>

          <p style={styles.subtitle}>
            Monitor call transactions, balances,
            and load top-up calling credits.
          </p>

        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loadingCredits}
          style={{
            ...styles.refreshButton,
            opacity: loadingCredits
              ? 0.6
              : 1,
          }}
        >
          <FaSyncAlt
            style={{
              animation:
                loadingCredits
                  ? "spin 1s linear infinite"
                  : "none",
            }}
          />

          {loadingCredits
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {creditError && (
        <div style={styles.error}>
          {creditError}
        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div style={styles.summaryGrid}>

        {/* BALANCE */}

        <div style={styles.summaryCard}>

          <div style={styles.summaryIcon}>
            <FaCreditCard size={15} />
          </div>

          <div>

            <span style={styles.summaryLabel}>
              Current Balance
            </span>

            <strong style={styles.summaryNumber}>
              {loadingCredits
                ? "..."
                : formatNumber(
                    creditBalance
                  )}
            </strong>

            <span style={styles.summaryUnit}>
              credits
            </span>

          </div>

        </div>

        {/* USED */}

        <div style={styles.summaryCard}>

          <div style={styles.summaryIcon}>
            <FaChartLine size={15} />
          </div>

          <div>

            <span style={styles.summaryLabel}>
              Total Credits Used
            </span>

            <strong style={styles.summaryNumber}>
              {loadingCredits
                ? "..."
                : formatNumber(
                    totalCreditsUsed
                  )}
            </strong>

            <span style={styles.summaryUnit}>
              credits
            </span>

          </div>

        </div>

        {/* PURCHASED */}

        <div style={styles.summaryCard}>

          <div style={styles.summaryIcon}>
            <FaArrowUp size={15} />
          </div>

          <div>

            <span style={styles.summaryLabel}>
              Total Credits Purchased
            </span>

            <strong style={styles.summaryNumber}>
              {loadingCredits
                ? "..."
                : formatNumber(
                    totalCreditsPurchased
                  )}
            </strong>

            <span style={styles.summaryUnit}>
              credits
            </span>

          </div>

        </div>

      </div>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div style={styles.mainGrid}>

        {/* ==================================================
            PAY AS YOU GO
        ================================================== */}

        <div style={styles.panel}>

          <h2 style={styles.panelTitle}>
            Pay-As-You-Go Credits
          </h2>

          <p style={styles.description}>
            AzentmartAI utilizes a simple usage
            credit balance to fund phone
            conversations managed by your AI
            Voice Agents.
          </p>

          <div style={styles.rateBox}>

            <div style={styles.rateIcon}>
              <FaCheckCircle size={14} />
            </div>

            <div>

              <h3 style={styles.rateTitle}>
                Rate Structure
              </h3>

              <p style={styles.rateText}>
                Each credit corresponds to exactly
                ₹1.00. Credits are deducted
                continuously per second of call
                connection time based on your
                agent&apos;s active model rates.
              </p>

            </div>

          </div>

          <p
            style={{
              ...styles.description,
              marginTop: "20px",
            }}
          >
            Credits do not expire as long as your
            account remains in good standing. You
            can add credits manually at any time
            using a supported payment method.
          </p>

        </div>

        {/* ==================================================
            ADD BALANCE
        ================================================== */}

        <div style={styles.panel}>

          <h2 style={styles.panelTitle}>
            <FaCreditCard
              style={{
                color: "#8b5cf6",
                marginRight: "8px",
                fontSize: "15px",
              }}
            />

            Add Balance (Credits)
          </h2>

          <p style={styles.description}>
            Buy credits to fund voice calls.
            Minimum top-up is 250 credits (₹250).
          </p>

          {/* CREDIT OPTIONS */}

          <div style={styles.optionGrid}>

            {creditOptions.map(
              (option) => {
                const isSelected =
                  selectedCredits ===
                    option.credits &&
                  !customAmount;

                return (
                  <button
                    key={option.credits}
                    type="button"
                    onClick={() => {
                      setSelectedCredits(
                        option.credits
                      );

                      setCustomAmount("");
                    }}
                    style={{
                      ...styles.option,
                      ...(isSelected
                        ? styles.selectedOption
                        : {}),
                    }}
                  >

                    <strong
                      style={
                        styles.optionLabel
                      }
                    >
                      {option.label}
                    </strong>

                    <span
                      style={
                        styles.optionPrice
                      }
                    >
                      ₹
                      {formatNumber(
                        option.price
                      )}
                    </span>

                  </button>
                );
              }
            )}

          </div>

          {/* CUSTOM */}

          <div style={styles.customBox}>

            <span style={styles.customLabel}>
              Custom Amount
            </span>

            <input
              type="number"
              min="250"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(event) =>
                handleCustomAmount(
                  event.target.value
                )
              }
              style={styles.customInput}
            />

          </div>

          {/* ==================================================
              IMPROVED PURCHASE SUMMARY
          ================================================== */}

          <div style={styles.purchaseSummary}>

            <div style={styles.purchaseHeader}>
              Purchase Summary
            </div>

            <div style={styles.purchaseRows}>

              {/* CREDITS */}

              <div style={styles.purchaseRow}>

                <span
                  style={
                    styles.purchaseLabel
                  }
                >
                  Credits
                </span>

                <strong
                  style={
                    styles.purchaseCredits
                  }
                >
                  {formatNumber(
                    displayCredits
                  )}{" "}
                  credits
                </strong>

              </div>

              {/* RATE */}

              <div style={styles.purchaseRow}>

                <span
                  style={
                    styles.purchaseLabel
                  }
                >
                  Rate
                </span>

                <span
                  style={
                    styles.purchaseRate
                  }
                >
                  1 credit = ₹1
                </span>

              </div>

              {/* AMOUNT */}

              <div
                style={
                  styles.purchaseRowLast
                }
              >

                <span
                  style={{
                    color: "#a9bac4",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Total Amount
                </span>

                <strong
                  style={
                    styles.purchasePrice
                  }
                >
                  ₹
                  {formatNumber(
                    displayPrice
                  )}
                </strong>

              </div>

            </div>

          </div>

          {/* PURCHASE */}

          <button
            type="button"
            onClick={handleAddCredits}
            style={styles.purchaseButton}
          >

            <FaPlus size={11} />

            Purchase{" "}
            {formatNumber(
              displayCredits
            )}{" "}
            Credits

          </button>

          <div style={styles.secureText}>
            <FaShieldAlt size={9} />
            Secure payment powered by Razorpay
          </div>

        </div>

      </div>

      {/* ======================================================
          TRANSACTION HISTORY
      ====================================================== */}

      <div style={styles.transactionPanel}>

        <div style={styles.transactionHeader}>

          <h2
            style={
              styles.transactionTitle
            }
          >
            <FaCalendarAlt size={13} />

            Transaction History
          </h2>

          <p
            style={
              styles.transactionDescription
            }
          >
            All your billing, plan
            subscriptions, and top-up
            transactions.
          </p>

        </div>

        {transactions.length === 0 ? (

          <div
            style={
              styles.emptyTransactions
            }
          >

            <FaCalendarAlt
              size={30}
              style={{
                marginBottom: "12px",
                opacity: 0.4,
              }}
            />

            <h3
              style={{
                margin:
                  "0 0 7px",
                fontSize: "14px",
                color: "#b5c4cc",
              }}
            >
              No transactions yet
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#6e8795",
              }}
            >
              Your billing and credit
              transactions will appear
              here once credits are
              purchased or used.
            </p>

          </div>

        ) : (

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "13px 18px",
                      fontSize: "10px",
                      color: "#718996",
                    }}
                  >
                    DATE &amp; TIME
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "13px 18px",
                      fontSize: "10px",
                      color: "#718996",
                    }}
                  >
                    TRANSACTION ID
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "13px 18px",
                      fontSize: "10px",
                      color: "#718996",
                    }}
                  >
                    TYPE
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "13px 18px",
                      fontSize: "10px",
                      color: "#718996",
                    }}
                  >
                    CREDITS
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "13px 18px",
                      fontSize: "10px",
                      color: "#718996",
                    }}
                  >
                    BALANCE
                  </th>

                </tr>

              </thead>

              <tbody>

                {transactions.map(
                  (transaction) => (
                    <tr
                      key={
                        transaction.id
                      }
                    >

                      <td>
                        {transaction.date}
                      </td>

                      <td>
                        {transaction.id}
                      </td>

                      <td>
                        {transaction.type}
                      </td>

                      <td>
                        {transaction.credits}
                      </td>

                      <td>
                        {transaction.balance}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================================
          RESPONSIVE CSS
      ====================================================== */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 1000px) {
            .billing-main-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 750px) {
            .billing-summary {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

    </div>
  );
}

export default BillingPage;
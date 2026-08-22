import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaChartLine,
  FaArrowUp,
  FaCheckCircle,
  FaCalendarAlt,
  FaSyncAlt,
  FaPlus,
} from "react-icons/fa";

import { supabase } from "../lib/supabase";

function BillingPage() {
  /*
   * ============================================================
   * ACCOUNT DATA
   * ============================================================
   */

  const [accountId, setAccountId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  /*
   * ============================================================
   * CREDIT DATA
   * ============================================================
   */

  const [creditBalance, setCreditBalance] = useState(0);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const [totalCreditsPurchased, setTotalCreditsPurchased] = useState(0);

  const [loadingCredits, setLoadingCredits] = useState(true);
  const [creditError, setCreditError] = useState("");

  /*
   * ============================================================
   * CREDIT PACKAGE STATE
   * ============================================================
   */

  const [selectedCredits, setSelectedCredits] = useState(250);
  const [customAmount, setCustomAmount] = useState("");

  /*
   * ============================================================
   * RAZORPAY STANDARD CHECKOUT
   * ============================================================
   *
   * The frontend NEVER contains the Razorpay Key Secret.
   *
   * Flow:
   * 1. User selects credits.
   * 2. Frontend calls /api/razorpay/create-order.
   * 3. Backend creates the Razorpay order using the secret.
   * 4. Razorpay Checkout opens in the browser.
   * 5. On success, the frontend sends the three Razorpay
   *    response values to /api/razorpay/verify-payment.
   * 6. Backend verifies the signature and handles fulfilment.
   *
   * The Key ID returned by create-order is safe for Checkout.
   */

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

  /*
   * ============================================================
   * TRANSACTIONS
   * ============================================================
   *
   * We are not touching the backend/database transaction system.
   * Therefore this remains empty for now.
   */

  const transactions = [];

  /*
   * ============================================================
   * LOAD CREDIT DATA FROM SUPABASE
   * ============================================================
   */

  const loadCreditData = async () => {
    try {
      setLoadingCredits(true);
      setCreditError("");

      /*
       * STEP 1:
       * Get currently logged-in Supabase user
       */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Supabase auth error:", userError);

        setCreditError(
          `Unable to get logged-in user: ${userError.message}`
        );

        return;
      }

      if (!user) {
        console.warn("No logged-in Supabase user found.");

        setCreditError(
          "No logged-in user found. Please sign in again."
        );

        return;
      }

      setCurrentUserId(user.id);

      console.log("Logged-in Supabase user:", user.id);

      /*
       * STEP 2:
       * Find account belonging to this user
       */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("user_id, account_id, account_role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Supabase profile error:", profileError);

        setCreditError(
          `Unable to find your account profile: ${profileError.message}`
        );

        return;
      }

      if (!profile) {
        console.warn(
          "No profile found for logged-in user:",
          user.id
        );

        setCreditError(
          "No account profile found for the logged-in user."
        );

        return;
      }

      if (!profile.account_id) {
        console.warn(
          "Profile does not contain an account_id:",
          profile
        );

        setCreditError(
          "Your user profile does not have an account assigned."
        );

        return;
      }

      /*
       * Save account ID
       */

      setAccountId(profile.account_id);

      console.log("Account profile loaded:", profile);

      /*
       * STEP 3:
       * Load credit account
       */

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
        console.warn(
          "No account_credits record found for account:",
          profile.account_id
        );

        setCreditBalance(0);
        setTotalCreditsUsed(0);
        setTotalCreditsPurchased(0);

        setCreditError(
          "No credit account found for the current account."
        );

        return;
      }

      /*
       * STEP 4:
       * Update UI with REAL Supabase values
       */

      setCreditBalance(Number(creditData.balance) || 0);

      setTotalCreditsUsed(
        Number(creditData.total_used) || 0
      );

      setTotalCreditsPurchased(
        Number(creditData.total_purchased) || 0
      );

      console.log(
        "Credit data loaded successfully:",
        creditData
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

  /*
   * ============================================================
   * LOAD DATA WHEN PAGE OPENS
   * ============================================================
   */

  useEffect(() => {
    loadCreditData();
  }, []);

  /*
   * ============================================================
   * ACTIVE CREDIT OPTION
   * ============================================================
   */

  const activeOption =
    creditOptions.find(
      (item) => item.credits === selectedCredits
    ) || creditOptions[0];

  /*
   * ============================================================
   * DISPLAY CREDIT / PRICE
   * ============================================================
   */

  const displayCredits = customAmount
    ? Number(customAmount)
    : activeOption.credits;

  const displayPrice = customAmount
    ? Number(customAmount)
    : activeOption.price;

  /*
   * ============================================================
   * CUSTOM AMOUNT
   * ============================================================
   */

  const handleCustomAmount = (value) => {
    setCustomAmount(value);

    const amount = Number(value);

    if (!amount) {
      setSelectedCredits(250);
      return;
    }

    setSelectedCredits(amount);
  };

  /*
   * ============================================================
   * PURCHASE / RAZORPAY STANDARD CHECKOUT
   * ============================================================
   */

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleAddCredits = async () => {
    if (!displayCredits || displayCredits < 250) {
      alert("Minimum top-up is 250 credits (₹250).");
      return;
    }

    const creditsToPurchase = Number(displayCredits);

    if (!Number.isFinite(creditsToPurchase) || creditsToPurchase < 250) {
      alert("Please enter a valid credit amount.");
      return;
    }

    try {
      /*
       * STEP 1:
       * Load Razorpay Checkout in the browser.
       */

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        alert(
          "Unable to load Razorpay Checkout. Please check your internet connection and try again."
        );
        return;
      }

      /*
       * STEP 2:
       * Create the Razorpay order through OUR backend.
       *
       * The Key Secret stays on the backend.
       */

      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credits: creditsToPurchase,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        console.error("Razorpay order creation failed:", orderData);

        throw new Error(
          orderData.error || "Unable to create Razorpay order."
        );
      }

      console.log("Razorpay order created:", orderData);

      /*
       * STEP 3:
       * Open Razorpay Standard Checkout.
       */

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "AzentmartAI",
        description: `${creditsToPurchase.toLocaleString(
          "en-IN"
        )} Calling Credits`,
        order_id: orderData.orderId,

        handler: async function (paymentResponse) {
          console.log(
            "Razorpay payment response received:",
            paymentResponse
          );

          /*
           * STEP 4:
           * Send the successful Checkout response to the backend.
           *
           * The backend must verify the Razorpay signature before
           * treating the payment as genuine.
           */

          try {
            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  credits: creditsToPurchase,
                  accountId,
                  userId: currentUserId,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              console.error(
                "Razorpay payment verification failed:",
                verifyData
              );

              alert(
                verifyData.error ||
                  "Payment was completed, but verification failed. Please check the Razorpay dashboard before retrying."
              );

              return;
            }

            console.log(
              "Razorpay payment verified successfully:",
              verifyData
            );

            alert(
              `${creditsToPurchase.toLocaleString(
                "en-IN"
              )} credits purchased successfully!`
            );

            /*
             * Refresh the existing Supabase credit data so the
             * current balance cards show the latest values.
             */

            await loadCreditData();
          } catch (verificationError) {
            console.error(
              "Razorpay verification request failed:",
              verificationError
            );

            alert(
              "Payment was completed, but the verification request failed. Please check the Razorpay dashboard before retrying."
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay Checkout closed by user.");
          },
        },

        prefill: {
          email: "",
          contact: "",
        },

        notes: {
          credits: String(creditsToPurchase),
          account_id: accountId ? String(accountId) : "",
          user_id: currentUserId ? String(currentUserId) : "",
        },

        theme: {
          color: "#6d4aff",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);

        alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Razorpay checkout error:", error);

      alert(
        error.message ||
          "Unable to start Razorpay payment. Please try again."
      );
    }
  };

  /*
   * ============================================================
   * REFRESH
   * ============================================================
   */

  const handleRefresh = async () => {
    await loadCreditData();
  };

  /*
   * ============================================================
   * RETURN UI
   * ============================================================
   */

  return (
    <div className="billing-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="billing-header">

        <div>

          <button
            className="billing-back-button"
            type="button"
          >
            ← Back
          </button>

          <h1>
            Billing &amp; Credits
          </h1>

          <p>
            Monitor call transactions, balances, and load top-up
            calling credits.
          </p>

        </div>

        <button
          className="billing-refresh-button"
          type="button"
          onClick={handleRefresh}
          disabled={loadingCredits}
        >

          <FaSyncAlt />

          {loadingCredits
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {creditError && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            fontSize: "14px",
          }}
        >
          {creditError}
        </div>
      )}

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="billing-summary">

        {/* CURRENT BALANCE */}

        <div className="billing-summary-card">

          <div className="billing-summary-icon">
            <FaCreditCard />
          </div>

          <div className="billing-summary-content">

            <span>
              Current Balance
            </span>

            <strong>
              {loadingCredits
                ? "..."
                : creditBalance.toLocaleString("en-IN")}
            </strong>

            <small>
              credits
            </small>

          </div>

        </div>

        {/* TOTAL USED */}

        <div className="billing-summary-card">

          <div className="billing-summary-icon">
            <FaChartLine />
          </div>

          <div className="billing-summary-content">

            <span>
              Total Credits Used
            </span>

            <strong>
              {loadingCredits
                ? "..."
                : totalCreditsUsed.toLocaleString("en-IN")}
            </strong>

            <small>
              credits
            </small>

          </div>

        </div>

        {/* TOTAL PURCHASED */}

        <div className="billing-summary-card">

          <div className="billing-summary-icon">
            <FaArrowUp />
          </div>

          <div className="billing-summary-content">

            <span>
              Total Credits Purchased
            </span>

            <strong>
              {loadingCredits
                ? "..."
                : totalCreditsPurchased.toLocaleString("en-IN")}
            </strong>

            <small>
              credits
            </small>

          </div>

        </div>

      </div>

      {/* ======================================================
          CREDIT INFORMATION + ADD BALANCE
      ====================================================== */}

      <div className="billing-main-grid">

        {/* ==================================================
            PAY AS YOU GO
        ================================================== */}

        <div className="billing-panel">

          <h2>
            Pay-As-You-Go Credits
          </h2>

          <p className="billing-description">
            AzentmartAI utilizes a simple usage credit balance
            to fund phone conversations managed by your AI Voice
            Agents.
          </p>

          <div className="billing-rate-box">

            <div className="billing-check-icon">
              <FaCheckCircle />
            </div>

            <div>

              <h3>
                Rate Structure
              </h3>

              <p>
                Each credit corresponds to exactly ₹1.00.
                Credits are deducted continuously per second
                of call connection time based on your agent&apos;s
                active model rates.
              </p>

            </div>

          </div>

          <p className="billing-description billing-bottom-text">
            Credits do not expire as long as your account remains
            in good standing. You can add credits manually at any
            time using a supported payment method.
          </p>

        </div>

        {/* ==================================================
            ADD BALANCE
        ================================================== */}

        <div className="billing-panel">

          <h2>
            <FaCreditCard className="billing-heading-icon" />
            Add Balance (Credits)
          </h2>

          <p className="billing-description">
            Buy credits to fund voice calls. Minimum top-up is
            250 credits (₹250).
          </p>

          {/* CREDIT OPTIONS */}

          <div className="credit-options">

            {creditOptions.map((option) => (

              <button
                key={option.credits}
                type="button"
                className={
                  selectedCredits === option.credits &&
                  !customAmount
                    ? "credit-option selected"
                    : "credit-option"
                }
                onClick={() => {
                  setSelectedCredits(option.credits);
                  setCustomAmount("");
                }}
              >

                <strong>
                  {option.label}
                </strong>

                <span>
                  ₹{option.price.toLocaleString("en-IN")}
                </span>

              </button>

            ))}

          </div>

          {/* CUSTOM AMOUNT */}

          <div className="custom-amount-box">

            <div>

              <span>
                Custom Amount
              </span>

            </div>

            <input
              type="number"
              min="250"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) =>
                handleCustomAmount(e.target.value)
              }
            />

          </div>

          {/* PURCHASE SUMMARY */}

          <div className="purchase-summary">

            <div>

              <span>
                PURCHASE AMOUNT
              </span>

              <strong>
                {displayCredits.toLocaleString("en-IN")} credits
              </strong>

            </div>

            <div className="purchase-price">

              <span>
                PRICE
              </span>

              <strong>
                ₹{displayPrice.toLocaleString("en-IN")}
              </strong>

            </div>

          </div>

          {/* PURCHASE BUTTON */}

          <button
            type="button"
            className="add-credits-button"
            onClick={handleAddCredits}
          >

            <FaPlus />

            Purchase{" "}
            {displayCredits.toLocaleString("en-IN")}{" "}
            Credits

          </button>

        </div>

      </div>

      {/* ======================================================
          TRANSACTION HISTORY
      ====================================================== */}

      <div className="transaction-panel">

        <div className="transaction-header">

          <div>

            <h2>
              <FaCalendarAlt />
              Transaction History
            </h2>

            <p>
              All your billing, plan subscriptions, and top-up
              transactions.
            </p>

          </div>

        </div>

        <div className="transaction-table-wrapper">

          {transactions.length === 0 ? (

            <div
              style={{
                padding: "50px 20px",
                textAlign: "center",
              }}
            >

              <FaCalendarAlt
                style={{
                  fontSize: "32px",
                  marginBottom: "12px",
                  opacity: 0.45,
                }}
              />

              <h3>
                No transactions yet
              </h3>

              <p>
                Your billing and credit transactions will appear
                here once credits are purchased or used.
              </p>

            </div>

          ) : (

            <table className="transaction-table">

              <thead>

                <tr>
                  <th>DATE &amp; TIME</th>
                  <th>TRANSACTION ID</th>
                  <th>TYPE / CALL REFERENCE</th>
                  <th>CREDITS TRANSACTION</th>
                  <th>REMAINING BALANCE</th>
                </tr>

              </thead>

              <tbody>

                {transactions.map((transaction) => (

                  <tr key={transaction.id}>

                    <td>

                      <div className="transaction-date">

                        <FaCalendarAlt />

                        {transaction.date}

                      </div>

                    </td>

                    <td>

                      <span className="transaction-id">
                        {transaction.id}
                      </span>

                    </td>

                    <td>

                      <div className="transaction-type">

                        <span>
                          {transaction.type}
                        </span>

                        <span className="transaction-reference">
                          {transaction.reference}
                        </span>

                      </div>

                    </td>

                    <td>

                      <span
                        className={
                          transaction.credits < 0
                            ? "credit-change negative"
                            : "credit-change"
                        }
                      >

                        {transaction.credits < 0
                          ? "↘ "
                          : "↗ "}

                        {transaction.credits}

                      </span>

                    </td>

                    <td>

                      <strong className="remaining-balance">
                        {transaction.balance} credits
                      </strong>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default BillingPage;
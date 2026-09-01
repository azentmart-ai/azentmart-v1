import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaCreditCard,
  FaChartLine,
  FaArrowUp,
  FaCheckCircle,
  FaCalendarAlt,
  FaSyncAlt,
} from "react-icons/fa";

import "./BillingPage.css";

// =====================================================
// API
// =====================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// BILLING PAGE
// =====================================================

function BillingPage() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [billing, setBilling] = useState(null);

  const [selectedCredits, setSelectedCredits] =
    useState(250);

  const [customAmount, setCustomAmount] =
    useState("");

  // =====================================================
  // CREDIT PACKAGES
  // =====================================================

  const packages = [
    {
      credits: 250,
      price: 250,
      label: "250",
      priceLabel: "₹250",
    },
    {
      credits: 1000,
      price: 1000,
      label: "1K",
      priceLabel: "₹1,000",
    },
    {
      credits: 5000,
      price: 5000,
      label: "5K",
      priceLabel: "₹5,000",
    },
    {
      credits: 10000,
      price: 10000,
      label: "10K",
      priceLabel: "₹10,000",
    },
  ];

  // =====================================================
  // LOAD RAZORPAY CHECKOUT
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      // Already loaded
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

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // FETCH BILLING DATA
  // =====================================================

  const fetchBilling = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        navigate("/agents/voice/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/billing`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        navigate("/agents/voice/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load billing data."
        );
      }

      const data = await response.json();

      setBilling(data);
    } catch (err) {
      console.error(
        "Billing fetch error:",
        err
      );

      setError(
        err.message ||
          "Unable to load billing data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchBilling();
  }, []);

  // =====================================================
  // SELECT PACKAGE
  // =====================================================

  const handlePackageSelect = (credits) => {
    setSelectedCredits(credits);
    setCustomAmount("");
    setError("");
    setSuccess("");
  };

  // =====================================================
  // CUSTOM AMOUNT
  // =====================================================

  const handleCustomAmount = (event) => {
    const value = event.target.value;

    if (
      value === "" ||
      /^\d+$/.test(value)
    ) {
      setCustomAmount(value);

      if (value) {
        setSelectedCredits(Number(value));
      }
    }
  };

  // =====================================================
  // PURCHASE WITH RAZORPAY
  // =====================================================

  const handlePurchase = async () => {
    try {
      setError("");
      setSuccess("");
      setPaymentLoading(true);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        navigate("/agents/voice/login");
        return;
      }

      const credits =
        Number(selectedCredits);

      // =================================================
      // VALIDATION
      // =================================================

      if (
        !Number.isInteger(credits) ||
        credits < 250
      ) {
        setError(
          "Minimum purchase is 250 credits."
        );

        setPaymentLoading(false);
        return;
      }

      // =================================================
      // LOAD RAZORPAY
      // =================================================

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is not available."
        );
      }

      // =================================================
      // CREATE RAZORPAY ORDER
      //
      // IMPORTANT:
      // Backend route is /api/razorpay/create-order
      // =================================================

      const orderResponse =
        await fetch(
          `${API_BASE_URL}/api/razorpay/create-order`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              credits: credits,
            }),
          }
        );

      // =================================================
      // HANDLE ORDER ERROR
      // =================================================

      if (!orderResponse.ok) {
        const errorData =
          await orderResponse
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Unable to create Razorpay order."
        );
      }

      const order =
        await orderResponse.json();

      console.log(
        "Razorpay order response:",
        order
      );

      // =================================================
      // VALIDATE BACKEND RESPONSE
      // =================================================

      if (!order.success) {
        throw new Error(
          "Razorpay order creation was not successful."
        );
      }

      // IMPORTANT:
      //
      // Backend returns:
      // keyId
      // orderId
      //
      // NOT:
      // key_id
      // order_id
      // =================================================

      const razorpayKey =
        order.keyId;

      const razorpayOrderId =
        order.orderId;

      const razorpayAmount =
        order.amount;

      const razorpayCurrency =
        order.currency || "INR";

      console.log(
        "Razorpay Key:",
        razorpayKey
      );

      console.log(
        "Razorpay Order ID:",
        razorpayOrderId
      );

      console.log(
        "Razorpay Amount:",
        razorpayAmount
      );

      // =================================================
      // FINAL VALIDATION
      // =================================================

      if (!razorpayKey) {
        throw new Error(
          "Razorpay Key ID was not returned by the backend."
        );
      }

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay Order ID was not returned by the backend."
        );
      }

      if (!razorpayAmount) {
        throw new Error(
          "Razorpay order amount was not returned by the backend."
        );
      }

      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {
        // IMPORTANT:
        // Backend sends keyId
        key: razorpayKey,

        // Backend sends amount
        amount: razorpayAmount,

        currency: razorpayCurrency,

        name: "AzentMart AI",

        description:
          `${credits} Voice Credits`,

        // IMPORTANT:
        // Backend sends orderId
        order_id: razorpayOrderId,

        prefill: {
          name:
            billing?.user?.name ||
            localStorage.getItem(
              "userName"
            ) ||
            "",

          email:
            billing?.user?.email ||
            localStorage.getItem(
              "userEmail"
            ) ||
            "",
        },

        notes: {
          credits: String(credits),
        },

        theme: {
          color: "#6c4cff",
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async function (
          razorpayResponse
        ) {
          try {
            setPaymentLoading(true);

            console.log(
              "Razorpay payment response:",
              razorpayResponse
            );

            // =================================================
            // VERIFY PAYMENT
            // =================================================

            const verifyResponse =
              await fetch(
                `${API_BASE_URL}/api/billing/verify-payment`,
                {
                  method: "POST",

                  headers: {
                    Authorization:
                      `Bearer ${token}`,

                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      razorpayResponse
                        .razorpay_order_id,

                    razorpay_payment_id:
                      razorpayResponse
                        .razorpay_payment_id,

                    razorpay_signature:
                      razorpayResponse
                        .razorpay_signature,

                    credits: credits,
                  }),
                }
              );

            const verifyData =
              await verifyResponse
                .json()
                .catch(() => null);

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData?.detail ||
                  "Payment verification failed."
              );
            }

            // =================================================
            // PAYMENT SUCCESS
            // =================================================

            setSuccess(
              `${credits} credits added successfully!`
            );

            await fetchBilling();
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setError(
              error.message ||
                "Payment verification failed."
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        // =================================================
        // MODAL CLOSED
        // =================================================

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      const razorpay =
        new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaymentLoading(false);
        }
      );

      // =================================================
      // OPEN CHECKOUT
      // =================================================

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay error:",
        error
      );

      setError(
        error.message ||
          "Unable to start payment."
      );

      setPaymentLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="billing-page">
        <div className="billing-loading">
          Loading billing...
        </div>
      </div>
    );
  }

  // =====================================================
  // BILLING DATA
  // =====================================================

  const credits =
    billing?.credits || {};

  const transactions =
    billing?.transactions || [];

  const purchaseAmount =
    Number(selectedCredits) || 0;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="billing-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="billing-header">

        <div>
          <div className="billing-eyebrow">
            ACCOUNT BILLING
          </div>

          <h1>
            Billing & Credits
          </h1>

          <p>
            Monitor call transactions,
            balances, and load top-up
            calling credits.
          </p>
        </div>

        <button
          className="billing-refresh"
          type="button"
          onClick={fetchBilling}
        >
          <FaSyncAlt />
          Refresh
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="billing-message billing-error">
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className="billing-message billing-success">
          <FaCheckCircle />
          {success}
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="billing-summary">

        <div className="billing-stat">

          <div className="billing-stat-icon">
            <FaCreditCard />
          </div>

          <div>
            <span>
              Current Balance
            </span>

            <strong>
              {credits.balance || 0}
            </strong>

            <small>
              credits
            </small>
          </div>

        </div>

        <div className="billing-stat">

          <div className="billing-stat-icon">
            <FaChartLine />
          </div>

          <div>
            <span>
              Total Credits Used
            </span>

            <strong>
              {credits.total_used || 0}
            </strong>

            <small>
              credits
            </small>
          </div>

        </div>

        <div className="billing-stat">

          <div className="billing-stat-icon">
            <FaArrowUp />
          </div>

          <div>
            <span>
              Total Credits Purchased
            </span>

            <strong>
              {credits.total_purchased || 0}
            </strong>

            <small>
              credits
            </small>
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN BILLING GRID
      ================================================= */}

      <div className="billing-main-grid">

        {/* =================================================
            PAY AS YOU GO
        ================================================= */}

        <section className="billing-card">

          <h2>
            Pay-As-You-Go Credits
          </h2>

          <p>
            AzentmartAI uses a simple
            usage credit balance to fund
            phone conversations managed
            by your AI Voice Agents.
          </p>

          <div className="rate-box">

            <div className="rate-icon">
              <FaCheckCircle />
            </div>

            <div>

              <strong>
                Rate Structure
              </strong>

              <span>
                Each credit corresponds to
                exactly ₹1.00. Credits are
                deducted continuously per
                second of call connection
                time based on your agent's
                active model rates.
              </span>

            </div>

          </div>

          <p className="billing-note">
            Credits do not expire as long
            as your account remains in
            good standing. You can add
            credits manually at any time
            using a supported payment
            method.
          </p>

        </section>

        {/* =================================================
            ADD BALANCE
        ================================================= */}

        <section className="billing-card purchase-card">

          <h2>
            <FaCreditCard />
            Add Balance (Credits)
          </h2>

          <p>
            Buy credits to fund voice
            calls. Minimum top-up is
            250 credits (₹250).
          </p>

          {/* =================================================
              PACKAGES
          ================================================= */}

          <div className="credit-packages">

            {packages.map((item) => (
              <button
                key={item.credits}
                type="button"
                className={
                  selectedCredits ===
                    item.credits &&
                  !customAmount
                    ? "credit-package selected"
                    : "credit-package"
                }
                onClick={() =>
                  handlePackageSelect(
                    item.credits
                  )
                }
              >

                <strong>
                  {item.label}
                </strong>

                <span>
                  {item.priceLabel}
                </span>

              </button>
            ))}

          </div>

          {/* =================================================
              CUSTOM AMOUNT
          ================================================= */}

          <div className="custom-amount">

            <span>
              Custom Amount
            </span>

            <input
              type="number"
              min="250"
              placeholder="Enter amount"
              value={customAmount}
              onChange={
                handleCustomAmount
              }
            />

          </div>

          {/* =================================================
              PURCHASE SUMMARY
          ================================================= */}

          <div className="purchase-summary">

            <div>

              <span>
                PURCHASE AMOUNT
              </span>

              <strong>
                {purchaseAmount} credits
              </strong>

            </div>

            <div className="purchase-price">

              <span>
                PRICE
              </span>

              <strong>
                ₹{purchaseAmount}
              </strong>

            </div>

          </div>

          {/* =================================================
              RAZORPAY BUTTON
          ================================================= */}

          <button
            type="button"
            className="purchase-button"
            onClick={handlePurchase}
            disabled={paymentLoading}
          >

            {paymentLoading ? (
              "Opening Razorpay..."
            ) : (
              <>
                <FaCreditCard />
                Purchase {purchaseAmount} Credits
              </>
            )}

          </button>

        </section>

      </div>

      {/* =================================================
          TRANSACTION HISTORY
      ================================================= */}

      <section className="transactions-card">

        <div className="transactions-header">

          <div>

            <h2>
              <FaCalendarAlt />
              Transaction History
            </h2>

            <p>
              All your billing, plan
              subscriptions, and top-up
              transactions.
            </p>

          </div>

        </div>

        {transactions.length === 0 ? (

          <div className="no-transactions">

            <FaCalendarAlt />

            <strong>
              No transactions yet
            </strong>

            <span>
              Your billing and credit
              transactions will appear
              here once credits are
              purchased or used.
            </span>

          </div>

        ) : (

          <div className="transaction-list">

            {transactions.map(
              (transaction) => (

                <div
                  className="transaction-row"
                  key={transaction.id}
                >

                  <span>
                    {transaction.date}
                  </span>

                  <span>
                    {transaction.type}
                  </span>

                  <span>
                    {transaction.reference}
                  </span>

                  <strong>
                    {transaction.credits}
                  </strong>

                  <span>
                    {transaction.balance}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default BillingPage;
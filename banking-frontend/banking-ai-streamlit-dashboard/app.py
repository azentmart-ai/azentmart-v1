
import streamlit as st
from datetime import datetime
import pandas as pd

# =========================================================
# CONFIG
# =========================================================
st.set_page_config(
    page_title="NexaBank AI",
    page_icon="◈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =========================================================
# STATE
# =========================================================
if "page" not in st.session_state:
    st.session_state.page = "Overview"

if "balance" not in st.session_state:
    st.session_state.balance = 75000.00

if "messages" not in st.session_state:
    st.session_state.messages = [
        ("ai", "Good afternoon, Tanaya. I'm Nexa, your banking AI assistant."),
        ("ai", "I can help with your balance, transactions, transfers, loans and account security."),
    ]

if "transfer_done" not in st.session_state:
    st.session_state.transfer_done = False

if "toast" not in st.session_state:
    st.session_state.toast = ""

transactions = [
    ["Today", "Salary Credit", "Credit", 50000, "Completed"],
    ["Yesterday", "Amazon", "Debit", -2499, "Completed"],
    ["28 Sep", "Electricity Bill", "Debit", -1850, "Completed"],
    ["26 Sep", "Swiggy", "Debit", -620, "Completed"],
    ["24 Sep", "UPI Transfer", "Debit", -1500, "Completed"],
]

beneficiaries = [
    ["John Smith", "HDFC Bank", "•••• 4821"],
    ["Rahul Patil", "SBI", "•••• 9150"],
    ["Sneha Kulkarni", "ICICI Bank", "•••• 3022"],
]

# =========================================================
# PREMIUM CSS
# =========================================================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');

:root {
    --navy: #07111f;
    --navy2: #0b192b;
    --blue: #3478f6;
    --blue2: #5b93ff;
    --text: #172033;
    --muted: #7b879b;
    --line: #e8edf4;
    --bg: #f5f7fb;
    --card: #ffffff;
    --green: #15a46d;
    --red: #e25555;
}

* { font-family: 'DM Sans', sans-serif; }

.stApp {
    background: var(--bg);
}

#MainMenu, footer, header { visibility: hidden; }

.block-container {
    max-width: 1480px;
    padding: 28px 34px 40px 34px;
}

/* SIDEBAR */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #07111f 0%, #09182a 100%);
    border-right: 1px solid rgba(255,255,255,.05);
}

section[data-testid="stSidebar"] > div {
    padding: 25px 16px;
}

.brand {
    display:flex;
    align-items:center;
    gap:12px;
    padding: 3px 10px 32px;
}

.brand-mark {
    width:42px;
    height:42px;
    border-radius:13px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:white;
    font-family:Manrope;
    font-weight:800;
    font-size:20px;
    background:linear-gradient(145deg,#4285ff,#245ed8);
    box-shadow:0 10px 25px rgba(52,120,246,.25);
}

.brand-name {
    color:#fff;
    font-family:Manrope;
    font-size:17px;
    font-weight:800;
    letter-spacing:-.3px;
}

.brand-tag {
    color:#7587a2;
    font-size:10px;
    margin-top:2px;
}

.nav-label {
    color:#5f708a;
    font-size:9px;
    font-weight:700;
    letter-spacing:1.5px;
    margin:0 10px 8px;
    text-transform:uppercase;
}

section[data-testid="stSidebar"] .stButton > button {
    border:0 !important;
    background:transparent !important;
    color:#91a0b6 !important;
    height:43px !important;
    text-align:left !important;
    border-radius:10px !important;
    font-size:12px !important;
    font-weight:600 !important;
    padding-left:14px !important;
    margin:2px 0 !important;
    box-shadow:none !important;
}

section[data-testid="stSidebar"] .stButton > button:hover {
    background:#11233c !important;
    color:#fff !important;
}

.side-footer {
    margin:40px 5px 0;
    padding:14px;
    border:1px solid rgba(255,255,255,.07);
    border-radius:13px;
    background:rgba(255,255,255,.025);
}

.side-footer .online {
    color:#42d69a;
    font-size:11px;
    font-weight:700;
}

.side-footer .server {
    color:#61728b;
    font-size:9px;
    margin-top:5px;
}

/* TOP HEADER */
.topbar {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:27px;
}

.eyebrow {
    color:#8a96a9;
    font-size:11px;
    font-weight:600;
    margin-bottom:4px;
}

.page-title {
    color:var(--text);
    font-family:Manrope;
    font-size:27px;
    font-weight:800;
    letter-spacing:-.8px;
}

.page-subtitle {
    color:var(--muted);
    font-size:12px;
    margin-top:4px;
}

.profile {
    display:flex;
    align-items:center;
    gap:10px;
}

.avatar {
    width:39px;
    height:39px;
    border-radius:50%;
    background:#dce8ff;
    color:#2868e7;
    display:flex;
    justify-content:center;
    align-items:center;
    font-weight:800;
}

.profile-name {
    color:#263146;
    font-size:12px;
    font-weight:700;
}

.profile-role {
    color:#909bad;
    font-size:9px;
}

/* HERO */
.hero {
    background:linear-gradient(125deg,#0b1b31 0%,#102b4d 56%,#164d8d 100%);
    border-radius:20px;
    min-height:205px;
    padding:27px 30px;
    position:relative;
    overflow:hidden;
    box-shadow:0 16px 35px rgba(8,26,50,.12);
}

.hero:after {
    content:"";
    position:absolute;
    width:290px;
    height:290px;
    border:1px solid rgba(255,255,255,.07);
    border-radius:50%;
    right:-70px;
    top:-90px;
}

.hero-label {
    color:#92b7ee;
    font-size:10px;
    font-weight:700;
    letter-spacing:1.1px;
    text-transform:uppercase;
}

.hero-balance {
    color:white;
    font-family:Manrope;
    font-size:35px;
    font-weight:800;
    margin-top:8px;
    letter-spacing:-1px;
}

.hero-account {
    color:#9bb0ca;
    font-size:10px;
    margin-top:4px;
}

.hero-actions {
    position:absolute;
    right:28px;
    bottom:28px;
}

.hero-chip {
    display:inline-block;
    border:1px solid rgba(255,255,255,.13);
    color:#dce8f8;
    background:rgba(255,255,255,.06);
    padding:8px 12px;
    border-radius:9px;
    font-size:10px;
    margin-left:5px;
}

/* METRICS */
.metric {
    background:white;
    border:1px solid var(--line);
    border-radius:16px;
    padding:18px 19px;
    min-height:112px;
    box-shadow:0 4px 18px rgba(25,42,70,.035);
}

.metric-top {
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.metric-label {
    color:#8290a4;
    font-size:10px;
    font-weight:600;
}

.metric-icon {
    width:29px;
    height:29px;
    border-radius:9px;
    background:#edf4ff;
    color:#3274ed;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:14px;
}

.metric-value {
    color:#162136;
    font-family:Manrope;
    font-size:22px;
    font-weight:800;
    margin-top:11px;
}

.metric-foot {
    color:#8793a6;
    font-size:9px;
    margin-top:5px;
}

.up { color:#159c68; font-weight:700; }

/* CARDS */
.card {
    background:white;
    border:1px solid var(--line);
    border-radius:17px;
    padding:21px;
    box-shadow:0 4px 18px rgba(25,42,70,.035);
}

.card-head {
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:17px;
}

.card-title {
    color:#172136;
    font-family:Manrope;
    font-size:14px;
    font-weight:800;
}

.card-desc {
    color:#8994a7;
    font-size:10px;
    margin-top:4px;
}

.link {
    color:#3478f6;
    font-size:10px;
    font-weight:700;
}

/* QUICK ACTION */
.action {
    display:flex;
    align-items:center;
    gap:12px;
    padding:12px 4px;
    border-bottom:1px solid #eef1f5;
}

.action:last-child { border-bottom:0; }

.action-icon {
    width:35px;
    height:35px;
    border-radius:10px;
    background:#edf4ff;
    color:#3478f6;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
}

.action-title {
    color:#1b273b;
    font-size:11px;
    font-weight:700;
}

.action-desc {
    color:#8b96a8;
    font-size:9px;
    margin-top:2px;
}

/* TRANSACTIONS */
.tx {
    display:grid;
    grid-template-columns: 1.7fr .8fr .8fr;
    align-items:center;
    padding:13px 0;
    border-bottom:1px solid #edf0f4;
}

.tx:last-child { border-bottom:0; }

.tx-name {
    color:#263248;
    font-size:11px;
    font-weight:700;
}

.tx-date {
    color:#9aa4b4;
    font-size:9px;
    margin-top:3px;
}

.tx-type {
    color:#8995a7;
    font-size:9px;
}

.tx-amount {
    text-align:right;
    font-size:11px;
    font-weight:800;
}

.credit { color:#159c68; }
.debit { color:#263248; }

/* SECURITY */
.security {
    padding:14px;
    border-radius:12px;
    background:#f5fbf8;
    border:1px solid #d9f1e6;
}

.security-title {
    color:#159c68;
    font-size:11px;
    font-weight:800;
}

.security-text {
    color:#708c7e;
    font-size:9px;
    margin-top:4px;
}

/* CHAT */
.chat-panel {
    background:white;
    border:1px solid var(--line);
    border-radius:17px;
    padding:20px;
}

.chat-window {
    min-height:340px;
    max-height:390px;
    overflow-y:auto;
    padding:5px 0 10px;
}

.msg {
    display:flex;
    margin:9px 0;
}

.msg.ai { justify-content:flex-start; }
.msg.user { justify-content:flex-end; }

.bubble {
    max-width:78%;
    padding:10px 13px;
    border-radius:12px;
    font-size:11px;
    line-height:1.5;
}

.bubble.ai {
    background:#f0f4f8;
    color:#35445a;
    border-bottom-left-radius:4px;
}

.bubble.user {
    background:#3478f6;
    color:#fff;
    border-bottom-right-radius:4px;
}

/* FORMS */
.stTextInput input, .stNumberInput input, .stSelectbox div[data-baseweb="select"] {
    border-radius:10px !important;
    border-color:#e0e6ef !important;
    font-size:11px !important;
}

.stButton > button {
    border-radius:10px !important;
    border:1px solid #dce3ec !important;
    background:#fff !important;
    color:#29364a !important;
    font-size:11px !important;
    font-weight:700 !important;
    min-height:37px !important;
}

.stButton > button:hover {
    border-color:#3478f6 !important;
    color:#3478f6 !important;
}

.primary-btn .stButton > button {
    background:#3478f6 !important;
    color:white !important;
    border-color:#3478f6 !important;
}

[data-testid="stMetricValue"] {
    font-family:Manrope !important;
}

div[data-testid="stDataFrame"] {
    border-radius:12px;
    overflow:hidden;
}

/* CHAT INPUT */
[data-testid="stChatInput"] {
    border-radius:12px !important;
}

[data-testid="stChatInput"] textarea {
    font-size:11px !important;
}

/* RESPONSIVE */
@media (max-width: 900px) {
    .block-container { padding:20px 15px; }
    .hero { min-height:220px; }
    .hero-actions { position:static; margin-top:20px; }
    .hero-chip { margin-left:0; margin-right:5px; }
}
</style>
""", unsafe_allow_html=True)

# =========================================================
# SIDEBAR
# =========================================================
with st.sidebar:
    st.markdown("""
    <div class="brand">
        <div class="brand-mark">N</div>
        <div>
            <div class="brand-name">NexaBank AI</div>
            <div class="brand-tag">Intelligent Banking Platform</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div class="nav-label">Workspace</div>', unsafe_allow_html=True)

    nav = [
        ("◉", "Overview"),
        ("▣", "Accounts"),
        ("↔", "Transfers"),
        ("◌", "Transactions"),
        ("♙", "Beneficiaries"),
        ("⌂", "Loans"),
    ]

    for icon, label in nav:
        if st.button(f"{icon}   {label}", key=f"nav_{label}", use_container_width=True):
            st.session_state.page = label
            st.rerun()

    st.markdown('<div class="nav-label" style="margin-top:22px;">Security</div>', unsafe_allow_html=True)

    for icon, label in [("◈", "Fraud & Risk"), ("▤", "Statements"), ("◫", "Audit Logs")]:
        if st.button(f"{icon}   {label}", key=f"nav_{label}", use_container_width=True):
            st.session_state.page = label
            st.rerun()

    st.markdown("""
    <div class="side-footer">
        <div class="online">● System online</div>
        <div class="server">AI services connected · Secure session</div>
    </div>
    """, unsafe_allow_html=True)

# =========================================================
# HEADER
# =========================================================
page = st.session_state.page

titles = {
    "Overview": ("Good afternoon, Tanaya", "Here is your financial overview for today."),
    "Accounts": ("Accounts", "View and manage your connected banking accounts."),
    "Transfers": ("Money Transfer", "Send money securely to a saved beneficiary."),
    "Transactions": ("Transactions", "Review your recent account activity."),
    "Beneficiaries": ("Beneficiaries", "Manage people and accounts you can transfer to."),
    "Loans": ("Loans", "Track repayments and active borrowing."),
    "Fraud & Risk": ("Fraud & Risk", "Monitor account security and unusual activity."),
    "Statements": ("Statements", "View or download your account statements."),
    "Audit Logs": ("Audit Logs", "Review security-sensitive actions on your account."),
}

title, subtitle = titles.get(page, titles["Overview"])

st.markdown(f"""
<div class="topbar">
    <div>
        <div class="eyebrow">PERSONAL BANKING · AI WORKSPACE</div>
        <div class="page-title">{title}</div>
        <div class="page-subtitle">{subtitle}</div>
    </div>
    <div class="profile">
        <div>
            <div class="profile-name">Tanaya</div>
            <div class="profile-role">Premium account</div>
        </div>
        <div class="avatar">T</div>
    </div>
</div>
""", unsafe_allow_html=True)

# =========================================================
# OVERVIEW
# =========================================================
if page == "Overview":

    st.markdown(f"""
    <div class="hero">
        <div class="hero-label">Total available balance</div>
        <div class="hero-balance">₹{st.session_state.balance:,.2f}</div>
        <div class="hero-account">Primary Savings · •••• 0001</div>
        <div class="hero-actions">
            <span class="hero-chip">✓ Account verified</span>
            <span class="hero-chip">↗ +4.8% this month</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.write("")
    m1, m2, m3, m4 = st.columns(4)

    metrics = [
        ("Monthly income", "₹50,000", "↗ 8.2% vs last month", "↗"),
        ("Monthly spending", "₹18,640", "62% of your budget", "↓"),
        ("Active loan", "₹1,20,000", "Next EMI · ₹8,500", "⌂"),
        ("Security", "Protected", "MFA + device verified", "✓"),
    ]

    for col, (lab, val, foot, icon) in zip([m1,m2,m3,m4], metrics):
        with col:
            cls = "up" if "income" in lab.lower() else ""
            st.markdown(f"""
            <div class="metric">
                <div class="metric-top">
                    <div class="metric-label">{lab}</div>
                    <div class="metric-icon">{icon}</div>
                </div>
                <div class="metric-value {cls}">{val}</div>
                <div class="metric-foot">{foot}</div>
            </div>
            """, unsafe_allow_html=True)

    st.write("")

    left, right = st.columns([1.65, 1])

    with left:
        st.markdown("""
        <div class="card">
            <div class="card-head">
                <div>
                    <div class="card-title">Recent transactions</div>
                    <div class="card-desc">Your latest account activity</div>
                </div>
                <div class="link">View all →</div>
            </div>
        """, unsafe_allow_html=True)

        for date, name, typ, amount, status in transactions[:4]:
            amount_text = f"+₹{amount:,.0f}" if amount > 0 else f"−₹{abs(amount):,.0f}"
            amount_class = "credit" if amount > 0 else "debit"
            st.markdown(f"""
            <div class="tx">
                <div>
                    <div class="tx-name">{name}</div>
                    <div class="tx-date">{date} · {status}</div>
                </div>
                <div class="tx-type">{typ}</div>
                <div class="tx-amount {amount_class}">{amount_text}</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

    with right:
        st.markdown("""
        <div class="card">
            <div class="card-head">
                <div>
                    <div class="card-title">Quick actions</div>
                    <div class="card-desc">Frequently used services</div>
                </div>
            </div>
        """, unsafe_allow_html=True)

        quick = [
            ("↔", "Transfer money", "Send money to a beneficiary"),
            ("▣", "View accounts", "Balances and account details"),
            ("⌂", "Manage loans", "EMI and repayment details"),
            ("▤", "Statements", "Download monthly statement"),
        ]

        for icon, name, desc in quick:
            st.markdown(f"""
            <div class="action">
                <div class="action-icon">{icon}</div>
                <div>
                    <div class="action-title">{name}</div>
                    <div class="action-desc">{desc}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

    st.write("")

    chat_left, security_right = st.columns([1.65, 1])

    with chat_left:
        st.markdown("""
        <div class="chat-panel">
            <div class="card-head">
                <div>
                    <div class="card-title">Nexa · Banking AI</div>
                    <div class="card-desc">Ask questions in natural language</div>
                </div>
                <div class="security-title">● Online</div>
            </div>
        """, unsafe_allow_html=True)

        st.markdown('<div class="chat-window">', unsafe_allow_html=True)
        for role, msg in st.session_state.messages[-6:]:
            role_class = "user" if role == "user" else "ai"
            st.markdown(
                f'<div class="msg {role_class}"><div class="bubble {role_class}">{msg}</div></div>',
                unsafe_allow_html=True
            )
        st.markdown('</div>', unsafe_allow_html=True)

        prompt = st.chat_input("Ask Nexa: “What is my balance?”")

        if prompt:
            st.session_state.messages.append(("user", prompt))
            p = prompt.lower()

            if "balance" in p:
                reply = f"Your current available balance is ₹{st.session_state.balance:,.2f}."
            elif "transaction" in p:
                reply = "You have 5 recent transactions. Your latest credit was the salary deposit of ₹50,000."
            elif "loan" in p:
                reply = "You have one active loan with an outstanding balance of ₹1,20,000. Your next EMI is ₹8,500."
            elif "transfer" in p:
                reply = "I can prepare a transfer, but a real transaction should require beneficiary verification and authentication before completion."
            elif "security" in p or "fraud" in p:
                reply = "Your account is currently protected with MFA and device verification. No suspicious activity is shown in this demo."
            else:
                reply = "I can help with balances, transactions, transfers, beneficiaries, loans, statements and security."

            st.session_state.messages.append(("ai", reply))
            st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)

    with security_right:
        st.markdown("""
        <div class="card">
            <div class="card-head">
                <div>
                    <div class="card-title">Security center</div>
                    <div class="card-desc">Your account protection</div>
                </div>
            </div>

            <div class="security">
                <div class="security-title">✓ Account protected</div>
                <div class="security-text">No suspicious activity detected in the current session.</div>
            </div>
            <br>
        """, unsafe_allow_html=True)

        for item, status in [
            ("Multi-factor authentication", "Enabled"),
            ("Trusted device", "Verified"),
            ("Transaction alerts", "Enabled"),
            ("Last login", "Today · 3:42 PM"),
        ]:
            st.markdown(f"""
            <div class="tx">
                <div class="tx-name">{item}</div>
                <div></div>
                <div class="tx-amount credit">{status}</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

# =========================================================
# ACCOUNTS
# =========================================================
elif page == "Accounts":
    st.markdown("""
    <div class="card">
        <div class="card-head">
            <div>
                <div class="card-title">Your accounts</div>
                <div class="card-desc">All accounts connected to this banking workspace</div>
            </div>
        </div>
    """, unsafe_allow_html=True)

    account_df = pd.DataFrame([
        ["Primary Savings", "Savings", "•••• 0001", "₹75,000.00", "Active"],
        ["Daily Current", "Current", "•••• 4812", "₹24,500.00", "Active"],
    ], columns=["Account", "Type", "Number", "Available balance", "Status"])

    st.dataframe(account_df, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

# =========================================================
# TRANSFERS
# =========================================================
elif page == "Transfers":
    a, b = st.columns([1.35, .9])

    with a:
        st.markdown("""
        <div class="card">
            <div class="card-head">
                <div>
                    <div class="card-title">Create transfer</div>
                    <div class="card-desc">Transfers are protected by beneficiary verification.</div>
                </div>
            </div>
        """, unsafe_allow_html=True)

        beneficiary = st.selectbox("Send to", [x[0] for x in beneficiaries])
        amount = st.number_input("Amount", min_value=1.0, max_value=75000.0, value=5000.0, step=500.0)
        note = st.text_input("Reference / note", placeholder="e.g. Project payment")

        if st.button("Review secure transfer", use_container_width=True):
            st.session_state.transfer_done = True

        if st.session_state.transfer_done:
            st.success(f"Transfer of ₹{amount:,.2f} to {beneficiary} is ready for verification.")
            if st.button("Confirm demo transfer", use_container_width=True):
                st.session_state.balance -= amount
                st.session_state.transfer_done = False
                st.session_state.messages.append(("ai", f"Demo transfer of ₹{amount:,.2f} to {beneficiary} completed."))
                st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)

    with b:
        st.markdown("""
        <div class="card">
            <div class="card-title">Transfer security</div>
            <div class="card-desc">Before a real transfer is completed</div>
            <br>
            <div class="security">
                <div class="security-title">✓ Beneficiary verified</div>
                <div class="security-text">Saved recipients are checked before transfer.</div>
            </div>
            <br>
            <div class="security">
                <div class="security-title">✓ Authentication required</div>
                <div class="security-text">A production banking flow should require MFA/OTP.</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

# =========================================================
# TRANSACTIONS
# =========================================================
elif page == "Transactions":
    st.markdown("""
    <div class="card">
        <div class="card-head">
            <div>
                <div class="card-title">Transaction history</div>
                <div class="card-desc">Recent debits and credits</div>
            </div>
        </div>
    """, unsafe_allow_html=True)

    df = pd.DataFrame(transactions, columns=["Date", "Description", "Type", "Amount", "Status"])
    df["Amount"] = df["Amount"].apply(lambda x: f"₹{abs(x):,.2f}")
    st.dataframe(df, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

# =========================================================
# BENEFICIARIES
# =========================================================
elif page == "Beneficiaries":
    st.markdown("""
    <div class="card">
        <div class="card-head">
            <div>
                <div class="card-title">Saved beneficiaries</div>
                <div class="card-desc">Recipients available for secure transfers</div>
            </div>
        </div>
    """, unsafe_allow_html=True)

    bdf = pd.DataFrame(beneficiaries, columns=["Name", "Bank", "Account"])
    st.dataframe(bdf, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

# =========================================================
# LOANS
# =========================================================
elif page == "Loans":
    a, b, c = st.columns(3)
    with a:
        st.markdown('<div class="metric"><div class="metric-label">Outstanding</div><div class="metric-value">₹1,20,000</div><div class="metric-foot">Personal loan</div></div>', unsafe_allow_html=True)
    with b:
        st.markdown('<div class="metric"><div class="metric-label">Next EMI</div><div class="metric-value">₹8,500</div><div class="metric-foot">Due 10 Oct 2026</div></div>', unsafe_allow_html=True)
    with c:
        st.markdown('<div class="metric"><div class="metric-label">Repaid</div><div class="metric-value">62%</div><div class="metric-foot">On schedule</div></div>', unsafe_allow_html=True)

    st.write("")
    st.markdown("""
    <div class="card">
        <div class="card-title">Repayment progress</div>
        <div class="card-desc">Personal loan · 18 of 30 installments completed</div>
        <br>
    """, unsafe_allow_html=True)
    st.progress(0.62)
    st.caption("18 / 30 installments completed")
    st.markdown("</div>", unsafe_allow_html=True)

# =========================================================
# SECURITY
# =========================================================
elif page == "Fraud & Risk":
    st.markdown("""
    <div class="card">
        <div class="card-head">
            <div>
                <div class="card-title">Security overview</div>
                <div class="card-desc">Continuous monitoring for suspicious activity</div>
            </div>
        </div>
        <div class="security">
            <div class="security-title">✓ Low risk · No suspicious activity</div>
            <div class="security-text">Your current session and recent transactions are marked as normal in this demo.</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# =========================================================
# STATEMENTS
# =========================================================
elif page == "Statements":
    st.markdown("""
    <div class="card">
        <div class="card-title">Statements</div>
        <div class="card-desc">Generate or download your account statement.</div>
        <br>
    """, unsafe_allow_html=True)

    statement = """NEXABANK AI — ACCOUNT STATEMENT
Account: Primary Savings •••• 0001
Period: September 2026

Opening balance: ₹47,219.00
Credits: ₹50,000.00
Debits: ₹22,219.00
Closing balance: ₹75,000.00

This document is a demo statement generated for an educational project.
"""
    st.download_button(
        "Download September statement",
        statement,
        file_name="nexabank_september_2026.txt",
        use_container_width=True
    )
    st.markdown("</div>", unsafe_allow_html=True)

# =========================================================
# AUDIT
# =========================================================
elif page == "Audit Logs":
    audit = pd.DataFrame([
        ["03 Oct 2026 · 15:42", "Login", "Successful", "Trusted device"],
        ["03 Oct 2026 · 15:31", "Balance inquiry", "Successful", "AI Assistant"],
        ["03 Oct 2026 · 14:58", "Beneficiary verification", "Successful", "MFA"],
        ["02 Oct 2026 · 19:12", "Statement generated", "Successful", "Web"],
    ], columns=["Time", "Action", "Result", "Channel"])

    st.markdown("""
    <div class="card">
        <div class="card-title">Audit activity</div>
        <div class="card-desc">Security-sensitive activity in your banking workspace.</div>
        <br>
    """, unsafe_allow_html=True)
    st.dataframe(audit, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

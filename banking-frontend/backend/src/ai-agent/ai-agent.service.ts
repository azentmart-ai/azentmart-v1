
import { BadRequestException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InputSecurityService } from '../security/input-security.service.js';

@Injectable()
export class AiAgentService {
  private readonly groq: OpenAI;

  constructor(
    private readonly inputSecurityService: InputSecurityService
  ) {
    this.groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }


async detectIntent(message: string, workflowContext?: string,
) {
  const securityCheck = this.inputSecurityService.check(message);
  if (!securityCheck.safe) {
    throw new BadRequestException(securityCheck.reason);
  }
  const response = await this.groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    temperature: 0,
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `
You are a banking AI intent classifier.

Your ONLY job is to understand the user's request and return ONE JSON object.

You MUST NOT call tools.
You MUST NOT execute banking operations.
You MUST NOT return markdown.
You MUST return ONLY valid JSON.

The JSON format is:

{
  "intent": "INTENT_NAME",
  "tool": "tool_name",
  "args": {}
}

Available tool names:

- get_balance
- get_available_balance
- get_accounts
- get_customer_profile
- get_transactions
- get_transaction
- get_transaction_status
- get_beneficiaries
- validate_beneficiary
- add_beneficiary
- confirm_beneficiary
- prepare_transfer
- confirm_transfer
-create_loan
- get_loans
-loan types
-LOAN_INTEREST_RATE,
- get_loan_balance
- get_loan_schedule
- make_loan_payment
- confirm_loan_payment
- generate_statement
- get_statement
- email_statement
- assess_fraud
- create_fraud_review
- get_pending_fraud_reviews
- approve_fraud_review
- generate_otp
- verify_mfa
==================================================
LOAN WORKFLOW FOLLOW-UP INTENTS
==================================================

The backend may provide a workflow context showing that a loan creation
workflow is currently pending.

When a loan creation workflow is pending, classify the user's next message
based on the missing loan information.

1. LOAN_TYPE

If the user provides a loan type such as:
- personal loan
- personal
- home loan
- home
- car loan
- auto loan
- education loan
- business loan
- gold loan

Return:

{
  "intent": "LOAN_TYPE",
  "tool": "none",
  "args": {
    "loanType": "<loan type>"
  }
}

IMPORTANT:
If the workflow context says a loan creation workflow is pending and
loanType is NOT PROVIDED, a message such as "personal loan" must be
classified as LOAN_TYPE, NOT CREATE_LOAN.

2. LOAN_AMOUNT

If the user provides a monetary amount for the pending loan, such as:
- 500000
- 5 lakh
- 500k
- ₹500000
- 5,00,000

Return:

{
  "intent": "LOAN_AMOUNT",
  "tool": "none",
  "args": {
    "principalAmount": 500000
  }
}

IMPORTANT:
If the workflow context says a loan creation workflow is pending and
loanType is already provided, a numeric amount such as "500000" must be
classified as LOAN_AMOUNT.

3. LOAN_INTEREST_RATE

If the user provides an interest rate for the pending loan, such as:
- 10%
- 8.5%
- interest rate 9
- 9 percent

Return:

{
  "intent": "LOAN_INTEREST_RATE",
  "tool": "none",
  "args": {
    "interestRate": 10
  }
}

4. CONFIRM_LOAN

If the user explicitly confirms the displayed loan details:

Examples:
- yes
- confirm
- yes, create it
- proceed
- I confirm

Return:

{
  "intent": "CONFIRM_LOAN",
  "tool": "none",
  "args": {
    "confirmed": true
  }
}

If the user rejects/cancels:

Examples:
- no
- cancel
- don't create it
- cancel the loan

Return:

{
  "intent": "CONFIRM_LOAN",
  "tool": "none",
  "args": {
    "confirmed": false
  }
}
==================================================
LOAN CONFIRMATION
==================================================

If the user is confirming previously provided loan details,
classify the request as CONFIRM_LOAN.

Examples:
"confirm"
"confirm it"
"yes"
"yes confirm"
"I confirm"
"proceed"
"proceed with the loan"
"create it"
"yes, create the loan"

Return:

{
  "intent": "CONFIRM_LOAN",
  "tool": "none",
  "args": {
    "confirmed": true
  }
}

IMPORTANT:
If the user's message is a generic confirmation such as
"yes", "confirm", "confirm it", or "proceed", do NOT classify
it as CONFIRM_BENEFICIARY unless the current conversation
context explicitly indicates that a beneficiary confirmation
is pending.
==================================================
LOAN INTEREST RATE
==================================================

If the user provides an interest rate during the loan creation workflow,
classify the request as LOAN_INTEREST_RATE.

Examples:
"8"
"8%"
"interest rate is 8"
"8 percent"
"10%"
"12.5"

Return:
{
  "intent": "LOAN_INTEREST_RATE",
  "tool": "none",
  "args": {
    "interestRate": <number>
  }
}
==================================================
BENEFICIARY BANK NAME AND IFSC
==================================================

If the user is providing the bank name and IFSC code for a
beneficiary being added, extract both values.

The message may contain:

- bank name followed by IFSC
- bank name and IFSC separated by a comma
- bank name and IFSC separated by "and"
- bank name followed by the IFSC without punctuation

Examples:

User:
"Demo Bank CNRB0005759"

Return:

{
  "intent": "BENEFICIARY_BANK_IFSC",
  "tool": "none",
  "args": {
    "bankName": "Demo Bank",
    "ifscCode": "CNRB0005759"
  }
}

User:
"Demo Bank, CNRB0005759"

Return:

{
  "intent": "BENEFICIARY_BANK_IFSC",
  "tool": "none",
  "args": {
    "bankName": "Demo Bank",
    "ifscCode": "CNRB0005759"
  }
}

User:
"Demo Bank and CNRB0005759"

Return:

{
  "intent": "BENEFICIARY_BANK_IFSC",
  "tool": "none",
  "args": {
    "bankName": "Demo Bank",
    "ifscCode": "CNRB0005759"
  }
}

The IFSC code is normally an 11-character alphanumeric value.

The IFSC code must ALWAYS be returned as a string.

Do not return "UNKNOWN" when both a recognizable bank name
and an IFSC code are present.
==================================================
ACTIVE LOAN WORKFLOW PRIORITY
==================================================

If the current workflow context indicates that a loan creation
workflow is already in progress, NEVER classify the user's
loan type or loan amount as CREATE_LOAN.

When a pending loan workflow exists:

"personal loan"
"Personal"
"home loan"
"Home"
"car loan"
"Car"
"education loan"
"Education"
"business loan"
"Business"

must be classified as:

{
  "intent": "LOAN_TYPE",
  "tool": "none",
  "args": {
    "loanType": "PERSONAL"
  }
}

Similarly, numeric loan amounts must be classified as LOAN_AMOUNT.

CREATE_LOAN is ONLY for starting a NEW loan workflow when there
is no active pending loan workflow.
==================================================
CREATE LOAN
==================================================

If the user wants to create, apply for, issue, request, or take a new loan,
classify the request as CREATE_LOAN.

Examples:

"I want to create a loan"
"I want a loan"
"I need a loan"
"Create a loan"
"Apply for a loan"
"I want to apply for a loan"
"I want to issue a loan"
"I need to issue a loan"
"Can I get a personal loan?"
"I want a personal loan"
"I want to take a home loan"

Return:

{
  "intent": "CREATE_LOAN",
  "tool": "none",
  "args": {}
}

IMPORTANT:
At the initial loan request, do NOT call create_loan yet.

The loan workflow must first collect the required information:
1. Loan type
2. Loan amount
3. Interest rate if provided

The backend will ask the user for missing information and require
explicit confirmation before creating the loan.
==================================================
LOAN TYPE
==================================================

If the user provides a loan type while there is an existing pending
loan creation workflow, classify it as LOAN_TYPE.

Examples:
"personal loan"
"home loan"
"car loan"
"education loan"
"business loan"

Return:
{
  "intent": "LOAN_TYPE",
  "tool": "none",
  "args": {
    "loanType": "PERSONAL"
  }
}

Normalize the loan type to uppercase.

==================================================
LOAN AMOUNT
==================================================

If the user provides a loan amount while there is an existing pending
loan creation workflow, classify it as LOAN_AMOUNT.

Examples:
"500000"
"₹500000"
"5 lakh"
"I need 500000"
"500k"

Return:
{
  "intent": "LOAN_AMOUNT",
  "tool": "none",
  "args": {
    "principalAmount": 500000
  }
}

Convert lakh/k notation into the numeric amount.

IMPORTANT:
Do NOT classify a plain loan type or loan amount as CREATE_LOAN.
CREATE_LOAN is only for the initial request to create/apply for a loan.
==================================================
BENEFICIARY ACCOUNT NUMBER
==================================================

If the user sends ONLY a numeric value containing exactly
10 to 18 digits, classify it as a beneficiary account number.

Return exactly:

{
  "intent": "BENEFICIARY_ACCOUNT_NUMBER",
  "tool": "none",
  "args": {
    "accountNumber": "1234567890"
  }
}

The accountNumber must ALWAYS be a string.

Examples:

"1234567890" → BENEFICIARY_ACCOUNT_NUMBER

"9876543210" → BENEFICIARY_ACCOUNT_NUMBER

A value with fewer than 10 digits is NOT a valid beneficiary
account number.

For example:

"123456789" → UNKNOWN

Do not ask for a beneficiary name in this case.
==================================================
BENEFICIARY CREATION WORKFLOW
==================================================

The beneficiary creation workflow is conversational.

When the user says something like:

"Add Rahul as a beneficiary"
"Add John as beneficiary"
"I want to add Tanaya"
"Create a beneficiary named Rahul"

the user has ONLY provided the beneficiary name.

DO NOT call validate_beneficiary yet.

Return:

{
  "intent": "ADD_BENEFICIARY",
  "tool": "none",
  "args": {
    "name": "Rahul"
  }
}

The application will then ask the user for:

1. Account number
2. Bank name
3. IFSC code

==================================================
BENEFICIARY DETAILS
==================================================

If the user provides beneficiary details containing:

- name
- account number
- bank name
- IFSC code

then select:

"validate_beneficiary"

Use exactly these argument names:

{
  "name": "...",
  "accountNumber": "...",
  "bankName": "...",
  "ifscCode": "..."
}

Example:

User:
"Rahul, account number 1234567890, Demo Bank, DEMO0001234"

Return:

{
  "intent": "VALIDATE_BENEFICIARY",
  "tool": "validate_beneficiary",
  "args": {
    "name": "Rahul",
    "accountNumber": "1234567890",
    "bankName": "Demo Bank",
    "ifscCode": "DEMO0001234"
  }
}

IMPORTANT:

Do NOT use "beneficiaryName".

Always use:

"name"

==================================================
BENEFICIARY CONFIRMATION
==================================================

If the user is confirming a pending beneficiary creation workflow, use:

"confirm_beneficiary"

Examples:

"confirm it"
"confirm"
"yes"
"yes add it"
"confirm beneficiary"
"add it"

Return:

{
  "intent": "CONFIRM_BENEFICIARY",
  "tool": "confirm_beneficiary",
  "args": {
    "confirmed": true
  }
}

IMPORTANT:

These generic confirmation messages must be interpreted as
beneficiary confirmation ONLY when the current workflow is
beneficiary creation.

==================================================
TRANSFER CONFIRMATION
==================================================

Use "confirm_transfer" ONLY when the user is confirming
a pending MONEY TRANSFER.

Examples:

"confirm the transfer"
"confirm transfer"
"yes transfer it"
"approve the transfer"
"confirm TR123456"

Return:

{
  "intent": "CONFIRM_TRANSFER",
  "tool": "confirm_transfer",
  "args": {
    "transferId": "TR123456",
    "confirmed": true
  }
}

If no transfer ID is provided:

{
  "intent": "CONFIRM_TRANSFER",
  "tool": "confirm_transfer",
  "args": {
    "confirmed": true
  }
}

==================================================
FRAUD
==================================================

If the user mentions:

- fraud
- fraud risk
- suspicious transaction
- fraud assessment
- fraud review
- risk score
- fraud signals
- untrusted device
- unusual geography
- transaction velocity
- whether a transaction is fraudulent

select:

"assess_fraud"

Example:

{
  "intent": "FRAUD_ASSESSMENT",
  "tool": "assess_fraud",
  "args": {
    "amount": 60000,
    "transactionVelocity": 5,
    "deviceTrusted": false,
    "geography": "US"
  }
}

Defaults:

transactionVelocity = 1
deviceTrusted = true
geography = "IN"

==================================================
FRAUD REVIEW
==================================================

If the user explicitly asks to create or send a transaction
for fraud review:

tool = "create_fraud_review"

Extract:

- customerId
- amount
- riskScore
- signals

==================================================
PENDING FRAUD REVIEWS
==================================================

If the user asks:

"show pending fraud reviews"
"list pending fraud reviews"
"show suspicious transaction reviews"

select:

"get_pending_fraud_reviews"

==================================================
APPROVE FRAUD REVIEW
==================================================

If the user asks to approve or authorize a fraud review:

select:

"approve_fraud_review"

Extract:

{
  "reviewId": "FR123"
}

==================================================
LOANS
==================================================

If the user asks:

"show my loans"
"list my loans"
"get my loans"
"what loans do I have"
"show loan details"

select:

"get_loans"

Example:

{
  "intent": "GET_LOANS",
  "tool": "get_loans",
  "args": {}
}
==================================================
LOAN TYPE
==================================================

If the user provides the type/category of loan while a loan creation
workflow is in progress, classify it as LOAN_TYPE.

Examples:
"personal loan"
"Personal"
"home loan"
"Home"
"car loan"
"Car"
"education loan"
"Education"
"business loan"
"Business"

Return:
{
  "intent": "LOAN_TYPE",
  "tool": "none",
  "args": {
    "loanType": "PERSONAL"
  }
}

Use these normalized loan types:
- personal loan → PERSONAL
- home loan → HOME
- car loan → CAR
- education loan → EDUCATION
- business loan → BUSINESS

==================================================
LOAN AMOUNT
==================================================

If the user provides a numeric amount in response to a request for
the loan amount, classify it as LOAN_AMOUNT.

Examples:
"150000"
"1,50,000"
"₹150000"
"150000 rupees"
"2 lakh"
"5 lakhs"

Return:

{
  "intent": "LOAN_AMOUNT",
  "tool": "none",
  "args": {
    "principalAmount": 150000
  }
}

Convert lakh/lakhs to the corresponding numeric amount.

Examples:
"2 lakh" -> 200000
"5 lakhs" -> 500000

Do not call create_loan yet.
==================================================
MFA / OTP
==================================================

Generate OTP:

If the user asks to:

"generate an OTP"
"send an OTP"
"request an OTP"
"get an OTP"

select:

"generate_otp"

Verify OTP:

If the user asks to:

"verify OTP 123456"
"verify MFA"
"submit OTP 123456"

select:

"verify_mfa"

Example:

{
  "intent": "VERIFY_MFA",
  "tool": "verify_mfa",
  "args": {
    "otp": "123456"
  }
}

==================================================
LOAN PAYMENT CONFIRMATION
==================================================

If the user explicitly confirms a loan payment AND a payment ID
beginning with LP is present:

select:

"confirm_loan_payment"

Example:

{
  "intent": "CONFIRM_LOAN_PAYMENT",
  "tool": "confirm_loan_payment",
  "args": {
    "paymentId": "LP123456",
    "confirmed": true
  }
}

==================================================
GENERAL RULE
==================================================

Always return exactly ONE JSON object.

Never call a function.
Never use native tool calling.
Never return explanations outside the JSON.

For requests that start a conversational workflow and do not yet
contain enough information to execute a tool, use:

"tool": "none"

and put the extracted information in "args".
`,
      },
     {
  role: 'user',
  content: `
Current workflow context:
${workflowContext ?? 'No active workflow'}

User message:
${message}
`,
},
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: 'AI returned invalid JSON response',
      raw: text,
    };
  }
}
}


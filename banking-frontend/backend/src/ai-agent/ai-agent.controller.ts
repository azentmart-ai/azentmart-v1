import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AiAgentService } from './ai-agent.service.js';
import { ToolExecutorService } from '../tool-registry/tool-executor.service.js';
import { OrchestratorService } from '../orchestrator/orchestrator.service.js';
@Controller('ai-agent')
export class AiAgentController {
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly toolExecutor: ToolExecutorService,
    private readonly orchestratorService: OrchestratorService,
  ) {}

  @Post('intent')
  async intent(
  @Body()
  body: {
    email: string;
    password: string;
    message: string;
  },
) {
  console.log('AI REQUEST BODY:', body);
  console.log('AI MESSAGE:', body.message);
const customerId = 'C123';

const pendingLoan =
  this.orchestratorService.getPendingLoan(customerId);

const workflowContext = pendingLoan
  ? `A loan creation workflow is currently pending.
     Loan type: ${pendingLoan.loanType || 'NOT PROVIDED'}
     Loan amount: ${pendingLoan.principalAmount || 'NOT PROVIDED'}
     Interest rate: ${pendingLoan.interestRate || 'NOT PROVIDED'}`
  : 'No loan creation workflow is currently pending.';

const aiResult = await this.aiAgentService.detectIntent(
  body.message,
  workflowContext,
);
console.log('AI RESULT:', aiResult);
// 2. Receive loan type
// 3. Receive loan amount
// 4. Receive loan interest rate

if (aiResult.intent === 'LOAN_INTEREST_RATE') {
  const customerId = 'C123';

  const pendingLoan =
    this.orchestratorService.getPendingLoan(customerId);

  console.log('PENDING LOAN BEFORE INTEREST RATE:', pendingLoan);

  if (!pendingLoan) {
    return {
      success: false,
      message:
        'No pending loan found. Please start the loan application again.',
    };
  }

  const updatedLoan = {
    ...pendingLoan,
    interestRate: Number(aiResult.args.interestRate),
  };

  this.orchestratorService.setPendingLoan(updatedLoan);

  return {
    success: true,
    message:
      `Please confirm the loan details:\n\n` +
      `Loan Type: ${updatedLoan.loanType}\n` +
      `Loan Amount: ₹${updatedLoan.principalAmount.toLocaleString('en-IN')}\n` +
      `Interest Rate: ${updatedLoan.interestRate}%\n\n` +
      `Confirm?`,
    loan: updatedLoan,
  };
}
if (aiResult.intent === 'LOAN_AMOUNT') {
  const customerId = 'C123';

  const pendingLoan =
    this.orchestratorService.getPendingLoan(customerId);

  console.log('PENDING LOAN:', pendingLoan);

  if (!pendingLoan) {
    return {
      success: false,
      message:
        'No pending loan found. Please start by providing the loan type.',
    };
  }

  this.orchestratorService.setPendingLoan({
    ...pendingLoan,
    principalAmount: Number(aiResult.args.principalAmount),
  });

  return {
    success: true,
    message:
      `Loan type: ${pendingLoan.loanType}\n` +
      `Loan amount: ₹${Number(aiResult.args.principalAmount).toLocaleString('en-IN')}\n\n` +
      `What interest rate would you like for the loan?`,
  };
}
if (aiResult.intent === 'LOAN_TYPE') {
  const customerId = 'C123';

  const pendingLoan =
    this.orchestratorService.getPendingLoan(customerId);

  console.log('PENDING LOAN:', pendingLoan);

  if (!pendingLoan) {
    return {
      success: false,
      message:
        'No pending loan request found. Please start by saying "I want to issue a loan".',
    };
  }

  this.orchestratorService.setPendingLoan({
    ...pendingLoan,
    loanType: aiResult.args.loanType,
  });

  return {
    success: true,
    intent: 'LOAN_TYPE',
    message: 'How much loan amount would you like to apply for?',
  };
}
if (aiResult.intent === 'BENEFICIARY_BANK_IFSC') {
  const customerId = 'C123';

  const pendingBeneficiary =
    this.orchestratorService.getPendingBeneficiary(customerId);

  console.log('PENDING BENEFICIARY BEFORE BANK/IFSC:', pendingBeneficiary);

  if (!pendingBeneficiary) {
    return {
      success: false,
      message:
        'No pending beneficiary found. Please start by providing the beneficiary name.',
    };
  }

  const updatedBeneficiary = {
    ...pendingBeneficiary,
    bankName: aiResult.args.bankName,
    ifscCode: aiResult.args.ifscCode,
  };

  this.orchestratorService.setPendingBeneficiary(
    updatedBeneficiary,
  );

  return {
    success: true,
    message:
      `Please confirm the beneficiary details:\n\n` +
      `Name: ${updatedBeneficiary.name}\n` +
      `Account: ${updatedBeneficiary.accountNumber}\n` +
      `Bank: ${updatedBeneficiary.bankName}\n` +
      `IFSC: ${updatedBeneficiary.ifscCode}\n\n` +
      `Confirm?`,
    beneficiary: updatedBeneficiary,
  };
}

if (aiResult.intent === 'CREATE_LOAN') {
  const customerId = 'C123';

  this.orchestratorService.setPendingLoan({
    loanId: '',
    customerId,
    loanType: '',
    principalAmount: 0,
    interestRate: 10,
  });

  return {
    success: true,
    intent: 'CREATE_LOAN',
    message: 'Sure. What type of loan would you like to apply for?',
  };
}
// 1. Start beneficiary creation
if (aiResult.intent === 'ADD_BENEFICIARY') {
  const customerId = 'C123';

  // Clear any previous loan workflow
  this.orchestratorService.clearPendingLoan(customerId);

  this.orchestratorService.setPendingBeneficiary({
    customerId,
    name: aiResult.args.name,
    accountNumber: '',
    bankName: '',
    ifscCode: '',
  });

  return {
    success: true,
    message: `Sure. Please provide ${aiResult.args.name}'s account number.`,
  };
}

// 2. Receive beneficiary account number
if (aiResult.intent === 'BENEFICIARY_ACCOUNT_NUMBER') {
  const customerId = 'C123';

  const pendingBeneficiary =
    this.orchestratorService.getPendingBeneficiary(customerId);

  console.log('PENDING BENEFICIARY:', pendingBeneficiary);

  if (!pendingBeneficiary) {
    return {
      success: false,
      message:
        'No pending beneficiary found. Please start by providing the beneficiary name.',
    };
  }

  this.orchestratorService.setPendingBeneficiary({
    ...pendingBeneficiary,
    accountNumber: aiResult.args.accountNumber,
  });

  return {
    success: true,
    message: `Please provide ${pendingBeneficiary.name}'s bank name and IFSC code.`,
  };
}
 // Confirm loan creation
if (aiResult.intent === 'CONFIRM_LOAN') {
  const customerId = 'C123';

  const pendingLoan =
    this.orchestratorService.getPendingLoan(customerId);

  console.log('PENDING LOAN BEFORE CONFIRMATION:', pendingLoan);

  if (!pendingLoan) {
    return {
      success: false,
      message:
        'No pending loan found. Please start the loan application again.',
    };
  }

  if (!aiResult.args.confirmed) {
    this.orchestratorService.clearPendingLoan(customerId);

    return {
      success: false,
      message: 'Loan creation cancelled.',
    };
  }

  return {
    success: true,
    intent: 'CONFIRM_LOAN',
    requiresMFA: true,
    message:
      'Loan details confirmed successfully. Please verify the OTP to create the loan.',
    loan: pendingLoan,
  };
} 
if (!aiResult.tool || aiResult.tool === 'none') {
  return aiResult;
}
const result: any = await this.toolExecutor.execute(
    aiResult.tool,
  aiResult.args,
  body.email,
  body.password,
  body.message,
);

if (
  aiResult.tool === 'assess_fraud' &&
  result.fraudDecision === 'REVIEW_REQUIRED'
) {
  return this.toolExecutor.execute(
    'create_fraud_review',
    {
      customerId: result.customerId,
      amount: result.amount,
      riskScore: result.riskScore,
      signals: result.signals,
    },
    body.email,
    body.password,
    body.message,
  );
}
// 1. Start loan creation


return result;
  }

  @Post('confirm_transfer')
async confirmTransfer(
  @Body()
  body: {
    email: string;
    password: string;
    transferId: string;
    confirmed: boolean;
  },
) {
  console.log('AI CONFIRM TRANSFER:', body);

  return this.toolExecutor.execute(
    'confirm_transfer',
    {
      transferId: body.transferId,
      confirmed: body.confirmed,
    },
    body.email,
    body.password,
    `Confirm transfer ${body.transferId}`,
  );
}
}
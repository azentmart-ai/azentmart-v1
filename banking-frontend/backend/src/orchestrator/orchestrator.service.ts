import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service.js';
import { AccountsService } from '../accounts/accounts.service.js';
import { MfaService } from '../mfa/mfa.service.js';
import { BeneficiariesService } from '../beneficiaries/beneficiaries.service.js';
import { RiskService } from '../risk/risk.service.js';
import { PolicyService } from '../policy/policy.service.js';
import { AuthService } from '../auth/auth.service.js';
import { AuditService } from '../audit/audit.service.js';
import { LoansService } from '../loans/loans.service.js';
import { AgentStateService } from '../agent-state/agent-state.service.js';
import { IntegrationGatewayService } from '../integration-gateway/integration-gateway.service.js';
import { randomUUID } from 'crypto';
interface PendingTransfer {
  transferId: string;
  customerId: string;
  beneficiaryId: string;
  beneficiaryCustomerId: string;
  beneficiaryName: string;
  amount: number;
  riskLevel: string;
}
interface PendingLoan {
  loanId: string;
  customerId: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
}
interface PendingLoanPayment {
  paymentId: string;
  customerId: string;
  loanId: string;
  amount: number;
}
interface PendingBeneficiary {
  customerId: string;
  name: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}
@Injectable()
export class OrchestratorService {
  private pendingTransfers = new Map<string, PendingTransfer>();
  private confirmedTransfers = new Set<string>();
    private pendingLoanPayments = new Map<string, PendingLoanPayment>();
  private confirmedLoanPayments = new Set<string>();
  private pendingBeneficiaries = new Map<string, PendingBeneficiary>();
  private pendingLoans = new Map<string, PendingLoan>();
getPendingTransfer(customerId: string) {
  const pending = this.pendingTransfers.get(customerId);

  console.log('PENDING TRANSFER LOOKUP:', {
    customerId,
    found: !!pending,
    pendingTransfer: pending,
  });

  return pending;
}
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
    private readonly mfaService: MfaService,
    private readonly beneficiariesService: BeneficiariesService,
    private readonly riskService: RiskService,
    private readonly policyService: PolicyService,
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
    private readonly loansService: LoansService,
    private readonly agentStateService: AgentStateService,
    private readonly integrationGatewayService: IntegrationGatewayService,
  ) {}

  async executeTransfer(
    email: string,
    password: string,
    message: string,
    amount?: number,
    beneficiaryName?: string,
  ) {
    // 1. Authentication
    const auth = this.authService.login(email, password);
    if (!auth.success || !auth.customerId) {
      return {
        success: false,
        message: auth.msg,
        status: 'AUTHENTICATION_FAILED',
      };
    }

    const customerId = auth.customerId;
const conversationId = `CONV-${customerId}`;

let agentState = this.agentStateService.getState(
  conversationId,
);

if (!agentState) {
  agentState = this.agentStateService.createState(
    conversationId,
    customerId,
    'TENANT001',
    'WEB',
  );
}
    // 2. Check whether this customer already has a pending transfer
    let pendingTransfer = this.pendingTransfers.get(customerId);

    // ============================================================
    // FIRST STEP: PREPARE TRANSFER
    // ============================================================
    if (!pendingTransfer) {
      // 3. Validate AI-provided transfer arguments
      const transferAmount = amount;
      const transferBeneficiaryName = beneficiaryName;

      if (
        transferAmount === undefined ||
        transferAmount === null ||
        transferAmount <= 0
      ) {
        return {
          success: false,
          message: 'Transfer amount is required',
          status: 'INVALID_AMOUNT',
        };
      }

      if (!transferBeneficiaryName) {
        return {
          success: false,
          message: 'Beneficiary name is required',
          status: 'INVALID_BENEFICIARY',
        };
      }

      // 4. Balance check
      const account =
        await this.accountsService.getBalance(customerId);

      if (!account.success) {
        return account;
      }

      // 5. Beneficiary validation
     const beneficiary = await this.beneficiariesService.getBeneficiary(
  customerId,
  beneficiaryName,
);

      if (!beneficiary) {
        return {
          success: false,
          message: 'Beneficiary not found',
          status: 'BENEFICIARY_NOT_FOUND',
        };
      }

      // 6. Transfer validation
      const validation =
        this.transactionsService.validateTransfer(
          customerId,
          beneficiary.id,
          transferAmount,
        );

      if (!validation.success) {
        return validation;
      }

      // 7. Risk assessment
      const risk =
        this.riskService.assessTransfer(
          customerId,
          transferAmount,
        );

      if (!risk.success) {
        return risk;
      }
this.agentStateService.updateState(
  conversationId,
  {
    workflowStatus: 'RISK_EVALUATED',
  },
);
      // 8. Policy evaluation
      const policy =
        this.policyService.evaluateTransfer({
          customerId,
          amount: transferAmount,
          transactionType: 'TRANSFER',

          customerStatus: 'ACTIVE',
          accountStatus: 'ACTIVE',
          beneficiaryStatus: 'ACTIVE',

          deviceTrusted: true,

          riskLevel: risk.riskLevel,

          geography: 'IN',

          authenticationLevel: 'STRONG',

          regulatoryRules: {
            amlClear: true,
            sanctionsClear: true,
            kycVerified: true,
          },
        });

      if (!policy.success) {
        return policy;
      }
this.agentStateService.updateState(
  conversationId,
  {
    workflowStatus: 'POLICY_EVALUATED',
  },
);
      // 9. Create pending transfer
const transferId = `TR-${randomUUID()}`;
  const pendingTransfer = {
  transferId,
  customerId,
  beneficiaryId: beneficiary.id,
  beneficiaryCustomerId: beneficiary.beneficiary_customer_id,
  beneficiaryName: beneficiary.beneficiary_name,
  amount: transferAmount,
  riskLevel: risk.riskLevel,
};

this.pendingTransfers.set(customerId, pendingTransfer);
this.agentStateService.updateState(
  conversationId,
  {
    transactionId: transferId,
    selectedTool: 'prepare_transfer',
    approvalRequired: true,
    approvalStatus: 'PENDING',
    workflowStatus: 'WAITING_FOR_CONFIRMATION',
  },
);
      // 10. Ask customer for confirmation
      return {
        success: false,
        transferId,
        message: 'Transfer confirmation required',
        status: 'CONFIRMATION_REQUIRED',
        riskLevel: risk.riskLevel,
        amount: transferAmount,
        beneficiary: beneficiary.name,
      };
    }

    // ============================================================
    // SECOND STEP: CONFIRMATION
    // ============================================================

    if (
      !this.confirmedTransfers.has(
        pendingTransfer.transferId,
      )
    ) {
      const conversationId = `CONV-${pendingTransfer.customerId}`;

this.agentStateService.updateState(
  conversationId,
  {
    approvalStatus: 'CONFIRMED',
    workflowStatus: 'CONFIRMED',
  },
);
      
      return {
        success: false,
        transferId: pendingTransfer.transferId,
        message: 'Transfer confirmation required',
        status: 'CONFIRMATION_REQUIRED',
        riskLevel: pendingTransfer.riskLevel,
        amount: pendingTransfer.amount,
        beneficiary: pendingTransfer.beneficiaryName,
      };
    }

    // ============================================================
    // THIRD STEP: MFA
    // ============================================================

    if (!this.mfaService.isVerified(customerId)) {
      return {
        success: false,
        transferId: pendingTransfer.transferId,
        message: 'MFA verification required',
        status: 'MFA_REQUIRED',
      };
    }

    // ============================================================
    // FOURTH STEP: EXECUTION
    // ============================================================

    const execution =await
      this.transactionsService.executeTransfer(
        pendingTransfer.transferId,
        pendingTransfer.customerId,
        pendingTransfer.beneficiaryId,
        pendingTransfer.amount,
      );

    // ============================================================
    // FIFTH STEP: VERIFICATION + AUDIT
    // ============================================================

    if (execution.success) {
      const verification =
        this.transactionsService.verifyTransaction(
          pendingTransfer.transferId,
        );

      const audit = this.auditService.log({
        action: 'TRANSFER',
        customerId,
        transferId: pendingTransfer.transferId,
        transactionId: execution.transactionId,
        beneficiary: pendingTransfer.beneficiaryName,
        amount: pendingTransfer.amount,
        riskLevel: pendingTransfer.riskLevel,
        status: execution.status,
      });

      // Remove pending state
      this.pendingTransfers.delete(customerId);

      this.confirmedTransfers.delete(
        pendingTransfer.transferId,
      );

      return {
        ...execution,
        verification,
        audit,
      };
    }

    return execution;
  }
async prepareLoanPayment(
  customerId: string,
  loanId: string,
  amount: number,
) {
  // 1. Check MFA
  if (!this.mfaService.isVerified(customerId)) {
    return {
      success: false,
      message: 'MFA verification required',
      status: 'MFA_REQUIRED',
    };
  }

  // 2. Validate amount
  if (!amount || amount <= 0) {
    return {
      success: false,
      message: 'Invalid payment amount',
      status: 'INVALID_AMOUNT',
    };
  }

  // 3. Check loan
 const loan = await this.loansService.getLoanBalance(
  customerId,
  loanId,
);

if (!loan.success) {
    return loan;
  }

  // 4. Check outstanding balance
 if (
  loan.outstandingBalance === undefined ||
  amount > loan.outstandingBalance
) {
    return {
      success: false,
      message: 'Payment exceeds outstanding balance',
      status: 'INVALID_AMOUNT',
    };
  }

  // 5. Create pending payment
  const paymentId = `LP${Date.now()}`;

  const pendingPayment: PendingLoanPayment = {
    paymentId,
    customerId,
    loanId,
    amount,
  };

  this.pendingLoanPayments.set(
    customerId,
    pendingPayment,
  );

  // 6. Ask for explicit confirmation
  return {
    success: false,
    paymentId,
    message: `Please confirm payment of ₹${amount} towards loan ${loanId}.`,
    status: 'CONFIRMATION_REQUIRED',
    loanId,
    amount,
    outstandingBalance: loan.outstandingBalance,
  };
}
async confirmLoanPayment(
  paymentId: string,
  confirmed: boolean,
) {
  // Find pending payment
  const pendingPayment =
    [...this.pendingLoanPayments.values()].find(
      payment => payment.paymentId === paymentId,
    );

  if (!pendingPayment) {
    return {
      success: false,
      paymentId,
      message: 'Pending loan payment not found',
      status: 'NOT_FOUND',
    };
  }

  // Customer cancelled
  if (!confirmed) {
    this.confirmedLoanPayments.delete(paymentId);
    this.pendingLoanPayments.delete(
      pendingPayment.customerId,
    );

    return {
      success: false,
      paymentId,
      message: 'Loan payment cancelled by customer',
      status: 'CANCELLED',
    };
  }

  // Mark payment as confirmed
  this.confirmedLoanPayments.add(paymentId);

  // MFA check
  if (
    !this.mfaService.isVerified(
      pendingPayment.customerId,
    )
  ) {
    return {
      success: false,
      paymentId,
      message: 'MFA verification required',
      status: 'MFA_REQUIRED',
    };
  }

  // Execute payment only after confirmation + MFA
  const execution =
   await  this.loansService.makeLoanPayment(
      pendingPayment.customerId,
      pendingPayment.loanId,
      pendingPayment.amount,
    );

  if (!execution.success) {
    return execution;
  }

  // Cleanup pending state
  this.pendingLoanPayments.delete(
    pendingPayment.customerId,
  );

  this.confirmedLoanPayments.delete(paymentId);

  return {
    ...execution,
    paymentId,
    status: 'PAYMENT_COMPLETED',
  };
}


  async confirmTransfer(
    transferId: string,
    confirmed: boolean,
  ) {
    // Customer cancelled
    if (!confirmed) {
      this.confirmedTransfers.delete(transferId);

      return {
        success: false,
        transferId,
        message: 'Transfer cancelled by customer',
        status: 'CANCELLED',
      };
    }

    // Find pending transfer
    const pendingTransfer =
      [...this.pendingTransfers.values()].find(
        transfer =>
          transfer.transferId === transferId,
      );

    if (!pendingTransfer) {
      return {
        success: false,
        transferId,
        message: 'Pending transfer not found',
        status: 'NOT_FOUND',
      };
    }

    // Mark as confirmed
    this.confirmedTransfers.add(transferId);

    return {
      success: true,
      transferId,
      message:
        'Transfer confirmed. MFA verification required.',
      status: 'PENDING_MFA',
      requiresMFA: true,
    };
  }
  executeTransferDirect(
  transferId: string,
  fromCustomerId: string,
  toCustomerId: string,
  amount: number,
  idempotencyKey: string,
) {
  return this.integrationGatewayService.executeTransfer(
  transferId,
  fromCustomerId,
  toCustomerId,
  amount,
  idempotencyKey,
);
}
setPendingBeneficiary(data: PendingBeneficiary) {
  this.pendingBeneficiaries.set(data.customerId, data);

  console.log('PENDING BENEFICIARY SAVED:', data);

  return {
    success: true,
    message: 'Beneficiary details saved and waiting for confirmation.',
    beneficiary: data,
  };
}

getPendingBeneficiary(customerId: string) {
  const beneficiary = this.pendingBeneficiaries.get(customerId);

  console.log('PENDING BENEFICIARY LOOKUP:', {
    customerId,
    found: !!beneficiary,
    beneficiary,
  });

  return beneficiary;
}
setPendingLoan(data: PendingLoan) {
  this.pendingLoans.set(data.customerId, data);

  console.log('PENDING LOAN SAVED:', data);

  return {
    success: true,
    message: 'Loan details saved and waiting for confirmation.',
    loan: data,
  };
}

getPendingLoan(customerId: string) {
  const loan = this.pendingLoans.get(customerId);

  console.log('PENDING LOAN LOOKUP:', {
    customerId,
    found: !!loan,
    loan,
  });

  return loan;
}

clearPendingLoan(customerId: string) {
  this.pendingLoans.delete(customerId);

  console.log('PENDING LOAN CLEARED:', customerId);
}
}


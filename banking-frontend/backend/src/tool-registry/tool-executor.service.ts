import { Injectable, NotFoundException } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { MfaService } from '../mfa/mfa.service.js';
import { RiskService } from '../risk/risk.service.js';
import { PolicyService } from '../policy/policy.service.js';
import { AccountsService } from '../accounts/accounts.service.js';
import { OrchestratorService } from '../orchestrator/orchestrator.service.js';
import { LoansService } from '../loans/loans.service.js';
import { StatementsService } from '../statements/statements.service.js';
import { FraudService } from '../fraud/fraud.service.js';
import { FraudReviewService } from '../fraud/fraud-review.service.js';
import { ToolAuthorizationService } from '../tools/tool-authorization.service.js';
import { IntegrationGatewayService } from '../integration-gateway/integration-gateway.service.js';
import { BeneficiariesService } from '../beneficiaries/beneficiaries.service.js';
@Injectable()
export class ToolExecutorService {
  constructor(
    private readonly toolRegistry: ToolRegistryService,
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
    private readonly mfaService: MfaService,
    private readonly beneficiariesService: BeneficiariesService,
    private readonly riskService: RiskService,
    private readonly policyService: PolicyService,
    private readonly orchestratorService: OrchestratorService,
    private readonly loansService: LoansService,
    private readonly statementsService: StatementsService,
    private readonly fraudService: FraudService,
    private readonly fraudReviewService: FraudReviewService,
    private readonly toolAuthorizationService: ToolAuthorizationService,

    private readonly integrationGatewayService: IntegrationGatewayService,
  ) {}
  

async execute(
  toolName: string,
  args: any,
  email?: string,
  password?: string,
  message?: string,
) {
const customerId = args?.customerId ?? 'C123';

console.log('MFA DEBUG:', {
  toolName,
  customerId,
  mfaVerified: this.mfaService.isVerified(customerId),
});
console.log('BENEFICIARY TOOL ARGS:', JSON.stringify(args, null, 2));
if (
  toolName !== 'verify_mfa' &&
  toolName !== 'generate_otp' &&
  toolName !== 'make_loan_payment' &&
  toolName !== 'confirm_loan_payment' &&
  toolName !== 'prepare_transfer'
) {
  this.toolAuthorizationService.authorize(toolName, {
    authenticated: true,
    mfaVerified: this.mfaService.isVerified(customerId),
    confirmed: args?.confirmed ?? false,
  });
}
    const tool = this.toolRegistry.getTool(toolName);

    if (!tool) {
      throw new NotFoundException(`Tool '${toolName}' not found`);
    }
if (toolName === 'confirm_loan_payment') {
  console.log('CONFIRM LOAN PAYMENT EXECUTOR CALLED:', {
    paymentId: args?.paymentId,
    confirmed: args?.confirmed,
  });

  return this.orchestratorService.confirmLoanPayment(
    args.paymentId,
    args.confirmed ?? true,
  );
}
    switch (toolName) {
case 'get_transactions':
  return this.transactionsService.getTransactions(
    args.customerId ?? 'C123',
  );
      case 'get_transaction':
        return this.transactionsService.getTransaction(
          args.customerId,
          args.transactionId,
        );

      case 'validate_transfer':
        return this.transactionsService.validateTransfer(
          args.fromCustomerId,
          args.toCustomerId,
          args.amount,
        );
case 'assess_fraud':
  return this.fraudService.assessTransaction(
    args.customerId,
    args.amount,
    args.transactionVelocity,
    args.deviceTrusted,
    args.geography,
  );
     case 'confirm_transfer':
  return this.orchestratorService.confirmTransfer(
    args.transferId,
    args.confirmed,
  );

    case 'execute_transfer':
  return this.integrationGatewayService.executeTransfer(
    args.transferId,
    args.fromCustomerId,
    args.toCustomerId,
    args.amount,
    args.idempotencyKey,
  );
      case 'generate_otp':
        return this.mfaService.generateOtp(args.customerId);

case 'verify_mfa': {
  const customerId = args.customerId ?? 'C123';

  const mfaResult = await this.mfaService.verifyOtp(
    customerId,
    args.otp,
  );

  if (!mfaResult.success) {
    return mfaResult;
  }

  console.log('MFA VERIFIED - CHECKING PENDING WORKFLOWS:', {
    customerId,
  });

  // 1. Check for pending money transfer first
  const pendingTransfer =
    this.orchestratorService.getPendingTransfer(customerId);

  console.log('PENDING TRANSFER LOOKUP:', {
    customerId,
    found: !!pendingTransfer,
    pendingTransfer,
  });

  if (pendingTransfer) {
    console.log(
      'EXECUTING PENDING TRANSFER:',
      pendingTransfer,
    );

    const execution =
      await this.transactionsService.executeTransfer(
        pendingTransfer.transferId,
        pendingTransfer.customerId,
        pendingTransfer.beneficiaryCustomerId,
        pendingTransfer.amount,
      );

    if (!execution.success) {
      return execution;
    }

    return {
      ...mfaResult,
      transfer: execution,
      message:
        'MFA verification successful. Transfer completed successfully.',
    };
  }

  // 2. If no transfer is pending, check for pending beneficiary
  const pendingBeneficiary =
    this.orchestratorService.getPendingBeneficiary(customerId);

  console.log('PENDING BENEFICIARY LOOKUP:', {
    customerId,
    found: !!pendingBeneficiary,
    pendingBeneficiary,
  });

  if (pendingBeneficiary) {
    const beneficiaryResult =
      await this.beneficiariesService.addBeneficiary(
        pendingBeneficiary.customerId,
        pendingBeneficiary.name,
        pendingBeneficiary.accountNumber,
        pendingBeneficiary.bankName,
        pendingBeneficiary.ifscCode,
      );

    if (!beneficiaryResult.success) {
      return beneficiaryResult;
    }

    return {
      ...mfaResult,
      beneficiary: beneficiaryResult.beneficiary,
      message:
        `MFA verification successful. ${beneficiaryResult.message}`,
    };
  }
const pendingLoan =
  this.orchestratorService.getPendingLoan(customerId);

if (pendingLoan) {
  const loanResult = await this.loansService.createLoan(
    pendingLoan.customerId,
    pendingLoan.loanType,
    pendingLoan.principalAmount,
    pendingLoan.interestRate,
  );

  if (!loanResult.success) {
    return loanResult;
  }

  this.orchestratorService.clearPendingLoan(customerId);

  return {
    ...mfaResult,
    loan: loanResult.loan,
    message: 'MFA verification successful. Loan created successfully.',
  };
}
  // 3. Nothing pending
  return {
    ...mfaResult,
    message:
      'MFA verification successful, but no pending transfer or beneficiary was found.',
  };
  
}
case 'get_beneficiaries': {
  const customerId = args.customerId ?? 'C123';

  return this.beneficiariesService.getBeneficiaries(customerId);
}
        case 'get_beneficiary':
                return this.beneficiariesService.getBeneficiary(
                    args.customerId,
                    args.name,
                );
        case 'validate_beneficiary': {
  const customerId = args.customerId ?? 'C123';

  const validation =
    await this.beneficiariesService.validateBeneficiary(
      customerId,
      args.name,
      args.accountNumber,
      args.bankName,
      args.ifscCode,
    );

  if (!validation.success) {
    return validation;
  }

  return this.orchestratorService.setPendingBeneficiary({
    customerId,
    name: args.name,
    accountNumber: args.accountNumber,
    bankName: args.bankName,
    ifscCode: args.ifscCode,
  });
}
           case 'get_balance':
  return this.integrationGatewayService.getBalance(
    args.customerId ?? 'C123',
  );

case 'assess_risk':
  return this.riskService.assessTransfer(
    args.customerId,
    args.amount,
  );
case 'create_fraud_review':
  return this.fraudReviewService.createReview(
    args.customerId,
    args.amount,
    args.riskScore,
    args.signals,
  );

case 'get_pending_fraud_reviews':
  return this.fraudReviewService.getPendingReviews();

case 'approve_fraud_review': {
  const review = this.fraudReviewService.getReview(
    args.reviewId,
  );

  if (!review.success) {
    return review;
  }

  const customerId = review.review.customerId;

  if (!this.mfaService.isVerified(customerId)) {
    return {
      success: false,
      requiresMFA: true,
      message: 'MFA verification is required before approving this fraud review.',
    };
  }

  return this.fraudReviewService.approveReview(
    args.reviewId,
  );
}
case 'prepare_transfer':
  return this.orchestratorService.executeTransfer(
    email!,
    password!,
    message!,
    args.amount,
    args.beneficiaryName,
  );
case 'get_loan_schedule':
  console.log('SCHEDULE ARGS:', args);

  return this.loansService.getLoanSchedule(
    args.customerId,
    args.loanId,
  );
case 'get_loan_balance':
  return this.integrationGatewayService.getLoanBalance(
    args.customerId ?? 'C123',
    args.loanId,
  );
case 'make_loan_payment':
  return this.orchestratorService.prepareLoanPayment(
    args.customerId ?? customerId,
    args.loanId,
    args.amount,
  );
  case 'confirm_loan_payment':
  return this.orchestratorService.confirmLoanPayment(
    args.paymentId,
    args.confirmed,
  );
case 'get_loans':
  return this.integrationGatewayService.getLoans(
    args.customerId ?? 'C123',
  );
 case 'generate_statement':
  return this.statementsService.generateStatement(
    args.customerId,
    args.accountId,
    args.fromDate,
    args.toDate,
  );

case 'get_statement':
  return this.statementsService.getStatement(
    args.customerId,
    args.statementId,
  );

  

case 'email_statement':
  return this.statementsService.emailStatement(
    args.customerId,
    args.statementId,
    args.email,
  );
  case 'get_transaction_status':
  return this.transactionsService.getTransactionStatus(
    args.transactionId,
  );
case 'evaluate_policy':
 return this.policyService.evaluateTransfer({
  customerId: args.customerId,
  amount: args.amount,
  transactionType: args.transactionType ?? 'TRANSFER',

  customerStatus: args.customerStatus ?? 'ACTIVE',
  accountStatus: args.accountStatus ?? 'ACTIVE',
  beneficiaryStatus:
    args.beneficiaryStatus ?? 'ACTIVE',

  deviceTrusted:
    args.deviceTrusted ?? true,

  riskLevel: args.riskLevel,

  geography:
    args.geography ?? 'IN',

  authenticationLevel:
    args.authenticationLevel ?? 'PASSWORD',

  regulatoryRules: {
    amlClear:
      args.regulatoryRules?.amlClear ?? true,

    sanctionsClear:
      args.regulatoryRules?.sanctionsClear ?? true,

    kycVerified:
      args.regulatoryRules?.kycVerified ?? true,
  },
}
);

      default:
        throw new NotFoundException(
          `No executor found for '${toolName}'`,
        );
    }
  }
}
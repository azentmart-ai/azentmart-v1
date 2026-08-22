-- ============================================================
-- Billing Credits
-- Separate credit system.
-- Existing ai_usage_log is NOT modified.
-- ============================================================

CREATE TABLE IF NOT EXISTS account_credits (
  account_id uuid PRIMARY KEY
    REFERENCES accounts(id)
    ON DELETE CASCADE,

  balance integer NOT NULL DEFAULT 0
    CHECK (balance >= 0),

  total_purchased integer NOT NULL DEFAULT 0
    CHECK (total_purchased >= 0),

  total_used integer NOT NULL DEFAULT 0
    CHECK (total_used >= 0),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  account_id uuid NOT NULL
    REFERENCES accounts(id)
    ON DELETE CASCADE,

  transaction_type text NOT NULL
    CHECK (
      transaction_type IN (
        'purchase',
        'usage',
        'adjustment'
      )
    ),

  credits integer NOT NULL
    CHECK (credits <> 0),

  balance_after integer NOT NULL
    CHECK (balance_after >= 0),

  amount numeric(12,2),

  payment_provider text,

  payment_id text,

  reference_id text,

  description text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS
idx_credit_transactions_account_created
ON credit_transactions(account_id, created_at DESC);

ALTER TABLE account_credits ENABLE ROW LEVEL SECURITY;

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS account_credits_select
ON account_credits;

CREATE POLICY account_credits_select
ON account_credits
FOR SELECT
USING (
  is_account_member(account_id, 'admin')
);

DROP POLICY IF EXISTS credit_transactions_select
ON credit_transactions;

CREATE POLICY credit_transactions_select
ON credit_transactions
FOR SELECT
USING (
  is_account_member(account_id, 'admin')
);
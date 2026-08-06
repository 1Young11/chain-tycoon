CREATE TABLE financial_operations (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID NOT NULL,
   operation_type VARCHAR(64) NOT NULL,
   idempotency_key VARCHAR(128) NOT NULL,
   status VARCHAR(16) NOT NULL DEFAULT 'POSTED',
   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   CONSTRAINT financial_operations_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
   CONSTRAINT financial_operations_user_id_idempotency_key_key
      UNIQUE (user_id, idempotency_key),
   CONSTRAINT financial_operations_id_user_id_key UNIQUE (id, user_id),
   CONSTRAINT financial_operations_type_check
      CHECK (operation_type ~ '^[A-Z][A-Z0-9_]*$'),
   CONSTRAINT financial_operations_status_check CHECK (status = 'POSTED'),
   CONSTRAINT financial_operations_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE UNIQUE INDEX financial_operations_one_opening_balance_per_user
   ON financial_operations (user_id)
   WHERE operation_type = 'OPENING_BALANCE';

CREATE INDEX financial_operations_user_created_at_idx
   ON financial_operations (user_id, created_at DESC);

CREATE INDEX financial_operations_user_type_created_at_idx
   ON financial_operations (user_id, operation_type, created_at DESC);

ALTER TABLE users
   ADD COLUMN IF NOT EXISTS balance NUMERIC(20,2);

ALTER TABLE wallets
   ADD CONSTRAINT wallets_id_user_id_key UNIQUE (id, user_id),
   ADD COLUMN available_cash NUMERIC(20,2),
   ADD COLUMN reserved_cash NUMERIC(20,2);

DO $$
BEGIN
   IF EXISTS (
      SELECT 1
      FROM wallets
      WHERE balance < 0
         OR balance::text IN ('NaN', 'Infinity', '-Infinity')
         OR balance > 999999999999999999.99
   ) THEN
      RAISE EXCEPTION 'Ledger migration aborted: an existing wallet balance is invalid';
   END IF;

   IF EXISTS (
      SELECT 1
      FROM users u
      WHERE NOT EXISTS (
         SELECT 1 FROM wallets w WHERE w.user_id = u.id AND w.currency = 'USD'
      )
      AND (
         u.balance IS NULL
         OR u.balance < 0
         OR u.balance::text IN ('NaN', 'Infinity', '-Infinity')
         OR u.balance > 999999999999999999.99
      )
   ) THEN
      RAISE EXCEPTION 'Ledger migration aborted: a user without a wallet has an invalid legacy balance';
   END IF;
END;
$$;

INSERT INTO wallets (
   user_id,
   currency,
   balance,
   available_cash,
   reserved_cash
)
SELECT
   u.id,
   'USD',
   u.balance::NUMERIC(20,2),
   u.balance::NUMERIC(20,2),
   0.00
FROM users u
WHERE NOT EXISTS (
   SELECT 1 FROM wallets w WHERE w.user_id = u.id AND w.currency = 'USD'
);

UPDATE wallets
SET available_cash = balance::NUMERIC(20,2),
    reserved_cash = 0.00
WHERE available_cash IS NULL OR reserved_cash IS NULL;

ALTER TABLE wallets
   ALTER COLUMN balance SET DEFAULT 0.00,
   ALTER COLUMN available_cash SET NOT NULL,
   ALTER COLUMN available_cash SET DEFAULT 0.00,
   ALTER COLUMN reserved_cash SET NOT NULL,
   ALTER COLUMN reserved_cash SET DEFAULT 0.00,
   ADD CONSTRAINT wallets_available_cash_nonnegative_check CHECK (available_cash >= 0),
   ADD CONSTRAINT wallets_reserved_cash_nonnegative_check CHECK (reserved_cash >= 0),
   ADD CONSTRAINT wallets_available_cash_finite_check
      CHECK (available_cash::text NOT IN ('NaN', 'Infinity', '-Infinity')),
   ADD CONSTRAINT wallets_reserved_cash_finite_check
      CHECK (reserved_cash::text NOT IN ('NaN', 'Infinity', '-Infinity'));

CREATE TABLE ledger_entries (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   operation_id UUID NOT NULL,
   user_id UUID NOT NULL,
   wallet_id UUID NOT NULL,
   entry_type VARCHAR(32) NOT NULL,
   amount NUMERIC(20,2) NOT NULL,
   currency VARCHAR(3) NOT NULL DEFAULT 'USD',
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   CONSTRAINT ledger_entries_operation_owner_fkey
      FOREIGN KEY (operation_id, user_id)
      REFERENCES financial_operations(id, user_id) ON DELETE RESTRICT,
   CONSTRAINT ledger_entries_wallet_owner_fkey
      FOREIGN KEY (wallet_id, user_id)
      REFERENCES wallets(id, user_id) ON DELETE RESTRICT,
   CONSTRAINT ledger_entries_type_check
      CHECK (entry_type IN ('AVAILABLE_CASH', 'RESERVED_CASH')),
   CONSTRAINT ledger_entries_currency_check CHECK (currency = 'USD'),
   CONSTRAINT ledger_entries_amount_finite_check
      CHECK (amount::text NOT IN ('NaN', 'Infinity', '-Infinity')),
   CONSTRAINT ledger_entries_operation_wallet_type_key
      UNIQUE (operation_id, wallet_id, entry_type)
);

CREATE INDEX ledger_entries_wallet_created_at_idx
   ON ledger_entries (wallet_id, created_at, id);

CREATE INDEX ledger_entries_user_created_at_idx
   ON ledger_entries (user_id, created_at, id);

INSERT INTO financial_operations (
   user_id,
   operation_type,
   idempotency_key,
   status,
   metadata
)
SELECT
   w.user_id,
   'OPENING_BALANCE',
   'legacy-opening-balance:v1',
   'POSTED',
   jsonb_build_object('source', 'LEGACY_BACKFILL')
FROM wallets w
WHERE w.currency = 'USD'
  AND NOT EXISTS (
     SELECT 1
     FROM financial_operations existing
     WHERE existing.user_id = w.user_id
       AND existing.operation_type = 'OPENING_BALANCE'
  );

INSERT INTO ledger_entries (
   operation_id,
   user_id,
   wallet_id,
   entry_type,
   amount,
   currency
)
SELECT
   operation.id,
   operation.user_id,
   wallet.id,
   'AVAILABLE_CASH',
   wallet.available_cash,
   wallet.currency
FROM financial_operations operation
JOIN wallets wallet
   ON wallet.user_id = operation.user_id AND wallet.currency = 'USD'
WHERE operation.operation_type = 'OPENING_BALANCE'
  AND operation.idempotency_key = 'legacy-opening-balance:v1'
  AND NOT EXISTS (
     SELECT 1
     FROM ledger_entries existing
     WHERE existing.operation_id = operation.id
       AND existing.wallet_id = wallet.id
       AND existing.entry_type = 'AVAILABLE_CASH'
  );

DO $$
BEGIN
   IF EXISTS (
      SELECT 1
      FROM users u
      LEFT JOIN wallets w ON w.user_id = u.id AND w.currency = 'USD'
      LEFT JOIN financial_operations operation
         ON operation.user_id = u.id AND operation.operation_type = 'OPENING_BALANCE'
      LEFT JOIN ledger_entries entry
         ON entry.operation_id = operation.id
         AND entry.wallet_id = w.id
         AND entry.entry_type = 'AVAILABLE_CASH'
      WHERE w.id IS NULL
         OR operation.id IS NULL
         OR entry.id IS NULL
         OR entry.amount <> w.available_cash
   ) THEN
      RAISE EXCEPTION 'Ledger migration aborted: opening balance parity check failed';
   END IF;
END;
$$;

CREATE FUNCTION prevent_financial_history_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
   RAISE EXCEPTION 'Financial history is append-only; use a compensating operation';
END;
$$;

CREATE TRIGGER financial_operations_append_only
   BEFORE UPDATE OR DELETE ON financial_operations
   FOR EACH ROW EXECUTE FUNCTION prevent_financial_history_mutation();

CREATE TRIGGER ledger_entries_append_only
   BEFORE UPDATE OR DELETE ON ledger_entries
   FOR EACH ROW EXECUTE FUNCTION prevent_financial_history_mutation();

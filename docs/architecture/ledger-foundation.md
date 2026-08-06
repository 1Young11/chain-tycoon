# Ledger foundation

Chain Tycoon uses only virtual educational money. There are no deposits, withdrawals, payments, real trades, or exchange-account integrations.

## Source of truth

`ledger_entries` is the immutable explanation of every virtual cash movement. `wallets.available_cash` and `wallets.reserved_cash` are projections updated in the same PostgreSQL transaction as the operation and entries. Runtime code no longer reads `users.balance` or `wallets.balance` for financial decisions.

The two legacy balance columns remain in place. `users.balance` is untouched. `wallets.balance` is temporarily maintained as a compatibility mirror of `available_cash`, but it is not authoritative and must not be used by new code.

## Operations and idempotency

Every business action has one `financial_operations` row. The idempotency key is unique within a user, and reuse with an incompatible operation type is rejected. Each user has at most one `OPENING_BALANCE` operation. New registrations use `opening-balance:v1`; migration backfill uses `legacy-opening-balance:v1`.

Ledger and operation rows are append-only. PostgreSQL triggers reject UPDATE and DELETE. Corrections require a new compensating operation. In production the application DB role must also have no UPDATE or DELETE privilege on `financial_operations` or `ledger_entries`; role-specific grants are deliberately not embedded in the migration.

## Wallet projection and opening balance

New registration creates the user, zeroed USD wallet, `OPENING_BALANCE`, `+10000.00` entry, resulting projection, progress, and initial locations in one transaction. Existing wallets are backfilled from `wallets.balance`. A missing wallet is created only from a valid `users.balance`; there is no `$10 000` fallback. Reserved cash starts at `0.00` and exists for later reservation workflows, not as an order system.

All wallet mutations lock the wallet row and append ledger entries before updating projections in the same caller-owned transaction. The ledger and wallet services never open hidden transactions.

## Money and API boundary

PostgreSQL stores cash as `NUMERIC(20,2)`. Backend cash arithmetic uses bigint minor units and strict decimal parsing, never JavaScript floating point. Game State returns monetary fields as two-decimal strings. The frontend may format those strings for display but cannot submit a balance, fee, net worth, or final total as authoritative input.

Cookie Auth remains stateless: the verified JWT `sub` supplies the user ID, while financial state is always loaded and calculated on the backend.

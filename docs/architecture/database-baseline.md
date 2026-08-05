# Database baseline

This document records the existing local development database baseline. It does not authorize a migration run or any change to database data.

## Migration history

- `001_create_users.sql` and `002_create_game_state.sql` are already present in the local development database migration history.
- The schema created for `wallets`, `player_progress`, and `user_locations` corresponds to `002_create_game_state.sql`.
- The existing `users` table is a legacy baseline and differs from the current text of `001_create_users.sql`.

## Baseline rules

- Existing user data must be preserved.
- Applied migrations must not be rewritten retroactively.
- Future changes to `users` must be introduced by a new, additive, reviewed migration.
- `CREATE TABLE IF NOT EXISTS` only checks whether an object exists; it does not prove that the existing schema matches the migration definition.
- `users.balance` must not be removed, automatically migrated, or repurposed until a separate reviewed migration and ledger migration strategy are approved.
- Database drift must be reviewed before any later migration is applied.

This baseline intentionally contains no connection string, credentials, environment values, or existing user information.

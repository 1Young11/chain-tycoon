CREATE TABLE IF NOT EXISTS wallets (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   currency VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
   balance NUMERIC(18,2) NOT NULL DEFAULT 10000 CHECK (balance >= 0),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   UNIQUE (user_id, currency)
);

CREATE TABLE IF NOT EXISTS player_progress (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
   level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
   xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
   total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_locations (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   type VARCHAR(40) NOT NULL,
   name VARCHAR(100) NOT NULL,
   required_level INTEGER NOT NULL CHECK (required_level >= 1),
   purchase_price NUMERIC(18,2) NOT NULL CHECK (purchase_price >= 0),
   slot_capacity INTEGER NOT NULL CHECK (slot_capacity >= 0),
   used_slots INTEGER NOT NULL DEFAULT 0 CHECK (used_slots >= 0 AND used_slots <= slot_capacity),
   power_capacity_kw NUMERIC(12,2) NOT NULL CHECK (power_capacity_kw >= 0),
   power_usage_kw NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (power_usage_kw >= 0 AND power_usage_kw <= power_capacity_kw),
   cooling_capacity NUMERIC(12,2) NOT NULL CHECK (cooling_capacity >= 0),
   heat_generated NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (heat_generated >= 0),
   status VARCHAR(20) NOT NULL CHECK (status IN ('owned', 'locked', 'available')),
   is_owned BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   UNIQUE (user_id, type)
);

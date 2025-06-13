alter table public.trips
  add column automatic_booking boolean not null default false,
  add column smoking_allowed boolean not null default false,
  add column pets_allowed boolean not null default false;

-- RLS policies are not affected as we are just adding columns with defaults.
-- Existing trips will have 'false' for these new columns.

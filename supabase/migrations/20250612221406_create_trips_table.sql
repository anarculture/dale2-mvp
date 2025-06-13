-- Function to automatically update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create the trips table based on user feedback
create table public.trips (
  id uuid not null default gen_random_uuid() primary key,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  
  -- Core trip details
  origin text not null,
  destination text not null,
  departure_time timestamp with time zone not null,
  arrival_time timestamp with time zone, -- Optional ETA
  
  -- Geolocation data
  origin_lat decimal(9,6),
  origin_lng decimal(9,6),
  destination_lat decimal(9,6),
  destination_lng decimal(9,6),
  
  -- Ride details
  available_seats integer not null check (available_seats >= 0),
  price numeric(10, 2) not null check (price >= 0),
  vehicle_info text,
  description text,
  waypoints jsonb, -- Optional mid-stops
  
  -- Status and timestamps
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Add comments for clarity
comment on table public.trips is 'Stores information about ride-sharing trips.';
comment on column public.trips.arrival_time is 'Estimated time of arrival (optional).';
comment on column public.trips.waypoints is 'Optional mid-stops as a JSON array of points.';
comment on column public.trips.is_active is 'False if trip is canceled, completed, or full.';
comment on column public.trips.vehicle_info is 'Model/plate of the driver''s car.';


-- Trigger to automatically update updated_at on row modification
create trigger on_trips_updated
  before update on public.trips
  for each row
  execute procedure public.handle_updated_at();

-- Enable Row Level Security
alter table public.trips enable row level security;

-- Policies for the trips table
-- 1. Allow authenticated users to create trips
create policy "Users can create their own trips."
  on public.trips for insert
  with check ( auth.uid() = driver_id );

-- 2. Allow users to see all active trips
create policy "Active trips are viewable by everyone."
  on public.trips for select
  using ( is_active = true );

-- 3. Allow drivers to update their own trips
create policy "Drivers can update their own trips."
  on public.trips for update
  using ( auth.uid() = driver_id );

-- 4. Allow drivers to delete their own trips
create policy "Drivers can delete their own trips."
  on public.trips for delete
  using ( auth.uid() = driver_id );
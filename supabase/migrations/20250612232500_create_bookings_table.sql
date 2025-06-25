-- Enhanced bookings table for trip reservations
create table if not exists public.bookings (
    id uuid primary key default uuid_generate_v4(),
    trip_id uuid references public.trips(id) on delete cascade not null,
    passenger_id uuid references public.profiles(id) on delete cascade not null,
    status text not null default 'confirmed', -- consider using an ENUM in production
    seats_booked integer not null default 1,
    total_price numeric(10,2) not null,
    created_at timestamp with time zone default timezone('utc', now()) not null,
    updated_at timestamp with time zone default timezone('utc', now()) not null
    
);

-- Indexes for performance
create index if not exists bookings_trip_id_idx on public.bookings(trip_id);
create index if not exists bookings_passenger_id_idx on public.bookings(passenger_id);

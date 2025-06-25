-- First, let's create a test user if they don't exist
INSERT INTO auth.users (id, instance_id, email, email_confirmed_at, encrypted_password, created_at, updated_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000000',
  'testdriver@example.com',
  NOW(),
  '$2a$10$JIpV9Z1Zm5gN1bHtEsQyOe4t6p3t4wL1J8QZJ8KvX7ZvLmN1p5X6C', -- password: password123
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "testdriver@example.com", "full_name": "Test Driver"}',
  false,
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Create a profile for the test user if it doesn't exist
INSERT INTO public.profiles (id, full_name, phone, avatar_url, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Driver',
  '+584241234567',
  'https://randomuser.me/api/portraits/men/1.jpg',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample trips from Caracas to Valencia for today
WITH trip_times AS (
  SELECT 
    NOW() + (n * INTERVAL '30 minutes') as departure_time,
    NOW() + (n * INTERVAL '30 minutes') + INTERVAL '2 hours' as arrival_time
  FROM generate_series(0, 4) as n
)
INSERT INTO public.trips (
  driver_id,
  origin,
  destination,
  departure_datetime,
  arrival_time,
  available_seats,
  price_per_seat,
  vehicle_info,
  description,
  is_active,
  automatic_booking,
  smoking_allowed,
  pets_allowed,
  status,
  origin_lat,
  origin_lng,
  destination_lat,
  destination_lng,
  created_at,
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000001', -- Test Driver ID
  'Caracas',
  'Valencia',
  departure_time,
  arrival_time,
  CASE WHEN n % 2 = 0 THEN 3 ELSE 4 END, -- Alternate between 3 and 4 seats
  5.00 + (n * 0.50), -- Vary the price slightly
  CASE 
    WHEN n % 3 = 0 THEN 'Toyota Corolla, Black, ABC-1234'
    WHEN n % 3 = 1 THEN 'Honda Civic, White, XYZ-5678'
    ELSE 'Chevrolet Aveo, Red, DEF-9012'
  END,
  CASE 
    WHEN n % 2 = 0 THEN 'Direct trip with AC. No stops unless necessary.'
    ELSE 'Comfortable ride with music. Small detours possible.'
  END,
  true,
  n % 2 = 0, -- Alternate between automatic and manual booking
  n % 3 = 0, -- 1/3 of trips allow smoking
  n % 4 = 0, -- 1/4 of trips allow pets
  'scheduled',
  10.5000, -- Approx Caracas lat
  -66.9167, -- Approx Caracas lng
  10.1833, -- Approx Valencia lat
  -68.0000, -- Approx Valencia lng
  NOW(),
  NOW()
FROM (
  SELECT 
    ROW_NUMBER() OVER () as n,
    departure_time,
    arrival_time
  FROM trip_times
) as numbered_trips;

-- Output the inserted trips for verification
SELECT 
  id,
  departure_datetime,
  origin,
  destination,
  available_seats,
  price_per_seat,
  status
FROM public.trips
WHERE origin = 'Caracas' AND destination = 'Valencia'
ORDER BY departure_datetime;

-- Add status column with a default value of 'scheduled'
ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled' NOT NULL;

-- Rename price to price_per_seat to match the expected schema
ALTER TABLE public.trips RENAME COLUMN price TO price_per_seat;

-- Add any missing columns from the expected schema
ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS departure_datetime TIMESTAMPTZ;

-- Copy data from departure_time to departure_datetime if needed
UPDATE public.trips SET departure_datetime = departure_time;

-- Drop the old column if it exists
ALTER TABLE public.trips DROP COLUMN IF EXISTS departure_time;

-- Add check constraints
ALTER TABLE public.trips
ADD CONSTRAINT check_origin_destination_different CHECK (origin <> destination),
ADD CONSTRAINT check_departure_in_future CHECK (departure_datetime > now());

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_trips_origin ON public.trips (origin);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips (destination);
CREATE INDEX IF NOT EXISTS idx_trips_departure_datetime ON public.trips (departure_datetime);

-- Enable RLS and set up policies
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow public read access to scheduled trips') THEN
        DROP POLICY "Allow public read access to scheduled trips" ON public.trips;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow authenticated users to insert their own trips') THEN
        DROP POLICY "Allow authenticated users to insert their own trips" ON public.trips;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow driver to update their own trips') THEN
        DROP POLICY "Allow driver to update their own trips" ON public.trips;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow driver to delete their own trips') THEN
        DROP POLICY "Allow driver to delete their own trips" ON public.trips;
    END IF;
END $$;

-- Create new policies
CREATE POLICY "Allow public read access to scheduled trips" 
ON public.trips 
FOR SELECT 
USING (status = 'scheduled');

CREATE POLICY "Allow authenticated users to insert their own trips" 
ON public.trips 
FOR INSERT 
WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Allow driver to update their own trips" 
ON public.trips 
FOR UPDATE 
USING (auth.uid() = driver_id) 
WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Allow driver to delete their own trips" 
ON public.trips 
FOR DELETE 
USING (auth.uid() = driver_id);

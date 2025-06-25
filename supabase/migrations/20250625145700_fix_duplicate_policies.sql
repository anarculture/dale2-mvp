-- Drop duplicate policies
DO $$
BEGIN
    -- Drop the old policies that were created before
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Active trips are viewable by everyone.') THEN
        DROP POLICY "Active trips are viewable by everyone." ON public.trips;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Drivers can delete their own trips.') THEN
        DROP POLICY "Drivers can delete their own trips." ON public.trips;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Drivers can update their own trips.') THEN
        DROP POLICY "Drivers can update their own trips." ON public.trips;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Users can create their own trips.') THEN
        DROP POLICY "Users can create their own trips." ON public.trips;
    END IF;
    
    -- Ensure our standard policies exist and are correct
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow public read access to scheduled trips') THEN
        CREATE POLICY "Allow public read access to scheduled trips" 
        ON public.trips 
        FOR SELECT 
        USING (status = 'scheduled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow authenticated users to insert their own trips') THEN
        CREATE POLICY "Allow authenticated users to insert their own trips" 
        ON public.trips 
        FOR INSERT 
        WITH CHECK (auth.uid() = driver_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow driver to update their own trips') THEN
        CREATE POLICY "Allow driver to update their own trips" 
        ON public.trips 
        FOR UPDATE 
        USING (auth.uid() = driver_id) 
        WITH CHECK (auth.uid() = driver_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow driver to delete their own trips') THEN
        CREATE POLICY "Allow driver to delete their own trips" 
        ON public.trips 
        FOR DELETE 
        USING (auth.uid() = driver_id);
    END IF;
END $$;

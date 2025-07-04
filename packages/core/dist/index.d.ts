import { SupabaseClient } from '@supabase/supabase-js';

interface Trip {
    id: string;
    created_at: string;
    driver_id: string;
    origin: string;
    destination: string;
    departure_datetime: string;
    available_seats: number;
    price_per_seat: number;
    status: 'scheduled' | 'completed' | 'cancelled' | string;
    vehicle_info?: string | null;
    notes?: string | null;
}

interface SearchTripsParams {
    origin?: string;
    destination?: string;
    date?: string;
}
declare function searchTrips(supabase: SupabaseClient, // Pass your initialized Supabase client
params: SearchTripsParams): Promise<{
    data: Trip[] | null;
    error: any;
}>;

export { type SearchTripsParams, type Trip, searchTrips };

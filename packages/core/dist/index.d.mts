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

interface CreateTripData {
    origin: string;
    destination: string;
    departure_datetime: string;
    available_seats: number;
    price_per_seat: number;
    vehicle_details?: string;
    notes?: string;
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
declare function createTrip(supabase: SupabaseClient, tripData: CreateTripData): Promise<{
    data: Trip | null;
    error: any;
}>;

export { type CreateTripData, type SearchTripsParams, type Trip, createTrip, searchTrips };

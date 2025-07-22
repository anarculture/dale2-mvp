import { SupabaseClient } from '@supabase/supabase-js';
import { Trip } from '../types/trip';

export interface CreateTripData {
  origin: string;
  destination: string;
  departure_datetime: string; // ISO string
  available_seats: number;
  price_per_seat: number;
  vehicle_details?: string;
  notes?: string;
}

export interface SearchTripsParams {
  origin?: string;
  destination?: string;
  date?: string; // Expecting 'YYYY-MM-DD' format
  // Future: add pagination parameters (e.g., page, limit)
}

export async function searchTrips(
  supabase: SupabaseClient, // Pass your initialized Supabase client
  params: SearchTripsParams
): Promise<{ data: Trip[] | null; error: any }> {
  let query = supabase
    .from('trips')
    .select('*')
    .eq('status', 'scheduled'); // Initially, only show scheduled trips

  if (params.origin) {
    query = query.ilike('origin', `%${params.origin}%`);
  }
  if (params.destination) {
    query = query.ilike('destination', `%${params.destination}%`);
  }
  if (params.date) {
    const startDate = `${params.date}T00:00:00.000Z`;
    const tempDate = new Date(params.date);
    tempDate.setUTCDate(tempDate.getUTCDate() + 1);
    const endDate = `${tempDate.toISOString().split('T')[0]}T00:00:00.000Z`;

    query = query.gte('departure_datetime', startDate)
                 .lt('departure_datetime', endDate);
  }

  query = query.order('departure_datetime', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error searching trips:', error.message);
    return { data: null, error };
  }

  return { data: data as Trip[], error: null };
}

export async function createTrip(
  supabase: SupabaseClient,
  tripData: CreateTripData
): Promise<{ data: Trip | null; error: any }> {
  const { data, error } = await supabase
    .from('trips')
    .insert([{
      ...tripData,
      status: 'scheduled',
      departure_datetime: new Date(tripData.departure_datetime).toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating trip:', error.message);
    return { data: null, error };
  }

  return { data: data as Trip, error: null };
}

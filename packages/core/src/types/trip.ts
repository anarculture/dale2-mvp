export interface Trip {
  id: string; // Corresponds to UUID
  created_at: string; // Corresponds to TIMESTAMPTZ
  driver_id: string; // Corresponds to UUID (references auth.users.id)
  origin: string;
  destination: string;
  departure_datetime: string; // Corresponds to TIMESTAMPTZ
  available_seats: number;
  price_per_seat: number; // Corresponds to NUMERIC
  status: 'scheduled' | 'completed' | 'cancelled' | string; // Allow for future statuses
  vehicle_details?: string | null;
  notes?: string | null;
}

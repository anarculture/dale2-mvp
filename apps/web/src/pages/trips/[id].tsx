import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { Star, MessageSquare, AlertTriangle, Clock, MapPin, Car } from 'lucide-react';

// Define the type for a driver's profile
interface Profile {
  id: string;
  full_name: string;
  photo_url: string;
  rating: number;
  total_reviews: number;
}

// Define the type for a trip, including the driver's profile
interface Trip {
  id: string;
  created_at: string;
  driver_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price: number;
  vehicle_info: string;
  description: string;
  profiles: Profile;
  formatted_date?: {
    time: string;
    date: string;
  };
}

interface PageProps {
  trip: Trip;
}

const TripDetailsPage: NextPage<PageProps> = ({ trip: initialTrip }) => {
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const session = useSession();
  const supabase = useSupabaseClient();
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const driver = trip.profiles;
  // Use the pre-formatted date from server or create a safe date
  const departureDate = trip.departure_time ? new Date(trip.departure_time) : new Date();
  // Ensure price is a number, default to 0 if not set
  const price = typeof trip.price === 'number' ? trip.price : 0;
  
  // Format date for display (client-side fallback)
  const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) return 'Hora no disponible';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate total price
  const totalPrice = (price * bookingSeats).toFixed(2);
  const formattedTime = departureDate ? departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {trip.formatted_date?.date || 'Viaje'}
          </h1>
          <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {trip.available_seats} asientos disponibles
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <p className="text-sm font-medium text-gray-900">{trip.origin || 'Origen'}</p>
                    </div>
                    <div className="h-6 border-l-2 border-gray-200 ml-1"></div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm font-medium text-gray-900">{trip.destination || 'Destino'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{formattedTime} • {trip.available_seats} asientos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Card */}
            {driver && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conductor</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={driver.photo_url || '/default-avatar.svg'} 
                      alt={driver.full_name} 
                      className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-gray-100" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">{driver.full_name}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-700">
                            {driver.rating ? driver.rating.toFixed(1) : 'Nuevo'}
                          </span>
                        </div>
                        {driver.total_reviews > 0 && (
                          <span className="mx-2 text-gray-300">•</span>
                        )}
                        <span className="text-sm text-gray-500">
                          {driver.total_reviews || ''} {driver.total_reviews === 1 ? 'viaje' : 'viajes'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehículo</h2>
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-lg mr-4">
                  <Car className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {trip.vehicle_info || 'Sin información del vehículo'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {trip.available_seats} asientos disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {trip.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Acerca del viaje</h2>
                <p className="text-gray-600">{trip.description}</p>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reservar viaje</h2>
                <div className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                    Pasajeros
                  </label>
                  <select
                    id="passengers"
                    value={bookingSeats}
                    onChange={(e) => setBookingSeats(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={bookingLoading || trip.available_seats < 1}
                  >
                    {Array.from({ length: Math.min(10, trip.available_seats) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'pasajero' : 'pasajeros'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Precio por asiento</span>
                    <span className="font-medium">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span className="text-lg">${totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setBookingLoading(true);
                    setBookingError(null);
                    setBookingSuccess(false);
                    
                    if (!session?.user?.id) {
                      setBookingError('Debes iniciar sesión para reservar.');
                      setBookingLoading(false);
                      return;
                    }
                    
                    if (bookingSeats > trip.available_seats) {
                      setBookingError('No hay suficientes asientos disponibles.');
                      setBookingLoading(false);
                      return;
                    }
                    
                    try {
                      const totalPrice = bookingSeats * trip.price;
                    const { error } = await supabase.from('bookings').insert({
                        trip_id: trip.id,
                        passenger_id: session.user.id,
                        seats_booked: bookingSeats,
                        total_price: totalPrice,
                        status: 'pending'
                      });
                      
                      if (error) throw error;
                      
                      setBookingSuccess(true);
                      setTrip({
                        ...trip,
                        available_seats: trip.available_seats - bookingSeats
                      });
                      
                      // Show success message
                      setTimeout(() => setBookingSuccess(false), 3000);
                    } catch (error) {
                      console.error('Booking error:', error);
                      setBookingError('No se pudo completar la reserva. Intenta de nuevo.');
                    } finally {
                      setBookingLoading(false);
                    }
                  }}
                  disabled={bookingLoading || trip.available_seats < 1}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    bookingLoading || trip.available_seats < 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {bookingLoading
                    ? 'Procesando...'
                    : trip.available_seats < 1
                    ? 'Sin asientos disponibles'
                    : 'Solicitar reserva'}
                </button>

                {bookingError && (
                  <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="mt-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    ¡Solicitud de reserva enviada! El conductor confirmará pronto.
                  </div>
                )}

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Al reservar, aceptas nuestros Términos de servicio y Política de privacidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  // Create authenticated Supabase client for server-side
  const supabase = createServerSupabaseClient(context);

  // First, get the trip
  const { data: tripData, error: tripError } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();

  if (tripError || !tripData) {
    return {
      notFound: true, // This will render the 404 page
    };
  }

  // Then get the driver's profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, photo_url, rating, total_reviews')
    .eq('id', tripData.driver_id)
    .single();

  // Format the date on the server
  const formatServerDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  // Get the departure date
  const departureDate = formatServerDate(tripData.departure_time);
  
  // Format date for consistent rendering
  const formatDate = (date: Date) => ({
    time: date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/New_York' // Ensure consistent timezone
    }),
    date: date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      timeZone: 'America/New_York' // Ensure consistent timezone
    })
  });

  const formattedDate = formatDate(departureDate);
  
  // Combine and normalize the data
  const tripWithProfile = {
    ...tripData,
    // Ensure all required fields have default values
    origin: tripData.origin || '',
    destination: tripData.destination || '',
    departure_time: departureDate.toISOString(),
    available_seats: Number(tripData.available_seats) || 0,
    price: Number(tripData.price_per_seat) || 0,
    profiles: profileData || null,
    // Add pre-formatted date strings
    formatted_date: formattedDate
  };

  return {
    props: {
      trip: tripWithProfile,
    },
  };
};

// Add proper type for the return value
export const config = {
  runtime: 'nodejs',
};

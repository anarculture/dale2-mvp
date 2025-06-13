import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  profiles: Profile | null; // Joined profile data
}

interface PageProps {
  trip: Trip;
}

const TripDetailsPage: NextPage<PageProps> = ({ trip: initialTrip }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const driver = trip.profiles;
  const departureDate = new Date(trip.departure_time);


  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">
          {departureDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-4 mt-1 text-gray-400" />
                <div>
                  <p className="font-semibold">{departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-gray-300">{trip.origin}</p>
                </div>
              </div>
              <div className="border-l-2 border-dashed border-gray-700 ml-2 my-2 h-8"></div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-4 mt-1 text-gray-400" />
                <div>
                  <p className="font-semibold">{trip.destination}</p>
                </div>
              </div>
            </div>

            {driver && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={driver.photo_url || '/default-avatar.svg'} alt={driver.full_name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-lg">{driver.full_name}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{driver.rating.toFixed(1)} &middot; {driver.total_reviews} reseñas</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/user/${driver.id}`} className="text-blue-400 hover:text-blue-300 text-2xl font-bold">&rsaquo;</Link>
                </div>
                <div className="border-t border-gray-700 my-4"></div>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contactar a {driver.full_name.split(' ')[0]}
                </button>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Pasajeros</h2>
              <p className="text-gray-400">No hay otros pasajeros en este viaje todavía.</p>
            </div>

            <div className="text-center mt-4">
              <a href="#" className="text-red-400 hover:underline flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Reportar viaje
              </a>
            </div>
          </div>

          {/* Right Column (Booking Widget) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <div className="flex justify-between items-start mb-4">
                 <h2 className="text-xl font-bold">{departureDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                 <Car className="w-8 h-8 text-gray-400" />
              </div>
              {driver && (
                <div className="flex items-center my-4">
                  <img src={driver.photo_url || '/default-avatar.svg'} alt={driver.full_name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{driver.full_name}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{driver.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-t border-gray-700 my-4"></div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label htmlFor="seats" className="block text-gray-400 text-sm mb-1">Pasajeros</label>
                  <select
                    id="seats"
                    value={bookingSeats}
                    onChange={e => setBookingSeats(Number(e.target.value))}
                    className="bg-gray-900 text-white rounded-md px-2 py-1 border border-gray-700 focus:outline-none"
                    disabled={bookingLoading || (trip.available_seats < 1)}
                  >
                    {Array.from({ length: Math.max(trip.available_seats, 1) }, (_, i) => i + 1).map(seat => (
                      <option key={seat} value={seat}>{seat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold">${(trip.price * bookingSeats).toFixed(2)}</p>
                </div>
              </div>
              <button
                className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg ${bookingLoading || trip.available_seats < 1 ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                  // Insert booking
                  const { error } = await supabase.from('bookings').insert({
                    trip_id: trip.id,
                    passenger_id: session.user.id,
                    seats_booked: bookingSeats,
                    status: 'confirmed'
                  });
                  if (error) {
                    setBookingError('No se pudo completar la reserva. Intenta de nuevo.');
                  } else {
                    setBookingSuccess(true);
                    setTrip({ ...trip, available_seats: trip.available_seats - bookingSeats });
                  }
                  setBookingLoading(false);
                }}
                disabled={bookingLoading || trip.available_seats < 1}
              >
                {bookingLoading ? 'Reservando...' : trip.available_seats < 1 ? 'Sin asientos' : 'Reservar'}
              </button>
              {bookingError && <p className="text-red-400 mt-2 text-center">{bookingError}</p>}
              {bookingSuccess && <p className="text-green-400 mt-2 text-center">¡Reserva confirmada!</p>}
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

  const { data, error } = await supabase
    .from('trips')
    .select('*, profiles(id, full_name, photo_url, rating, total_reviews)')
    .eq('id', id)
    .single();

  if (error || !data) {
    return {
      notFound: true, // This will render the 404 page
    };
  }

  return {
    props: {
      trip: data,
    },
  };
};

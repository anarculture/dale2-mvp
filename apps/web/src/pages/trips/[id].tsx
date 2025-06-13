import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
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

const TripDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (error) {
        setError('Trip not found or an error occurred.');
        console.error('Error fetching trip:', error);
      } else {
        setTrip(data as Trip);
      }
      setLoading(false);
    };

    fetchTrip();
  }, [id]);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!trip) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Trip not found.</div>;
  }

  const driver = trip.profiles;
  const departureDate = new Date(trip.departure_time);
  const arrivalDate = new Date(departureDate.getTime() + (6.16 * 60 * 60 * 1000)); // Placeholder for travel time

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
                  <p className="font-semibold">{arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-gray-300">{trip.destination}</p>
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
              <div className="flex justify-between items-center">
                <p className="text-gray-300">1 pasajero</p>
                <p className="text-2xl font-bold">${trip.price.toFixed(2)}</p>
              </div>
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;

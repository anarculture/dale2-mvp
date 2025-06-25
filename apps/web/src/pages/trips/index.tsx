import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import type { Trip } from '@dale/core'; // Use shared Trip type
import AutocompleteInput from '../../components/AutocompleteInput';

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// Extend Trip type to include nested profile data for the component
type TripWithProfile = Trip & {
  profiles: {
    id: string;
    full_name: string;
    photo_url: string;
  } | null;
};

const TripsListPage: NextPage = () => {
  const [trips, setTrips] = useState<TripWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  // Filter/Sort state
  const [sortBy, setSortBy] = useState('departure_datetime');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const orderOptions = sortBy === 'price_per_seat' 
        ? { column: 'price_per_seat', ascending: true } 
        : { column: 'departure_datetime', ascending: true };

      let query = supabase
        .from('trips')
        .select('*, profiles(id, full_name, photo_url)') // Fetch related profile
        .eq('status', 'scheduled') // Only show scheduled trips
        .gte('available_seats', passengers)
        .order(orderOptions.column, { ascending: orderOptions.ascending });

      if (origin) query = query.ilike('origin', `%${origin}%`);
      if (destination) query = query.ilike('destination', `%${destination}%`);

      if (departureDate) {
        const startDate = new Date(departureDate);
        const endDate = new Date(departureDate);
        endDate.setDate(endDate.getDate() + 1);
        if (!isNaN(startDate.getTime())) {
            query = query.gte('departure_datetime', startDate.toISOString()).lt('departure_datetime', endDate.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setTrips(data as TripWithProfile[]);

    } catch (e: any) {
      console.error('A critical error occurred while fetching trips:', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when sortBy changes
  useEffect(() => {
    fetchTrips();
  }, [sortBy]);

  // Handle manual search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto p-4">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Leaving from</label>
                    <AutocompleteInput id="origin" value={origin} onValueChange={setOrigin} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800" />
                </div>
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Going to</label>
                    <AutocompleteInput id="destination" value={destination} onValueChange={setDestination} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800" />
                </div>
                <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="departureDate" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Passengers</label>
                    <input type="number" id="passengers" min="1" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Search</button>
            </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar for Filters */}
        <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">Sort by</h3>
                <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="sort" value="departure_datetime" checked={sortBy === 'departure_datetime'} onChange={() => setSortBy('departure_datetime')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Earliest departure</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="sort" value="price_per_seat" checked={sortBy === 'price_per_seat'} onChange={() => setSortBy('price_per_seat')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Lowest price</span>
                    </label>
                </div>
            </div>
        </aside>

        {/* Main Content for Trip List */}
        <main className="lg:col-span-3">
            {loading ? (
                <p className="text-center">Loading trips...</p>
            ) : (
                <div className="space-y-4">
                  {trips.length > 0 ? (
                    trips.map((trip) => (
                      <Link href={`/trips/${trip.id}`} key={trip.id} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                        <div className="grid grid-cols-5 gap-4 items-center">
                            {/* Time and Location */}
                            <div className="col-span-3 flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatTime(trip.departure_datetime)}</p>
                                    <p className="text-sm text-gray-600">{trip.origin}</p>
                                </div>
                                <div className="flex-grow text-center">
                                    <div className="bg-gray-200 h-0.5 w-full"></div>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg">{trip.destination}</p>
                                </div>
                            </div>
                            {/* Driver Info */}
                            <div className="col-span-1 text-center">
                                {trip.profiles ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <img src={trip.profiles.photo_url || '/default-avatar.png'} alt={trip.profiles.full_name} className="w-10 h-10 rounded-full mb-1" />
                                        <p className="text-sm text-gray-700">{trip.profiles.full_name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 rounded-full mb-1 bg-gray-200"></div>
                                        <p className="text-sm text-gray-500">No driver info</p>
                                    </div>
                                )}
                            </div>
                            {/* Price */}
                            <div className="col-span-1 text-right">
                                <p className="text-2xl font-bold text-blue-600">${trip.price_per_seat.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">per seat</p>
                            </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold text-gray-800">No trips found</h3>
                        <p className="text-gray-600 mt-2">Try adjusting your search criteria or check back later!</p>
                    </div>
                  )}
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default TripsListPage;

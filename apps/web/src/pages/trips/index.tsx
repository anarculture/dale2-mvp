import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { Star, Moon } from 'lucide-react';
import AutocompleteInput from '../../components/AutocompleteInput';

interface Trip {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string; 
  available_seats: number;
  price: number;
  profiles: {
    id: string;
    full_name: string;
    photo_url: string;
    rating: number;
    total_reviews: number;
  };
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const getDuration = (start: string, end: string) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h${diffMins.toString().padStart(2, '0')}`;
};

const TripsListPage: NextPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [origin, setOrigin] = useState('Caracas');
  const [destination, setDestination] = useState('Maracaibo');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [sortBy, setSortBy] = useState('departure_time');
  const [filterAutomaticBooking, setFilterAutomaticBooking] = useState(false);
  const [filterSmokingAllowed, setFilterSmokingAllowed] = useState(false);
  const [filterPetsAllowed, setFilterPetsAllowed] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const orderOptions = sortBy === 'price' 
        ? { column: 'price', ascending: true } 
        : { column: 'departure_time', ascending: true };

      let query = supabase
        .from('trips')
        .select('*, profiles(id, full_name, photo_url, rating, total_reviews)')
        .eq('is_active', true)
        .gte('available_seats', passengers)
        .order(orderOptions.column, { ascending: orderOptions.ascending });

      if (origin) query = query.ilike('origin', `%${origin}%`);
      if (destination) query = query.ilike('destination', `%${destination}%`);

      if (filterAutomaticBooking) query = query.eq('automatic_booking', true);
      if (filterSmokingAllowed) query = query.eq('smoking_allowed', true);
      if (filterPetsAllowed) query = query.eq('pets_allowed', true);

      if (departureDate) {
        const startDate = new Date(departureDate);
        const endDate = new Date(departureDate);
        endDate.setDate(endDate.getDate() + 1);
        if (!isNaN(startDate.getTime())) {
            query = query.gte('departure_time', startDate.toISOString()).lt('departure_time', endDate.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setTrips(data as any as Trip[]);

    } catch (e: any) {
      console.error('A critical error occurred while fetching trips:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [sortBy, filterAutomaticBooking, filterSmokingAllowed, filterPetsAllowed]); // Refetch when sortBy or filters change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
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
                        <input type="radio" name="sort" value="departure_time" checked={sortBy === 'departure_time'} onChange={() => setSortBy('departure_time')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Earliest departure</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="sort" value="price" checked={sortBy === 'price'} onChange={() => setSortBy('price')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Lowest price</span>
                    </label>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">Services</h3>
                <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={filterAutomaticBooking} onChange={(e) => setFilterAutomaticBooking(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Automatic booking</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={filterSmokingAllowed} onChange={(e) => setFilterSmokingAllowed(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Smoking allowed</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={filterPetsAllowed} onChange={(e) => setFilterPetsAllowed(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">Pets allowed</span>
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
                    trips.map((trip) => {
                        const departure = new Date(trip.departure_time);
                        const arrival = new Date(trip.arrival_time);
                        const duration = getDuration(trip.departure_time, trip.arrival_time);
                        return (
                            <Link href={`/trips/${trip.id}`} key={trip.id} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                                <div className="grid grid-cols-5 gap-4 items-center">
                                    {/* Time and Location */}
                                    <div className="col-span-3 flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{formatTime(departure)}</p>
                                            <p className="text-sm text-gray-600">{trip.origin}</p>
                                        </div>
                                        <div className="flex-grow text-center">
                                            <div className="text-xs text-gray-500">{duration}</div>
                                            <div className="bg-gray-200 h-0.5 w-full relative my-1">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                                            </div>
                                            <Moon size={14} className="mx-auto text-gray-500"/>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-lg">{formatTime(arrival)}</p>
                                            <p className="text-sm text-gray-600">{trip.destination}</p>
                                        </div>
                                    </div>
                                    {/* Driver Info */}
                                    <div className="col-span-1 text-center">
                                        {trip.profiles && (
                                            <div className="flex flex-col items-center space-y-1">
                                                <img src={trip.profiles.photo_url || '/default-avatar.svg'} alt={trip.profiles.full_name} className="w-10 h-10 rounded-full" />
                                                <span className="text-sm font-medium">{trip.profiles.full_name}</span>
                                                <div className="flex items-center text-sm">
                                                    <Star size={14} className="text-yellow-500 mr-1"/> {trip.profiles.rating?.toFixed(1) || 'New'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Price */}
                                    <div className="col-span-1 text-right">
                                        <p className="text-2xl font-bold text-blue-600">${trip.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">per seat</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-center py-12 bg-gray-100 rounded-lg">
                        <h3 className="text-xl font-semibold">No trips match your search.</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
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

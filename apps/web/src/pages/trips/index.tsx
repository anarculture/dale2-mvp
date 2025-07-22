import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { searchTrips } from '@dale/core/api/tripsApi';
import type { Trip } from '@dale/core'; // Use shared Trip type
import AutocompleteInput from '../../components/AutocompleteInput';
import TripCard, { TripWithProfile } from '../../components/trip/TripCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper functions to format date and time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short' });
};

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-VE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Type is now imported from TripCard component

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
  const [filteredCount, setFilteredCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

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
      if (data) {
        setTrips(data as TripWithProfile[]);
        setFilteredCount(data.length);
        setTotalCount(data.length); // In a real app, we'd get the total count from the server
      }

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
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Viajes disponibles</h1>
              <Link href="/trips/new" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear viaje
              </Link>
            </div>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origen</label>
                    <AutocompleteInput 
                      id="origin" 
                      value={origin} 
                      onValueChange={setOrigin} 
                      placeholder="¿Desde dónde sales?" 
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800" 
                    />
                </div>
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino</label>
                    <AutocompleteInput 
                      id="destination" 
                      value={destination} 
                      onValueChange={setDestination} 
                      placeholder="¿Hacia dónde vas?" 
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800" 
                    />
                </div>
                <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input 
                      type="date" 
                      id="departureDate" 
                      value={departureDate} 
                      onChange={(e) => setDepartureDate(e.target.value)} 
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                    />
                </div>
                <div>
                    <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Pasajeros</label>
                    <input 
                      type="number" 
                      id="passengers" 
                      min="1" 
                      value={passengers} 
                      onChange={(e) => setPassengers(Number(e.target.value))} 
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                    />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar
                </button>
            </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar for Filters */}
        <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">Ordenar por</h3>
                <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="sort" 
                          value="departure_datetime" 
                          checked={sortBy === 'departure_datetime'} 
                          onChange={() => setSortBy('departure_datetime')} 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="ml-3 text-gray-700">Salida más próxima</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="sort" 
                          value="price_per_seat" 
                          checked={sortBy === 'price_per_seat'} 
                          onChange={() => setSortBy('price_per_seat')} 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                        />
                        <span className="ml-3 text-gray-700">Precio más bajo</span>
                    </label>
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">Rango de precio</h3>
                <div className="px-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">${priceRange[0]}</span>
                        <span className="text-sm text-gray-600">${priceRange[1]}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">Resultados</h3>
                <p className="text-gray-600">
                    Mostrando <span className="font-semibold">{filteredCount}</span> de <span className="font-semibold">{totalCount}</span> viajes
                </p>
            </div>
        </aside>

        {/* Main Content for Trip List */}
        <main className="lg:col-span-3">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-600">Cargando viajes...</p>
                </div>
            ) : (
                <div className="space-y-4">
                  {trips.length > 0 ? (
                    <>
                      <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <p className="text-sm text-gray-600">
                          {filteredCount} {filteredCount === 1 ? 'viaje encontrado' : 'viajes encontrados'} 
                          {departureDate && (
                            <> para el <span className="font-medium">
                              {format(new Date(departureDate), "EEEE d 'de' MMMM", { locale: es })}
                            </span>
                            </>
                          )}
                          {origin && (
                            <> desde <span className="font-medium">{origin}</span></>
                          )}
                          {destination && (
                            <> hacia <span className="font-medium">{destination}</span></>
                          )}
                        </p>
                      </div>
                      
                      {trips
                        .filter(trip => trip.price_per_seat >= priceRange[0] && trip.price_per_seat <= priceRange[1])
                        .map((trip) => (
                          <TripCard key={trip.id} trip={trip} />
                        ))
                      }
                    </>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800">No se encontraron viajes</h3>
                        <p className="text-gray-600 mt-2">Intenta ajustar tus criterios de búsqueda o vuelve más tarde.</p>
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

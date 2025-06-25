import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

import AutocompleteInput from '../../components/AutocompleteInput';

const NewTrip: NextPage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState(1);
  const [price, setPrice] = useState(10);
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [description, setDescription] = useState('');
  const [automaticBooking, setAutomaticBooking] = useState(false);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session === undefined) {
      setIsLoadingSession(true); // Still loading
    } else {
      setIsLoadingSession(false); // Loaded (either session object or null)
      if (session === null) {
        router.push('/login'); // Not logged in, redirect
      }
    }
  }, [session, router]);

  // Render loading indicator or null while session is loading or redirecting
  if (isLoadingSession || (session === null && !isLoadingSession) ) {
    // if session is null and not loading, it means redirect is in progress or should happen
    return <div>Loading session...</div>; // Or a spinner, or null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Explicit check for session and session.user
    if (!session || !session.user) {
      setError('You must be logged in to post a trip. Please refresh or log in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from('trips').insert([
      {
        driver_id: session.user.id,
        origin: origin,
        destination: destination,
        departure_datetime: departureTime,
        available_seats: availableSeats,
        price_per_seat: price,
        vehicle_details: vehicleInfo,
        notes: description
      },
    ]).select();

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Redirect to the new trip's page or a confirmation page
      router.push(`/trips/${data[0].id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Trip</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
            <AutocompleteInput id="origin" value={origin} onValueChange={setOrigin} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
            <AutocompleteInput id="destination" value={destination} onValueChange={setDestination} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Departure Time</label>
          <input type="datetime-local" id="departureTime" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">Available Seats</label>
            <input type="number" id="availableSeats" min="1" value={availableSeats} onChange={(e) => setAvailableSeats(parseInt(e.target.value, 10))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per Seat ($)</label>
            <input type="number" id="price" min="0" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label htmlFor="vehicleInfo" className="block text-sm font-medium text-gray-700">Vehicle Info (e.g., Toyota Camry, ABC-123)</label>
          <input type="text" id="vehicleInfo" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>



        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Posting...' : 'Post Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTrip;

import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useTranslation } from 'react-i18next';
import { Ban, Calendar, CheckCircle, ChevronRight, MessageSquare, Music, PawPrint, PlusCircle, Wind, DollarSign, MapPin, Users } from 'lucide-react';

interface Booking {
  id: string;
  trip_id: string;
  passenger_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  seats_booked: number;
  total_price: number;
  created_at: string;
  trips: { // Nested trip details
    id: string;
    origin: string;
    destination: string;
    departure_datetime: string;
    driver_id: string;
  };
}

interface Trip {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  departure_datetime: string;
  available_seats: number;
  price_per_seat: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  // Add other relevant trip fields if needed
}

const Profile: NextPage = () => {
  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setAuthBirthDate] = useState(''); // Renamed to avoid conflict
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripsError, setTripsError] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      const { user_metadata } = user;
      setName(user_metadata.name || '');
      setLastName(user_metadata.last_name || '');
      setBio(user_metadata.bio || '');
      setAuthBirthDate(user_metadata.birth_date || '');
      if (user_metadata.avatar_url) {
        downloadImage(user_metadata.avatar_url);
      }
    } else if (!user && session === null) { // only redirect if no user and session has loaded
      router.push('/login');
    }
  }, [session, router, user]);

  // Fetch user bookings
  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      setLoadingBookings(true);
      setBookingsError(null);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, trip_id, passenger_id, status, seats_booked, total_price, created_at,
          trips (id, origin, destination, departure_datetime, driver_id)
        `)
        .eq('passenger_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        setBookingsError(error.message);
        setBookings([]);
      } else {
        setBookings(data as Booking[]);
      }
      setLoadingBookings(false);
    }
    fetchBookings();
  }, [user, supabase]);

  // Fetch user trips (as a driver)
  useEffect(() => {
    async function fetchTrips() {
      if (!user) return;
      setLoadingTrips(true);
      setTripsError(null);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('driver_id', user.id)
        .order('departure_datetime', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        setTripsError(error.message);
        setTrips([]);
      } else {
        setTrips(data as Trip[]);
      }
      setLoadingTrips(false);
    }
    fetchTrips();
  }, [user, supabase]);


  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', (error as Error).message);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user!.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      // Update the public profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: filePath })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      // Also update the user's auth metadata for consistency
            // Also update the user's auth metadata for consistency
      await supabase.auth.updateUser({ data: { avatar_url: filePath } });

      downloadImage(filePath);
      setMessage(t('profile.avatarUpdateSuccess'));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    if (!confirm(t('profile.confirmCancelBooking'))) return;
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      if (error) throw error;
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      setMessage(t('profile.bookingCancelSuccess'));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(t('profile.bookingCancelError'));
    }
  }

  async function handleCancelTrip(tripId: string) {
    if (!confirm(t('profile.confirmCancelTrip'))) return;
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: 'cancelled' })
        .eq('id', tripId);
      if (error) throw error;
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t));
      setMessage(t('profile.tripCancelSuccess'));
    } catch (err) {
      console.error('Error cancelling trip:', err);
      setError(t('profile.tripCancelError'));
    }
  }

  if (!session || !user) return null;

  const completion = (Number(!!name) + Number(!!avatarUrl) + Number(!!user.email)) / 3 * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href={user ? `/user/${user.id}` : '#'}>
          <div className="flex items-center justify-between p-4 bg-white rounded-t-lg shadow-sm cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <img src={avatarUrl || `https://avatar.vercel.sh/${user.email}`} alt="Avatar" className="w-20 h-20 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{`${name} ${lastName}`.trim() || 'New User'}</h1>
                <p className="text-gray-500">Intermediate</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </Link>

        <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
          <p className="font-bold">Complete your profile</p>
          <p className="text-sm text-gray-600">This helps build trust and encourages members to travel with you.</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
            <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${completion}%` }}></div>
          </div>
          <label htmlFor="avatar-upload" className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload a profile picture'}
          </label>
          <input id="avatar-upload" type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" />
        </div>

        <div className="p-4 bg-white space-y-4 shadow-sm">
          <Link href="/profile/edit" className="text-blue-600">
            Modify your personal information
          </Link>
        </div>

        <div className="mt-6">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Verify your profile</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-blue-600"><PlusCircle className="w-5 h-5" /><span>Verify identification</span></li>
              <li className="flex items-center space-x-3 text-green-600"><CheckCircle className="w-5 h-5" /><span>{user.email}</span></li>
              <li className="flex items-center space-x-3 text-green-600"><CheckCircle className="w-5 h-5" /><span>+525522501196 (placeholder)</span></li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-2">Personal Information</h2>
            <p className="text-gray-600 italic mb-4">{bio || 'No bio yet. Add one!'}</p>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3"><MessageSquare className="w-5 h-5 text-gray-500" /><span>I'm chatty when I feel comfortable</span></li>
              <li className="flex items-center space-x-3"><Music className="w-5 h-5 text-gray-500" /><span>Playlists are the best!</span></li>
              <li className="flex items-center space-x-3"><Wind className="w-5 h-5 text-gray-500" /><span>Smoking is allowed</span></li>
              <li className="flex items-center space-x-3"><PawPrint className="w-5 h-5 text-gray-500" /><span>Pets are welcome</span></li>
            </ul>
            <button className="mt-4 text-blue-600">Modify your travel preferences</button>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Vehicles</h2>
            <button className="flex items-center space-x-2 text-blue-600"><PlusCircle className="w-5 h-5" /><span>Add a car</span></button>
          </div>

          {/* My Bookings Section */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">{t('profile.myBookings')}</h2>
            {loadingBookings ? (
              <p>{t('common.loading')}</p>
            ) : bookingsError ? (
              <p className="text-red-500">{bookingsError}</p>
            ) : bookings.length === 0 ? (
              <p>{t('profile.noBookings')}</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-medium">
                        {booking.trips?.origin} <ChevronRight className="inline-block w-4 h-4" /> {booking.trips?.destination}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateTime(new Date(booking.trips?.departure_datetime || ''))}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {t('profile.totalPrice', { price: booking.total_price })}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {t('profile.seatsBooked', { seats: booking.seats_booked })}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      {booking.status === 'cancelled' ? (
                        <span className="text-red-500 font-medium">{t('common.cancelled')}</span>
                      ) : (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          {t('common.cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Trips Section */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">{t('profile.myTrips')}</h2>
            {loadingTrips ? (
              <p>{t('common.loading')}</p>
            ) : tripsError ? (
              <p className="text-red-500">{tripsError}</p>
            ) : trips.length === 0 ? (
              <p>{t('profile.noTrips')}</p>
            ) : (
              <div className="space-y-4">
                {trips.map(trip => (
                  <div key={trip.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-medium">
                        {trip.origin} <ChevronRight className="inline-block w-4 h-4" /> {trip.destination}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateTime(new Date(trip.departure_datetime))}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {t('profile.pricePerSeat', { price: trip.price_per_seat })}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {t('profile.availableSeats', { seats: trip.available_seats })}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      {trip.status === 'cancelled' ? (
                        <span className="text-red-500 font-medium">{t('common.cancelled')}</span>
                      ) : (
                        <button
                          onClick={() => handleCancelTrip(trip.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          {t('common.cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Profile;

// Helper function for date and time formatting
const formatDateTime = (date: Date) => {
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};






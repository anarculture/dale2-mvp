import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';
import Avatar from '../components/Avatar';

const Profile: NextPage = () => {
  const { session } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      setName(session.user.user_metadata.name || '');
    } else {
      router.push('/login');
    }
  }, [session, router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({
      data: { name },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (url: string) => {
    const { error } = await supabase.auth.updateUser({
      data: { avatar_url: url },
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Avatar updated successfully!');
    }
  };

  if (!session) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Your Profile</h1>

        <Avatar session={session} onUpload={handleAvatarUpload} />

        <form onSubmit={handleUpdateProfile} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <p className="text-gray-900">{session.user.email}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Profile;



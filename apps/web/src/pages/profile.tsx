import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from '../lib/SessionContext';

const Profile: NextPage = () => {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Your Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold">Full Name</label>
            <p className="text-gray-900">{session.user.user_metadata.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold">Email Address</label>
            <p className="text-gray-900">{session.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

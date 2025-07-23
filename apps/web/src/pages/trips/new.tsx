import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

import CreateTripForm from '../../components/trip/CreateTripForm';

const NewTrip: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (session === null) {
      router.push('/login?redirectedFrom=/trips/new');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Crear un Nuevo Viaje</h1>
          <p className="mt-2 text-sm text-gray-600">
            Comparte tu viaje y ahorra en costos de transporte
          </p>
        </div>
        
        <CreateTripForm />
      </div>
    </div>
  );
};

export default NewTrip;

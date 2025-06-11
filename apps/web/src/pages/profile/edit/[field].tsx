import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from '../../../lib/SessionContext';
import { supabase } from '../../../lib/supabaseClient';
import { ChevronLeft, X } from 'lucide-react';

const fieldLabels: { [key: string]: string } = {
  name: '¿Tu nombre?',
  last_name: '¿Tus apellidos?',
  birth_date: '¿Tu fecha de nacimiento?',
  bio: 'Tu biografía',
  phone: '¿Tu número de teléfono?',
};

const EditFieldPage: NextPage = () => {
  const router = useRouter();
  const { field } = router.query;
  const { session } = useSession();

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session && field) {
      const fieldValue = session.user.user_metadata[field as string];
      setValue(fieldValue || '');
    } else if (!session) {
      router.push('/login');
    }
  }, [session, field, router]);

  const handleSave = async () => {
    if (!field) return;

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({ data: { [field as string]: value } });
      if (updateError) throw updateError;
      // Force a session refresh is tricky, for now we just navigate back
      // A proper solution might involve a global state invalidation
      router.push('/profile/edit');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!field) {
    return <div>Loading...</div>; // Or redirect
  }

  const label = fieldLabels[field as string] || 'Edit Information';
  const isTextarea = field === 'bio';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </header>
      <main className="flex-grow max-w-2xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-6">{label}</h1>
        <div className="relative">
          {isTextarea ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            />
          ) : (
            <input
              type={field === 'birth_date' ? 'date' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
          )}
          {value && (
            <button onClick={() => setValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
      <footer className="p-4 border-t sticky bottom-0 bg-white">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EditFieldPage;

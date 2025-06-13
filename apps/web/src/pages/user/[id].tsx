import { GetServerSideProps, NextPage } from 'next';
import { CheckCircle, MessageSquare, Music, PawPrint, Search, Star, Wind } from 'lucide-react';
import { calculateAge } from '../../utils/helpers';
import { supabase } from '../../lib/supabaseClient';

// L'interfaccia `Profile` riflette la tabella `public.profiles`
// dopo la migrazione `update_profiles_table.sql`.
interface Profile {
  id: string;
  name: string;
  last_name: string;
  bio: string;
  birth_date: string;
  avatar_url: string;
  email_confirmed_at: string;
  phone_confirmed_at: string;
}

interface PublicProfilePageProps {
  profile: Profile | null;
  error?: string;
}

const PublicProfilePage: NextPage<PublicProfilePageProps> = ({ profile, error }) => {
  if (error) {
    return (
        <div className="text-center p-8">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-600">Please check the Supabase setup instructions.</p>
        </div>
    );
  }

  if (!profile) {
    return <div>User not found.</div>;
  }

  const age = profile.birth_date ? calculateAge(new Date(profile.birth_date)) : null;

  return (
    <div className="bg-white min-h-screen">
      <header className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="text-2xl font-bold text-blue-500">DALE</div>
        <Search className="w-6 h-6 text-gray-500" />
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <section className="flex items-center space-x-4 mb-6">
          <img
            src={profile.avatar_url || `https://avatar.vercel.sh/${profile.id}`}
            alt="Profile"
            className="w-24 h-24 rounded-full bg-gray-200 object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            {age && <p className="text-gray-500">{age} años</p>}
          </div>
        </section>

        <section className="border-t border-b py-4 mb-6">
          <p>Nivel de experiencia: Intermedio</p>
          <div className="flex items-center space-x-2 text-gray-600 mt-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>4/5 - 2 reseñas</span>
            <span className="text-blue-500 ml-auto cursor-pointer">{'>'}</span>
          </div>
        </section>

        <section className="space-y-3 mb-6">
          {profile.email_confirmed_at && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>E-mail confirmado</span>
            </div>
          )}
          {profile.phone_confirmed_at && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Número de teléfono confirmado</span>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Acerca de {profile.name}</h2>
          <p className="text-gray-700 mb-4">{profile.bio || 'No bio provided.'}</p>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3"><MessageSquare className="w-5 h-5 text-gray-500" /><span>Platico cuando me siento en confianza</span></li>
            <li className="flex items-center space-x-3"><Music className="w-5 h-5 text-gray-500" /><span>¡Las playlists son la neta!</span></li>
            <li className="flex items-center space-x-3"><Wind className="w-5 h-5 text-gray-500" /><span>Se permite fumar</span></li>
            <li className="flex items-center space-x-3"><PawPrint className="w-5 h-5 text-gray-500" /><span>Bienvenidos perrhijos, gatijos y demás mascotas</span></li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  // This call requires a public `profiles` table with RLS enabled.
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id as string)
    .single();

  if (error && !profile) {
    console.error('Error fetching public profile:', error.message);
    return {
      props: {
        profile: null,
        error: 'Could not fetch user profile. Please ensure a public `profiles` table exists and Row Level Security is configured correctly.',
      },
    };
  }

  return {
    props: {
      profile,
      error: null,
    },
  };
};

export default PublicProfilePage;

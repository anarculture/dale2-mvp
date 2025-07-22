import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log('Error logging out:', error.message);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {t('common.appName')}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/trips/new" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <PlusCircle className="w-5 h-5 mr-1" /> 
                  {t('trips.createTrip')}
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                  {t('navigation.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  {t('navigation.logout')}
                </button>
                {/* Language switcher temporarily hidden for Spanish-only MVP */}
                {/* <LanguageSwitcher /> */}
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  {t('navigation.login')}
                </Link>
                <Link href="/signup" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">
                  {t('navigation.register')}
                </Link>
                {/* Language switcher temporarily hidden for Spanish-only MVP */}
                {/* <LanguageSwitcher /> */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

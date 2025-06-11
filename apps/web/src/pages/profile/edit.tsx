import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from '../../lib/SessionContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EditProfilePage: NextPage = () => {
  const { session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (session) {
      setProfile(session.user.user_metadata);
    } else {
      router.push('/login');
    }
  }, [session, router]);

  if (!profile) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  const personalInfoFields = [
    { label: 'Nombre', value: profile.name, field: 'name' },
    { label: 'Apellidos', value: profile.last_name, field: 'last_name' },
    { label: 'Fecha de nacimiento', value: profile.birth_date, field: 'birth_date' },
    { label: 'E-mail', value: session?.user.email, field: 'email', nonEditable: true },
    { label: 'Número de teléfono', value: session?.user.phone || 'Añadir teléfono', field: 'phone' },
    { label: 'Biografía', value: profile.bio, field: 'bio' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center max-w-2xl mx-auto">
          <button onClick={() => router.push('/profile')} className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Información personal</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto">
        <ul>
          {personalInfoFields.map((item) => (
            <li key={item.field} className="border-b">
              <Link href={item.nonEditable ? '#' : `/profile/edit/${item.field}`} className={`flex items-center justify-between p-4 ${item.nonEditable ? 'cursor-default' : 'hover:bg-gray-50'}`}>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-blue-500">{item.value || `Añadir ${item.label.toLowerCase()}`}</p>
                </div>
                {!item.nonEditable && <ChevronRight className="w-6 h-6 text-gray-400" />}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default EditProfilePage;

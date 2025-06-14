import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { CheckCircle, ChevronRight, MessageSquare, Music, PawPrint, PlusCircle, Wind } from 'lucide-react';

const Profile: NextPage = () => {
  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const { user_metadata } = user;
      setName(user_metadata.name || '');
      setLastName(user_metadata.last_name || '');
      setBio(user_metadata.bio || '');
      setBirthDate(user_metadata.birth_date || '');
      if (user_metadata.avatar_url) {
        downloadImage(user_metadata.avatar_url);
      }
    } else if (!user && session === null) { // only redirect if no user and session has loaded
      router.push('/login');
    }
  }, [session, router]);

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
      setMessage('Avatar updated successfully!');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setUploading(false);
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
        </div>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Profile;






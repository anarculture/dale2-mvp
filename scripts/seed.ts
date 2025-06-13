import 'dotenv/config';
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
import { supabase } from '../apps/web/src/lib/supabaseClient';

async function main() {
  // This script cleans the database by deleting trips and the fake driver profile.

  // 1. Delete all trips
  // We use neq with a dummy UUID to delete all rows.
  const { error: deleteTripsError } = await supabase
    .from('trips')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); 

  if (deleteTripsError) {
    console.error('Error deleting trips:', deleteTripsError.message);
  } else {
    console.log('✅ All trips deleted.');
  }

  // 2. Delete the fake driver profile
  const driverId = '00000000-0000-4000-8000-000000000001';
  const { error: deleteProfileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', driverId);

  if (deleteProfileError) {
    console.error('Error deleting driver profile:', deleteProfileError.message);
  } else {
    console.log('✅ Fake driver profile deleted.');
  }
  
  console.log('✅ Database cleaning complete.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

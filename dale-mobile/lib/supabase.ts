import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It's best to use environment variables for these
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
  // You might want to throw an error here or handle it more gracefully
  // For now, we'll proceed but Supabase calls will likely fail.
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'YOUR_SUPABASE_URL', // Fallback to prevent crash if env var is missing
  supabaseAnonKey || 'YOUR_SUPABASE_ANON_KEY', // Fallback
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

import { createClient, type AuthUser, type SignUpWithPasswordCredentials, type SignInWithPasswordCredentials } from '@supabase/supabase-js';

// These variables are expected to be set in the environment of the consuming app (web or mobile).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anonymous key. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (for web) or EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (for mobile) are set in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (credentials: SignUpWithPasswordCredentials): Promise<{ user: AuthUser | null; error: Error | null }> => {
    const { data, error } = await supabase.auth.signUp(credentials);
    return { user: data.user, error };
}

export const signIn = async (credentials: SignInWithPasswordCredentials): Promise<{ user: AuthUser | null; error: Error | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    return { user: data.user, error };
}

export const signOut = async (): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
}

export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
}

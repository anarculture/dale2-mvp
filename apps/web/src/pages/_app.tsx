import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'; // No longer creating a client here
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
// import { useState } from 'react'; // No longer needed for supabaseClient state
import Layout from '../components/Layout';
import { supabase } from '@/lib/supabaseClient'; // Import the shared client

function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  // const [supabaseClient] = useState(() => createPagesBrowserClient()); // Use shared client instead

  return (
    <SessionContextProvider
      supabaseClient={supabase} // Use the imported shared client
      initialSession={pageProps.initialSession}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}

export default App;

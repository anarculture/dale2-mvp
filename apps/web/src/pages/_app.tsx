import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import Layout from '../components/Layout';
import { supabase } from '@/lib/supabaseClient'; // Import the shared client

// Import i18n (needs to be bundled)
import '../i18n';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const router = useRouter();
  const { i18n } = useTranslation();

  // Force Spanish language for MVP
  useEffect(() => {
    // Always use Spanish for MVP
    i18n.changeLanguage('es');
    // Original multi-language code kept for reference:
    // if (router.locale) {
    //   i18n.changeLanguage(router.locale);
    // }
  }, [i18n]);

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}

export default App;

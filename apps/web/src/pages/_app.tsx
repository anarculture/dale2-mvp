import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from '../lib/SessionContext';
import Layout from '../components/Layout';

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default App;

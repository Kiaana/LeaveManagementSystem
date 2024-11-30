// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';

function MyApp({ Component, pageProps, router }) {
  const title = "请销假登记系统";
  const description = "请销假登记系统是一个由RustyPiano开发的用于登记学员请假和销假信息的应用程序。";

  const isDashboardPage = router.pathname === '/dashboard';

  return (
    <AuthProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isDashboardPage ? (
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      ) : (
        <Layout>
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      )}
    </AuthProvider>
  );
}

export default MyApp;
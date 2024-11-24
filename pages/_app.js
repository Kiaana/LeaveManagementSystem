// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';

function MyApp({ Component, pageProps, router }) {
  const title = "请销假登记系统";
  const description = "请销假登记系统是一个由RustyPiano开发的用于登记学员请假和销假信息的应用程序。";

  // 判断当前页面是否为 Dashboard
  const isDashboardPage = router.pathname === '/dashboard';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isDashboardPage ? (
        // 如果是 Dashboard 页面，直接渲染组件
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      ) : (
        // 其他页面使用 Layout 包裹
        <Layout>
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      )}
    </>
  );
}

export default MyApp;
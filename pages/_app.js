// pages/_app.js
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default MyApp;
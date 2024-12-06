// components/Layout.js
import { ToastContainer } from 'react-toastify';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 lg:mt-16">
        {children}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Layout;
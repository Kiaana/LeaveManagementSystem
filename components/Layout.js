// components/Layout.js
import { ToastContainer } from 'react-toastify';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Layout;
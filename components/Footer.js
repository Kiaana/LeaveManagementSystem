// components/Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-600 text-center py-4 border-t">
      <p className="text-sm">
        © {currentYear} RustyPiano.
      </p>
    </footer>
  );
};

export default Footer;
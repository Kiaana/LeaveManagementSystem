// components/FormField.js
import React from 'react';
import { motion } from 'framer-motion';

const FormField = ({ label, icon: Icon, error, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      {children}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-xs mt-1"
      >
        {error.message}
      </motion.p>
    )}
  </motion.div>
);

export default FormField;
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ServiceSelectionCart = ({ selectedServices, onGetQuote }) => {
  const calculateTotal = () => {
    return selectedServices.reduce(
      (sum, service) => sum + (service.Price || service.price || 0),
      0
    );
  };

  if (selectedServices.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">
            {selectedServices.length} service
            {selectedServices.length > 1 ? "s" : ""} selected
          </p>
          <p className="text-3xl font-bold text-[#F3C625]">
            ₹{calculateTotal()}
          </p>
        </div>
        <button
          onClick={onGetQuote}
          className="bg-[#F3C625] hover:bg-[#d4ab1f] text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
        >
          Get Quote
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedServices.map((service) => (
          <span
            key={service.ID}
            className="bg-gray-800 text-xs px-3 py-1 rounded-full"
          >
            {service.ServiceName}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceSelectionCart;

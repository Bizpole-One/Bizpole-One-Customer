import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServicesApi from "../api/ServicesApi";
import { getAllStates } from "../api/States";
import { motion, AnimatePresence } from "framer-motion";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [price, setPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const commonQuestions = [
    "Where would you like to avail this service?",
    "Please select your state to get accurate pricing",
    "Service availability and pricing may vary by location",
  ];

  useEffect(() => {
    const fetchServiceAndStates = async () => {
      try {
        const serviceRes = await ServicesApi.getServiceById({ ServiceId: id });
        setService(serviceRes.data || serviceRes);

        const statesData = await getAllStates();
        setStates(statesData || []);

        setTimeout(() => {
          setShowStatePopup(true);
        }, 1000);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndStates();
  }, [id]);

  // ✅ Fetch price based on selected state
  const fetchServicePrice = async (stateId, stateName) => {
    if (!stateId && !stateName) return;
    setPriceLoading(true);
    try {
      const res = await ServicesApi.getServicePrice({
        ServiceId: id,
        StateId: stateId,
        StateName: stateName,
      });

      if (res.success && res.data) {
        setService(res.data);
        const priceData =
          res.data.price ||
          res.data.Amount ||
          res.data.data?.price ||
          null;
        setPrice(priceData);
      } else {
        setPrice(null);
      }
    } catch (err) {
      console.error("Error fetching service price:", err);
      setPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleStateSubmit = (e) => {
    e.preventDefault();
    if (selectedState) {
      const selected = states.find(
        (s) => String(s.StateID) === String(selectedState)
      );
      const stateName = selected?.state_name || "";
      setSelectedStateName(stateName);
      fetchServicePrice(selectedState, stateName);
      setShowStatePopup(false);
    }
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const reopenStatePopup = () => {
    setShowStatePopup(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#F3C625] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h2>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-slate-50 via-white to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {service.Name || "Unnamed Service"}
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            {service.Description || "No description available."}
          </p>

          {/* ✅ Price Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Pricing</h3>
                {priceLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#F3C625] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading price...</span>
                  </div>
                ) : price ? (
                  <div className="text-3xl font-bold text-green-600">
                    ₹{price}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    Select your state to view pricing
                  </div>
                )}
              </div>

              <motion.button
                onClick={reopenStatePopup}
                className="px-6 py-3 bg-[#F3C625] text-white font-semibold rounded-xl hover:bg-[#e0b420] transition-colors shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change Location
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ✅ State Popup */}
      <AnimatePresence>
        {showStatePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Where are you located?
                </h2>
                {commonQuestions.map((q, i) => (
                  <p key={i} className="text-gray-600 text-sm">{q}</p>
                ))}
              </div>

              <form onSubmit={handleStateSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your state *
                  </label>
                  <select
                    value={selectedState}
                    onChange={handleStateChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-[#F3C625] focus:border-[#F3C625]"
                  >
                    <option value="">Choose your state</option>
                    {states.map((state) => (
                      <option key={state.StateID} value={state.StateID}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowStatePopup(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!selectedState}
                    className="flex-1 px-6 py-3 bg-[#F3C625] text-white font-semibold rounded-xl hover:bg-[#e0b420] disabled:opacity-50"
                    whileHover={selectedState ? { scale: 1.02 } : {}}
                    whileTap={selectedState ? { scale: 0.98 } : {}}
                  >
                    Get Price
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;

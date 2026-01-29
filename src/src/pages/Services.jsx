import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServicesApi from "../api/ServicesApi";
import { motion, AnimatePresence } from "framer-motion";

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    setCategoriesLoading(true);
    ServicesApi.getServiceCategories()
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Fetch services
  useEffect(() => {
    setLoading(true);
    if (selectedCategory) {
      ServicesApi.getServicesByCategory(selectedCategory, { page, limit })
        .then((res) => {
          setServices(res.data || []);
          setTotalPages(Math.max(1, Math.ceil((res.total || 0) / limit)));
        })
        .catch((error) => {
          console.error("Error fetching services by category:", error);
          setServices([]);
          setTotalPages(1);
        })
        .finally(() => setLoading(false));
    } else {
      ServicesApi.getServices({ page, limit, filter })
        .then((res) => {
          setServices(res.data || []);
          setTotalPages(res.pagination?.totalPages || 1);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
          setServices([]);
        })
        .finally(() => setLoading(false));
    }
  }, [page, limit, filter, selectedCategory]);

  // Navigate to details page
  const handleLearnMore = (serviceId) => {
    navigate(`/services/${serviceId}`, { state: { serviceId } });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const clearFilters = () => {
    setFilter("");
    setSelectedCategory("");
    setPage(1);
  };

  // Animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  };

  const selectedCategoryName = selectedCategory
    ? categories.find((cat) => cat.CategoryID.toString() === selectedCategory)
        ?.CategoryName
    : null;

  return (
    <motion.div
      className="min-h-screen mt-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 px-4 sm:px-6 lg:px-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="container px-4 mx-auto">
        {/* Header Section */}
        <motion.div
          className="flex flex-row flex-wrap items-center justify-center text-center mb-16 border-b border-gray-200 pb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl text-gray-900 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our{" "}
            <span className="bg-gradient-to-r from-[#F3C625] to-[#f8d75a] bg-clip-text text-transparent">
              Services
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover our comprehensive range of professional services tailored
            to meet your needs
          </motion.p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search services..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[#F3C625] focus:border-[#F3C625] transition-all duration-300 outline-none text-gray-700 placeholder-gray-400"
              />
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Category Dropdown */}
            <div className="relative group">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[#F3C625] focus:border-[#F3C625] transition-all duration-300 outline-none text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categoriesLoading ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option
                      key={category.CategoryID}
                      value={category.CategoryID}
                    >
                      {category.CategoryName}
                    </option>
                  ))
                )}
              </select>
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Clear Filters */}
            <motion.button
              onClick={clearFilters}
              className="px-6 py-4 rounded-2xl border-2 border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#F3C625] hover:text-[#F3C625] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!filter && !selectedCategory}
            >
              Clear Filters
            </motion.button>
          </div>

          {/* Active Filters Display */}
          {(filter || selectedCategoryName) && (
            <motion.div 
              className="mt-4 flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {filter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F3C625] text-white">
                  Search: "{filter}"
                  <button 
                    onClick={() => setFilter("")}
                    className="ml-2 hover:bg-yellow-600 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedCategoryName && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                  Category: {selectedCategoryName}
                  <button 
                    onClick={() => setSelectedCategory("")}
                    className="ml-2 hover:bg-blue-600 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Loading / Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className="flex justify-center items-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="loading"
            >
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  className="w-16 h-16 border-4 border-[#F3C625] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                  className="text-gray-500 text-lg font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading services...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              {services.length === 0 ? (
                <motion.div 
                  className="text-center py-32"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No services found</h3>
                  <p className="text-gray-500">
                    {filter || selectedCategory 
                      ? "Try adjusting your search criteria or category filter" 
                      : "No services available at the moment"}
                  </p>
                  {(filter || selectedCategory) && (
                    <motion.button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-2 bg-[#F3C625] text-white rounded-lg font-semibold hover:bg-[#e0b420] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {services.map((service) => (
                      <motion.div
                        key={service.ServiceID}
                        variants={cardVariants}
                        whileHover={{ y: -8 }}
                        className="group cursor-pointer"
                        onClick={() => handleLearnMore(service.ServiceID)}
                      >
                        <motion.div
                          className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col relative"
                          whileHover={{
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Gradient Overlay on Hover */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-[#F3C625]/5 to-[#f8d75a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          />
                          
                          {/* Card Header with Accent */}
                          <motion.div 
                            className="h-1 bg-gradient-to-r from-[#C3C3C3] to-[#F3C625]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                          
                          <div className="p-8 flex-1 flex flex-col relative z-10">
                            <motion.div
                              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F3C625] to-[#f8d75a] flex items-center justify-center mb-6 shadow-md"
                              variants={iconVariants}
                              initial="initial"
                              whileHover="hover"
                            >
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </motion.div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#F3C625] transition-colors duration-300">
                              {service.ServiceName}
                            </h3>

                            <p className="text-gray-600 leading-relaxed flex-1 line-clamp-4">
                              {service.Description ||
                                "Professional service tailored to meet your specific requirements."}
                            </p>

                            <motion.div className="mt-6 pt-6 border-t border-gray-100">
                              <motion.button
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLearnMore(service.ServiceID);
                                }}
                              >
                                Learn More
                                <motion.svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </motion.svg>
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination Component */}
                  {services.length > 0 && (
                    <motion.div 
                      className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.button
                        className="flex items-center px-6 py-3 rounded-2xl bg-white text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        whileHover={{ scale: page === 1 ? 1 : 1.05, x: page === 1 ? 0 : -5 }}
                        whileTap={{ scale: page === 1 ? 1 : 0.95 }}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </motion.button>
                      
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          return (
                            <motion.button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`w-11 h-11 rounded-xl font-semibold transition-all duration-300 ${
                                page === pageNum
                                  ? 'bg-gradient-to-br from-[#F3C625] to-[#f8d75a] text-white shadow-lg'
                                  : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                      </div>

                      <motion.button
                        className="flex items-center px-6 py-3 rounded-2xl bg-white text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        whileHover={{ scale: page === totalPages ? 1 : 1.05, x: page === totalPages ? 0 : 5 }}
                        whileTap={{ scale: page === totalPages ? 1 : 0.95 }}
                      >
                        Next
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Services;
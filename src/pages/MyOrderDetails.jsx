export const orderStatusList = [
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Pending' },
  { value: 4, label: 'Completed, Payment Pending' },
  { value: 5, label: 'Completed, Payment Done' },
];
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, 
  MessageCircle, 
  Package, 
  Calendar, 
  Clock, 
  CheckCircle,
  ChevronRight,
  FileText,
  CreditCard,
  Truck,
  Shield,
  XCircle
} from 'lucide-react';

const MyOrderDetails = () => {
  const location = useLocation();
  const order = location.state?.order || {
    OrderID: 134,
    PackageName: "Business Solutions Package",
    PackageTitle: "Unnamed Package",
    TotalAmount: 29999,
    OrderStatus: 1, // Default to 1 (In Progress)
    CreatedAt: "2024-01-15T10:30:00Z",
    Items: [
      { name: "Business Registration", status: "Pending", price: "₹N/A" },
      { name: "Tax Consultation", status: "Pending", price: "₹N/A" },
      { name: "Legal Documentation", status: "Pending", price: "₹N/A" },
      { name: "Financial Planning", status: "Pending", price: "₹N/A" },
    ]
    
    
  };

  console.log(order, "ordersssss");
  
  // Timeline steps by status value
  const getTimelineSteps = (statusValue) => {
    // Map status value to timeline progression
    const steps = [
      { stage: "Order Placed", key: 1 },
      { stage: "In Progress", key: 2 },
      { stage: "Completed", key: 3 },
      { stage: "Payment Pending", key: 4 },
      { stage: "Payment Done", key: 5 },
    ];
    // Status value meanings:
    // 1: In Progress, 2: Completed, 3: Pending, 4: Completed, Payment Pending, 5: Completed, Payment Done
    let completedIdx = 0;
    if (statusValue === 1) completedIdx = 1; // In Progress
    else if (statusValue === 2) completedIdx = 2; // Completed
    else if (statusValue === 3) completedIdx = 0; // Pending
    else if (statusValue === 4) completedIdx = 3; // Completed, Payment Pending
    else if (statusValue === 5) completedIdx = 4; // Completed, Payment Done
    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= completedIdx,
      date: idx <= completedIdx ? new Date(order.CreatedAt).toLocaleDateString() : 'N/A',
    })).slice(0, completedIdx + 1);
  };

  const timelineSteps = getTimelineSteps(order.OrderStatus);

  const [showInvoice, setShowInvoice] = useState(false);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  if (!order) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center  p-4"
      >
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Order Found</h3>
          <p className="text-gray-600">Please go back and select an order to view details.</p>
        </div>
      </motion.div>
    );
  }

  // Helper to get status label from value
  const getOrderStatusLabel = (statusValue) => {
    const found = orderStatusList.find((s) => s.value === statusValue || s.label === statusValue);
    return found ? found.label : (order.OrderStatus || 'Unknown');
  };

  // Prefer ServiceDetails for package items if present
  const packageItems = Array.isArray(order.ServiceDetails) && order.ServiceDetails.length > 0
    ? order.ServiceDetails.map((service) => ({
        name: service.ServiceName || service.ItemName || 'Service',
        status: service.StatusRemark || 'Pending',
        price: `₹${service.Total || 'N/A'}`,
        total: parseFloat(service.Total) || 0,
        details: service
      }))
    : (order.Items || []).map((item) => ({
        ...item,
        total: 0 // fallback if no ServiceDetails
      }));

  // Calculate total amount from packageItems
  const packageTotalAmount = packageItems.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen  p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Details
          </h1>
          <p className="text-gray-600 flex items-center">
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
              Order ID: {order.OrderID}
            </span>
            <Calendar className="w-4 h-4 mr-1 inline text-yellow-400" />
            Ordered on {new Date(order.CreatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="mr-4"
                    >
                      <Package className="w-12 h-12 text-yellow-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {order.PackageName || order.PackageTitle || 'Unnamed Package'}
                      </h2>
                      <p className="text-gray-600">
                        This package includes various business services and solutions tailored to your needs.
                      </p>
                    </div>
                  </div>
               
                </div>

                {/* Package Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                    Package Items
                  </h3>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {packageItems.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-4 ${
                            item.status === 'Pending' ? 'bg-yellow-400' :
                            item.status === 'Completed' ? 'bg-green-400' :
                            'bg-yellow-400'
                          }`} />
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {/* <span className={`text-sm px-2 py-1 rounded-full ${
                              item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span> */}
                            {/* Show more details if available (for ServiceDetails) */}
                            {item.details && (
                              <div className="text-xs text-gray-500 mt-1">
                         
                             
                                <div>Total: ₹{item.details.Total}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">{item.price}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-yellow-400" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-semibold">{order.OrderID}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ordered On</span>
                      <span className="font-semibold">
                        {order.CreatedAt ? new Date(order.CreatedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold px-3 py-1 rounded-full ${
                        statusColors[order.OrderStatus] || statusColors.Pending
                      }`}>
                        {getOrderStatusLabel(order.OrderStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-black">
                        ₹{packageTotalAmount > 0 ? packageTotalAmount.toLocaleString() : (order.TotalAmount || order.totalAmount || 'N/A')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

           
            </motion.div>
          </div>

          {/* Right Column - Timeline */}
          <div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 sticky top-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-yellow-400" />
                Order Timeline
              </h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-yellow-200" />
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  {timelineSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative flex items-start"
                    >
                      <div className="absolute left-5 -translate-x-1/2">
                        <motion.div
                          animate={{ 
                            scale: step.completed ? [1, 1.2, 1] : 1,
                            backgroundColor: step.completed ? '#181b1a' : '#D1D5DB'
                          }}
                          className={`w-3 h-3 ml-2 rounded-full border-4 border-white ${step.completed ? 'bg-yellow-400' : 'bg-gray-300'}`}
                        />
                      </div>
                      <div className="ml-12">
                        <h4 className={`font-semibold ${step.completed ? 'text-gray-600' : 'text-gray-600'}`}>
                          {step.stage}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 inline mr-1 text-yellow-400" />
                          {step.date}
                        </p>
                    
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Order Security</span>
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Deliverables</span>
                  <Truck className="w-4 h-4 text-yellow-400" />
                </div>
             
              </div>

              
            </motion.div>


              <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl mt-5 shadow-xl p-6 md:p-8 border border-gray-200 sticky top-8"
            >
               {/* Actions */}
              <motion.div 
                className="bg-gray-50 px-2 py-2 "
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-lg font-semibold text-gray-900 pb-3 mb-4 border-b border-gray-200 ">Actions</h3>
                <div className="flex flex-col sm:flex-col gap-4 ">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInvoice(true)}
                    className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-medium hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5 text-black" />
                    Download Invoice
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <ChevronRight className="w-5 h-5 text-black" />
                    </motion.div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 border-2 border-yellow-400 text-black px-6 py-3 rounded-full font-medium hover:bg-yellow-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-black " />
                    Contact Support
                  </motion.button>
                </div>
              </motion.div>
              
            </motion.div>
          </div>
          
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>Need help with your order? Our support team is available 24/7.</p>
          <p className="mt-1">Email: support@businessservices.com • Phone: +1-234-567-8900</p>
        </motion.div>

        {/* Invoice Modal */}
        {showInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-100 bg-opacity-10 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInvoice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No invoice available</h3>
                <p className="text-gray-600 mb-6">
                 
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowInvoice(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500">
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrderDetails;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiChevronRight, FiPlus, FiMinus } from 'react-icons/fi';

const InvoiceProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const invoices = [
    { date: 'November 8, 2025', description: 'Monthly invoice', status: 'Upcoming', amount: null },
    { date: 'October 8, 2025', description: 'Monthly invoice', status: 'Paid', amount: '$20.00' },
    { date: 'September 8, 2025', description: 'Monthly invoice', status: 'Paid', amount: '$20.00' },
    { date: 'August 8, 2025', description: 'Monthly invoice', status: 'Paid', amount: '$20.00' },
    { date: 'July 8, 2025', description: 'Monthly invoice', status: 'Paid', amount: '$20.00' },
  ];

  const faqs = [
    { question: 'How are seats billed?', answer: 'Seats are billed monthly based on your subscription plan.' },
    { question: 'What are available seats?', answer: 'Available seats are the number of users that can access your account.' },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" mx-auto">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'overview' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'invoices' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Invoices
            {activeTab === 'invoices' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Due date</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Description</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Invoice total</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className={`py-4 px-6 text-sm ${invoice.status === 'Upcoming' ? 'text-orange-500 font-medium' : 'text-gray-900'}`}>
                            {invoice.date}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 flex items-center gap-2">
                            <FiFileText className="text-gray-400" />
                            {invoice.description}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                invoice.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-right text-gray-900">
                            {invoice.amount || '-'}
                          </td>
                          <td className="py-4 px-6">
                            <FiChevronRight className="text-gray-400" />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Next Invoice Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Next monthly invoice</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-gray-900">$20.00</span>
                      <span className="text-sm text-gray-500">due November 8, 2025</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    Preview
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                  <span>$20.00 for 1 monthly seat</span>
                  <FiChevronRight className="text-gray-400" />
                </div>
              </motion.div>

              {/* Plan Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">👑</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">You're on the Plus plan</h3>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors">
                    View plans
                  </button>
                </div>

                {/* FAQ Section */}
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {expandedFaq === index ? (
                            <FiMinus className="text-gray-500" />
                          ) : (
                            <FiPlus className="text-gray-500" />
                          )}
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 text-sm text-gray-600">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvoiceProfile;
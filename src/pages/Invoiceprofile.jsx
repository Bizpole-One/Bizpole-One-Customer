import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { getCompanyInvoices } from '../api/Companyinvoice';
import { getSecureItem } from '../utils/secureStorage';
import CryptoJS from "crypto-js";
import { useNavigate } from 'react-router-dom';

const InvoiceProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedCompany = getSecureItem("selectedCompany");
      const companyId = selectedCompany?.CompanyID;

      if (!companyId) {
        throw new Error("No company selected. Please select a company first.");
      }

      const response = await getCompanyInvoices({
        companyId,
        limit: 50,
        page: 1
      });

      if (response.success && Array.isArray(response.data)) {
        setInvoices(response.data);
        calculateStats(response.data);
      } else {
        setInvoices([]);
        calculateStats([]);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message || "Failed to fetch invoices. Please try again.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoiceData) => {
    const totalInvoices = invoiceData.length;
    const totalAmount = invoiceData.reduce((sum, inv) => {
      const amount = parseFloat(inv.InvoiceValue || inv.OrderValue || inv.InvoiceTotal || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const paidInvoices = invoiceData.filter(inv =>
      inv.InvoiceStatus?.toLowerCase() === 'paid' ||
      inv.Status?.toLowerCase() === 'paid'
    ).length;

    const pendingInvoices = invoiceData.filter(inv =>
      inv.InvoiceStatus?.toLowerCase() === 'pending' ||
      inv.Status?.toLowerCase() === 'pending' ||
      inv.InvoiceStatus?.toLowerCase() === 'upcoming' ||
      inv.Status?.toLowerCase() === 'upcoming'
    ).length;

    const overdueInvoices = invoiceData.filter(inv =>
      inv.InvoiceStatus?.toLowerCase() === 'overdue' ||
      inv.Status?.toLowerCase() === 'overdue'
    ).length;

    setStats({
      totalInvoices,
      totalAmount,
      paidInvoices,
      pendingInvoices,
      overdueInvoices
    });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleOpenFullPreview = (invoice) => {
    try {
      const secret = import.meta.env.VITE_QUOTE_LINK_SECRET || "default_secret";
      const orderId = invoice.OrderID || invoice.id;

      if (!orderId) {
        console.error("No Order ID found for invoice");
        return;
      }

      const encryptedOrderId = encodeURIComponent(
        CryptoJS.AES.encrypt(String(orderId), secret).toString()
      );

      navigate(`/profile/invoice-preview/${encryptedOrderId}`, {
        state: { invoiceData: invoice }
      });
    } catch (error) {
      console.error("Error encrypting order ID:", error);
    }
  };

  const faqs = [
    {
      question: 'How are seats billed?',
      answer: 'Seats are billed monthly based on your subscription plan. You can add or remove seats at any time.'
    },
    {
      question: 'What are available seats?',
      answer: 'Available seats are the number of users that can access your account. Additional seats can be purchased as needed.'
    },
    {
      question: 'When will I receive my invoice?',
      answer: 'Invoices are generated on the 1st of each month and are due by the 8th of the same month.'
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0.00';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '₹0.00';

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    const styles = {
      paid: 'bg-green-50 text-green-700',
      pending: 'bg-yellow-50 text-yellow-700',
      upcoming: 'bg-yellow-50 text-yellow-700',
      overdue: 'bg-red-50 text-red-700',
      cancelled: 'bg-gray-100 text-gray-600',
    };
    return styles[normalized] || 'bg-gray-100 text-gray-600';
  };

  const getNextInvoice = () => {
    if (!invoices.length) return null;

    const now = new Date();
    const futureInvoices = invoices
      .filter(inv => {
        const invDate = new Date(inv.InvoiceDate || inv.OrderDate);
        return invDate > now && inv.InvoiceStatus?.toLowerCase() !== 'paid';
      })
      .sort((a, b) => new Date(a.InvoiceDate) - new Date(b.InvoiceDate));

    return futureInvoices[0] || invoices[0];
  };

  const nextInvoice = getNextInvoice();

  return (
    <div className=" bg-white">
      <div className="mx-auto px-6 py-10">
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Invoice</h1>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'invoices', label: 'Invoices' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="invoiceTabUnderline"
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-yellow-400"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Next invoice card */}
              <div className="border border-gray-200 rounded-xl p-6">
                {nextInvoice ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm text-gray-500">Next monthly invoice</h3>
                      <button
                        onClick={() => handleViewInvoice(nextInvoice)}
                        className="text-xs font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                      >
                        Preview
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-semibold text-gray-900">
                        {formatCurrency(nextInvoice.InvoiceValue || nextInvoice.OrderValue || nextInvoice.InvoiceTotal)}
                      </span>
                      <span className="text-sm text-gray-400">
                        due {formatDate(nextInvoice.InvoiceDate || nextInvoice.OrderDate)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewInvoice(nextInvoice)}
                      className="w-full flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <span>
                        {formatCurrency(nextInvoice.InvoiceValue || nextInvoice.OrderValue || nextInvoice.InvoiceTotal)} for 1 monthly seat
                      </span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-center">
                    <FiFileText className="w-8 h-8 text-gray-300 mb-3" />
                    <span className="text-gray-500 text-sm">No upcoming invoices</span>
                  </div>
                )}
              </div>

              {/* Plan card */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-yellow-400 rounded-sm inline-block" />
                    <h3 className="text-sm font-medium text-gray-900">You're on the Plus plan</h3>
                  </div>
                  <button className="text-xs font-medium text-gray-500 hover:text-gray-700 underline">
                    View plans
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {faqs.slice(0, 2).map((faq, index) => (
                    <div key={index}>
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between py-3 text-left"
                      >
                        <span className="text-sm text-gray-700">{faq.question}</span>
                        {expandedFaq === index ? (
                          <FiMinus className="w-4 h-4 text-gray-400" />
                        ) : (
                          <FiPlus className="w-4 h-4 text-gray-400" />
                        )}
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
                            <p className="text-sm text-gray-500 pb-3">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex gap-6"
            >
              {/* Table */}
              <div className={`border border-gray-200 rounded-xl overflow-hidden transition-all ${selectedInvoice ? 'w-full lg:w-1/2' : 'w-full'}`}>
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-gray-500">Loading invoices...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center">
                    <FiAlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <p className="text-sm text-red-600 mb-3">{error}</p>
                    <button
                      onClick={fetchInvoices}
                      className="text-xs font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                    >
                      Retry
                    </button>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="p-12 text-center">
                    <FiFileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No invoices found</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Due date</th>
                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Description</th>
                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice, index) => {
                        const isSelected = selectedInvoice === invoice;
                        const status = invoice.InvoiceStatus || invoice.Status || 'Unknown';
                        return (
                          <tr
                            key={invoice.InvoiceID || invoice.id || index}
                            onClick={() => handleViewInvoice(invoice)}
                            className={`border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
                              isSelected ? 'bg-yellow-50/60' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className={`py-3.5 px-5 ${status.toLowerCase() === 'upcoming' || status.toLowerCase() === 'pending' ? 'text-yellow-600 font-medium' : 'text-gray-700'}`}>
                              {formatDate(invoice.InvoiceDate || invoice.invoiceDate)}
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2 text-gray-700">
                                <FiFileText className="w-4 h-4 text-gray-400" />
                                {invoice.InvoiceCode || invoice.invoiceCode || 'Monthly invoice'}
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Detail panel */}
              <AnimatePresence>
                {selectedInvoice && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="hidden lg:flex flex-col w-1/2 border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {selectedInvoice.InvoiceCode || selectedInvoice.invoiceCode || 'Monthly invoice'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {selectedInvoice.InvoiceStatus || selectedInvoice.Status || 'Unknown'}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedInvoice(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Due date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedInvoice.InvoiceDate || selectedInvoice.OrderDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedInvoice.InvoiceStatus || selectedInvoice.Status || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5 pb-5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 mb-1">Renewing monthly</p>
                      <p className="text-xs text-gray-400">
                        Assigned monthly that will renew for {formatDate(selectedInvoice.InvoiceDate || selectedInvoice.OrderDate)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">
                        {selectedInvoice.CompanyName || selectedInvoice.companyName || 'Company'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedInvoice.InvoiceValue || selectedInvoice.OrderValue || selectedInvoice.InvoiceTotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-900">Projected subtotal</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedInvoice.InvoiceValue || selectedInvoice.OrderValue || selectedInvoice.InvoiceTotal)}
                      </span>
                    </div>

                    <div className="flex-1" />

                    <button
                      onClick={() => handleOpenFullPreview(selectedInvoice)}
                      className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-6"
                    >
                      Manage
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvoiceProfile;
// src/App.jsx
import { useState, useEffect } from "react";
import {
  getCompanyServices,
  getServiceDeliverablesByServiceDetailId,
  getTasks,
  getResponseFieldsBySerId,
} from "../api/TaskApi";
import { serviceFormMapping } from "../api/Services/ServiceDetails";
import { useLocation } from "react-router-dom";
import ServiceTaskListing from "../../src/components/associate/ServiceTaskListing";
import { getSecureItem, removeSecureItem } from "../utils/secureStorage";

// Mock data (keep as fallback so the table always has something to render
// while real per-task data is wired up on the backend)
const currentTasks = [
  {
    id: 1,
    title: "Bank details",
    status: "Approved",
    date: "18 Apr 2021",
    progress: 100,
    completed: true,
    assignee: { name: "Aaron More", avatar: null },
  },
  {
    id: 2,
    title: "CIN number",
    status: "In review",
    date: "18 Apr 2021",
    progress: 55,
    completed: true,
    assignee: { name: "Aaron More", avatar: null },
  },
  {
    id: 3,
    title: "ID Proof",
    status: "Not Approved",
    date: "18 Apr 2021",
    progress: 30,
    completed: true,
    assignee: null,
  },
  {
    id: 4,
    title: "Interactive prototype for app screens of deltamine project",
    status: "In review",
    date: "18 Apr 2021",
    progress: 40,
    completed: false,
    assignee: null,
  },
  {
    id: 5,
    title: "Interactive prototype for app screens of deltamine project",
    status: "Approved",
    date: "",
    progress: 90,
    completed: true,
    assignee: null,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Create a user flow of social application design",
    status: "Disable",
    date: "18 Apr 2021",
    progress: 20,
    assignee: { name: "Aaron More", avatar: null },
  },
  {
    id: 2,
    title: "Create a user flow of social application design",
    status: "Disable",
    date: "18 Apr 2021",
    progress: 15,
    assignee: { name: "Aaron More", avatar: null },
  },
  {
    id: 3,
    title: "Landing page design for Fintech project of singapore",
    status: "Disable",
    date: "18 Apr 2021",
    progress: 10,
    assignee: null,
  },
  {
    id: 4,
    title: "Interactive prototype for app screens of deltamine project",
    status: "Disable",
    date: "",
    progress: 25,
    assignee: null,
  },
  {
    id: 5,
    title: "Interactive prototype for app screens of deltamine project",
    status: "Disable",
    date: "",
    progress: 0,
    assignee: null,
  },
];

const STATUS_FILTERS = ["All", "Approved", "In review", "Not Approved", "Disable"];

export default function ServiceSelection() {
  const location = useLocation();
  const navState = location.state || {};
  const navServiceId = navState.serviceId;
  const navService = navState.service;
  const navQuoteId = navService?.QuoteID || navState.quoteId;

  // State declarations - all at the top level
  const [formConfig, setFormConfig] = useState([]);
  const [service, setService] = useState(null);
  const [companyServices, setCompanyServices] = useState(null);
  const [loadingCompanyServices, setLoadingCompanyServices] = useState(false);
  const [companyServicesError, setCompanyServicesError] = useState(null);
  const [responseFields, setResponseFields] = useState([]);
  const [responseFieldsLoading, setResponseFieldsLoading] = useState(false);
  const [serviceFormFullMapping, setServiceFormFullMapping] = useState(null);
  const [selectedService, setSelectedService] = useState(navService || null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState(null);
  const [verifiedFields, setVerifiedFields] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Task");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [collectDataTask, setCollectDataTask] = useState(null);
  const [noteTask, setNoteTask] = useState(null);
  const [tasksFromApi, setTasksFromApi] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [serviceDeliverables, setServiceDeliverables] = useState(null);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [deliverablesError, setDeliverablesError] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);


  const [companyId, setCompanyId] = useState(() => getSecureItem("selectedCompany")?.CompanyID || null);

  // Clear invalid selectedCompany format
  useEffect(() => {
    const raw = localStorage.getItem("selectedCompany");
    if (raw && raw === "[object Object]") {
      removeSecureItem("selectedCompany");
      console.warn("selectedCompany was invalid and has been removed. Please re-select the company.");
    }
  }, []);

  // Re-fetch when company is switched from the dropdown
  useEffect(() => {
    const handler = () => {
      const company = getSecureItem("selectedCompany");
      setCompanyId(company?.CompanyID || null);
      setSelectedService(null);
      setCompanyServices(null);
    };
    window.addEventListener("company-switched", handler);
    return () => window.removeEventListener("company-switched", handler);
  }, []);

  // Fetch company services
  useEffect(() => {
    if (companyId) {
      const fetchCompanyServices = async () => {
        setLoadingCompanyServices(true);
        setCompanyServicesError(null);
        try {
          const data = await getCompanyServices(companyId);
          setCompanyServices(data);
        } catch (err) {
          console.error("Error fetching company services:", err);
          setCompanyServicesError("Failed to fetch company services.");
        } finally {
          setLoadingCompanyServices(false);
        }
      };
      fetchCompanyServices();
    }
  }, [companyId]);

  // Auto-select service from navigation state
  useEffect(() => {
    if (navServiceId && companyServices?.services?.length > 0) {
      const found = companyServices.services.find(
        (s) => String(s.ServiceDetailID) === String(navServiceId)
      );
      if (found && (!selectedService || selectedService.ServiceDetailID !== found.ServiceDetailID)) {
        setSelectedService(found);
      }
    }
  }, [navServiceId, companyServices, selectedService]);

  // Fetch tasks and approval status for Task tab
  useEffect(() => {
    const serviceCompanyId = selectedService?.CompanyID || selectedService?.companyId || companyId;

    if (activeTab === "Task" && serviceCompanyId && selectedService?.ServiceDetailID) {
      const fetchTasksAndApproval = async () => {
        setLoadingTasks(true);
        setTasksError(null);
        try {
          // Fetch tasks
          const data = await getTasks({
            ServiceDetailID: selectedService.ServiceDetailID,
            QuoteID: selectedService.QuoteID || navQuoteId,
          });
          setTasksFromApi(data || []);

          // Fetch approval status
          const respFields = await getResponseFieldsBySerId(selectedService.ServiceID);
          const allFields = (respFields.results || []).flatMap((r) => r.fields || []);

          // Approved only when admin has verified all fields (verify === 1)
          const isRejected = allFields.some((f) => f.reject === 1);
          const allVerified = allFields.length > 0 && allFields.every((f) => f.verify === 1);
          setApprovalStatus(
            isRejected ? "Not Approved" : allVerified ? "Approved" : "In review"
          );
        } catch (err) {
          setTasksError("Failed to fetch tasks from /Task API.");
          setApprovalStatus(null);
        } finally {
          setLoadingTasks(false);
        }
      };
      fetchTasksAndApproval();
    } else if (activeTab === "Task") {
      setTasksFromApi([]);
      setApprovalStatus(null);
    }
  }, [activeTab, selectedService, companyId, navQuoteId]);

  // Fetch documents/response fields
  useEffect(() => {
    const serviceCompanyId = selectedService?.CompanyID || selectedService?.companyId || companyId;

    if (activeTab === "Documents" && serviceCompanyId && selectedService?.ServiceID) {
      setLoadingDocuments(true);
      setDocumentsError(null);

      getResponseFieldsBySerId(selectedService.ServiceID)
        .then((data) => {
          const allFields = (data.results || []).flatMap((r) => r.fields || []);
          let verified = [];

          if (activeTab === "Documents") {
            verified = allFields.filter((f) => f.verify === 1 || f.verify === 0);
          } else if (activeTab === "Task") {
            verified = allFields.filter((f) => f.verify === 1);
          } else {
            verified = allFields.filter((f) => f.verify === 0);
          }

          setVerifiedFields(verified);
          setLoadingDocuments(false);
        })
        .catch((err) => {
          console.error("[Documents] getResponseFields API error:", err);
          setDocumentsError("Failed to fetch verified fields.");
          setLoadingDocuments(false);
        });
    } else {
      setVerifiedFields([]);
    }
  }, [activeTab, selectedService]);

  // Fetch response fields by company ID
  const fetchFields = async () => {
    if (!selectedService?.ServiceID) return;
    setResponseFieldsLoading(true);
    try {
      const response = await getResponseFieldsBySerId(selectedService.ServiceID);
      setResponseFields(response.results || []);
    } catch (error) {
      console.error("Error fetching response fields:", error);
    } finally {
      setResponseFieldsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [selectedService?.ServiceID]);

  // Fetch deliverables
  useEffect(() => {
    if (activeTab === "Deliverables" && selectedService?.ServiceDetailID) {
      setLoadingDeliverables(true);
      setDeliverablesError(null);

      getServiceDeliverablesByServiceDetailId(selectedService.ServiceDetailID)
        .then((data) => {
          setServiceDeliverables(data);
          setLoadingDeliverables(false);
        })
        .catch((err) => {
          console.error("[Deliverables] API error:", err);
          setDeliverablesError("Failed to fetch deliverables.");
          setLoadingDeliverables(false);
        });
    } else if (activeTab === "Deliverables") {
      setServiceDeliverables(null);
    }
  }, [activeTab, selectedService]);

  // Fetch formConfig
  useEffect(() => {
    if (selectedService?.ServiceID) {
      setFormConfig([]);
      serviceFormMapping(selectedService.ServiceID)
        .then((res) => {
          if (res?.data) setFormConfig(res.data);
          else if (Array.isArray(res)) setFormConfig(res);
          setService(selectedService);
        })
        .catch((err) => {
          console.error("Error fetching form mapping:", err);
          setFormConfig([]);
        });
    }
  }, [selectedService]);

  // ---------- Helpers ----------
  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-600";
      case "In review":
        return "bg-orange-100 text-orange-500";
      case "Not Approved":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getProgressBarColor = (status, disabled) => {
    if (disabled) return "bg-indigo-100";
    if (status === "Not Approved") return "bg-red-300";
    return "bg-yellow-400";
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // Prefer real API task list if it looks like an array of tasks, otherwise fall back to mock data
  const realTaskList = Array.isArray(tasksFromApi) && tasksFromApi.length > 0 ? tasksFromApi : null;

  const displayedCurrentTasks = (realTaskList || currentTasks).map((t) => ({
    id: t.id ?? t.TaskID,
    title: t.title ?? t.TaskName ?? "Untitled task",
    status: t.status ?? approvalStatus ?? "In review",
    date: t.date ?? t.assignedAt ?? "",
    progress: t.progress ?? t.percentComplete ?? 0,
    completed: t.completed ?? t.status === "Approved",
    assignee: t.assignee ?? null,
  }));

  const displayedUpcomingTasks = upcomingTasks;

  const filteredCurrentTasks =
    statusFilter === "All"
      ? displayedCurrentTasks
      : displayedCurrentTasks.filter((task) => task.status === statusFilter);

  const filteredUpcomingTasks =
    statusFilter === "All"
      ? displayedUpcomingTasks
      : displayedUpcomingTasks.filter((task) => task.status === statusFilter);

  const summary = !Array.isArray(tasksFromApi)
    ? tasksFromApi?.summary
    : tasksFromApi?.[0];

  const totalTasksCompleted =
    summary?.totalTasksCompleted ?? summary?.totalTasks ?? displayedCurrentTasks.filter((t) => t.completed).length;
  const startDate = summary?.assignedAt ?? summary?.startDate ?? "-";
  const paymentDue =
    summary?.paymentDue !== undefined && summary?.paymentDue !== null ? `₹${summary.paymentDue}` : "-";
  const overallPercent = summary?.percentComplete ?? 0;
  const overallStatusLabel = approvalStatus || summary?.status || "In Progress";

  // ---------- Reusable task row ----------
  const TaskRow = ({ task, disabled }) => (
    <div
      className={`grid grid-cols-[24px_1fr_120px_110px_150px_150px] items-center gap-4 py-2.5 border-b border-gray-50 last:border-b-0`}
    >
      <div className="flex justify-center">
        {task.completed ? (
          <span className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-white text-[10px]">
            ✓
          </span>
        ) : (
          <span
            className={`w-4 h-4 rounded-full border-2 block ${disabled ? "border-gray-200" : "border-gray-300"}`}
          />
        )}
      </div>

      <div className={`text-sm truncate pr-2 ${disabled ? "text-gray-300" : "text-gray-800"}`}>{task.title}</div>

      <div>
        {task.status === "Disable" ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
            <span className="w-4 h-4 rounded-full bg-red-400 text-white flex items-center justify-center text-[9px] leading-none">
              ✕
            </span>
            Disable
          </span>
        ) : (
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${getStatusStyles(task.status)}`}
          >
            {task.status}
          </span>
        )}
      </div>

      <div className={`text-xs ${disabled ? "text-gray-300" : "text-gray-500"}`}>{task.date || ""}</div>

      <div className="flex items-center pr-4">
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${disabled ? "bg-indigo-50" : "bg-gray-100"}`}>
          <div
            className={`h-full rounded-full ${getProgressBarColor(task.status, disabled)}`}
            style={{ width: `${task.progress || 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.assignee ? (
          <>
            {task.assignee.avatar ? (
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="w-6 h-6 rounded-full object-cover border border-white shadow flex-shrink-0"
              />
            ) : (
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0 ${
                  disabled ? "bg-gray-100 text-gray-300" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {getInitials(task.assignee.name)}
              </span>
            )}
            <span className={`text-xs truncate ${disabled ? "text-gray-300" : "text-gray-600"}`}>
              {task.assignee.name}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );

  // Collect Data Form Component
  const CollectDataForm = ({ task, onBack }) => {
    const [form, setForm] = useState({
      name: "",
      mobile: "",
      aadhaar: "",
      pan: "",
      address: "",
      fileAadhaar: null,
      filePan: null,
      fileOther: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "fileAadhaar" || name === "filePan" || name === "fileOther") {
        setForm({ ...form, [name]: files[0] });
      } else {
        setForm({ ...form, [name]: value });
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onBack();
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <button onClick={onBack} className="mb-4 text-gray-500 hover:text-gray-700 text-sm">
          ← Back to Tasks
        </button>
        <h2 className="text-xl font-bold mb-4 text-yellow-600">Collect Data for Task</h2>
        <div className="mb-4">
          <div className="font-semibold text-gray-700 mb-2">Task Name</div>
          <div className="text-gray-900 mb-2">{task.title}</div>
          <div className="text-sm text-gray-500 mb-2">
            Status: <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">{task.status}</span>
          </div>
          <div className="text-sm text-gray-500 mb-2">Date: {task.date || "N/A"}</div>
          <div className="text-sm text-gray-500 mb-2">Progress: {task.progress}%</div>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Enter your name"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Enter your mobile number"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
          <input
            type="text"
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Enter Aadhaar number"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Aadhaar Card</label>
          <input type="file" name="fileAadhaar" accept="image/*,application/pdf" onChange={handleChange} className="mb-4" />
          {form.fileAadhaar && (
            <div className="mb-4">
              <span className="block text-xs text-gray-500 mb-1">Preview:</span>
              <img src={URL.createObjectURL(form.fileAadhaar)} alt="Aadhaar Preview" className="h-24 rounded-lg object-cover" />
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            name="pan"
            value={form.pan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Enter PAN number"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload PAN Card</label>
          <input type="file" name="filePan" accept="image/*,application/pdf" onChange={handleChange} className="mb-4" />
          {form.filePan && (
            <div className="mb-4">
              <span className="block text-xs text-gray-500 mb-1">Preview:</span>
              <img src={URL.createObjectURL(form.filePan)} alt="PAN Preview" className="h-24 rounded-lg object-cover" />
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Enter address"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Other Document</label>
          <input type="file" name="fileOther" accept="image/*,application/pdf" onChange={handleChange} className="mb-4" />
          {form.fileOther && (
            <div className="mb-4">
              <span className="block text-xs text-gray-500 mb-1">Preview:</span>
              <img src={URL.createObjectURL(form.fileOther)} alt="Other Document Preview" className="h-24 rounded-lg object-cover" />
            </div>
          )}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow w-full"
          >
            Submit Data
          </button>
        </form>
      </div>
    );
  };

  // Note Form Component
  const NoteForm = ({ task, onBack }) => {
    const [form, setForm] = useState({ name: "", description: "", file: null });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "file") {
        setForm({ ...form, file: files[0] });
      } else {
        setForm({ ...form, [name]: value });
      }
    };

    const handleReAddSubmit = (e) => {
      e.preventDefault();
      onBack();
    };

    return (
      <div className="bg-white rounded-lg border border-red-400 p-8 mb-8">
        <button onClick={onBack} className="mb-4 text-gray-500 hover:text-gray-700 text-sm">
          ← Back to Tasks
        </button>
        <h2 className="text-xl font-bold mb-4 text-red-600">Not Approved Task</h2>
        <div className="mb-4">
          <div className="font-semibold text-gray-700 mb-2">Task Name</div>
          <div className="text-gray-900 mb-2">{task.title}</div>
          <div className="text-sm text-gray-500 mb-2">
            Status: <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{task.status}</span>
          </div>
          <div className="text-sm text-gray-700 mb-2 font-semibold">Why not approved?</div>
          <div className="bg-gray-100 text-gray-700 rounded-lg p-3 mb-4">
            Required data items are missing. Please re-submit with all required information.
          </div>
        </div>
        <form onSubmit={handleReAddSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Enter your name"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Describe your work"
            rows={3}
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <input type="file" name="file" accept="image/*" onChange={handleChange} className="mb-4" />
          {form.file && (
            <div className="mb-4">
              <img src={URL.createObjectURL(form.file)} alt="Preview" className="h-24 rounded-lg object-cover" />
            </div>
          )}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow w-full"
          >
            Re-Add Task
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-12 mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Task</h1>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-yellow-400 hover:bg-[#F3C625] text-gray-800 text-base font-medium pl-5 pr-4 py-2.5 rounded-full shadow-sm flex items-center gap-2"
          >
            <span>{selectedService?.ItemName || "Choose Services"}</span>
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-gray-600 text-[10px] font-semibold">
              9+
            </span>
            <span className="text-gray-700 text-xs">⌄</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Select a Service</h3>
              </div>
              <div className="max-h-60 overflow-y-auto no-scrollbar">
                {loadingCompanyServices ? (
                  <div className="p-4 text-gray-500">Loading...</div>
                ) : companyServicesError ? (
                  <div className="p-4 text-red-500">{companyServicesError}</div>
                ) : companyServices?.services?.length > 0 ? (
                  companyServices.services.map((s) => (
                    <div
                      key={s.ServiceDetailID}
                      onClick={() => {
                        setSelectedService(s);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        selectedService?.ServiceDetailID === s.ServiceDetailID ? "bg-yellow-100" : ""
                      }`}
                    >
                      <span className="text-2xl mr-3">🛠️</span>
                      <div>
                        <h4 className="font-medium text-gray-800">{s.ItemName || `Service ID: ${s.ServiceID}`}</h4>
                        <p className="text-xs text-gray-500">
                          ServiceDetailID: {s.ServiceDetailID} | QuoteID: {s.QuoteID}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">No services found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary card */}
    <div className="mb-4">
  {selectedService?.ItemName && (
    <h2 className="text-base font-semibold text-gray-800 mb-3">{selectedService.ItemName}</h2>
  )}

  {loadingTasks ? (
    <div className="py-4 text-gray-500">Loading summary...</div>
  ) : tasksError ? (
    <div className="py-4 text-red-500">{tasksError}</div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Total Tasks Completed</p>
        <p className="text-base font-semibold text-gray-800">{totalTasksCompleted}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Start Date</p>
        <p className="text-base font-semibold text-gray-800">{startDate}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1.5">payment Due</p>
        <p className="text-base font-semibold text-gray-800">{paymentDue}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Status</p>
        <div className="flex items-center gap-1.5">
          <div className="relative w-24 h-5 rounded-full bg-gray-100 overflow-hidden flex items-center">
            <div
              className="absolute left-0 top-0 h-full bg-yellow-400 rounded-full"
              style={{ width: `${overallPercent}%` }}
            />
            <span className="relative z-10 pl-2 text-[10px] font-semibold text-white whitespace-nowrap">
              {overallStatusLabel}
            </span>
          </div>
          <span className="text-xs text-gray-400">/</span>
          <span className="text-xs font-semibold text-gray-800">{overallPercent}%</span>
        </div>
      </div>
    </div>
  )}
</div>

      {/* Navigation Tabs */}
      <div className="border-t border-[#F3C625] mt-8 mb-6">
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-8">
            {["Task", "Documents", "Deliverables"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCollectDataTask(null);
                  setNoteTask(null);
                }}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab && !collectDataTask && !noteTask
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
            {collectDataTask && (
              <button className="pb-3 px-1 border-b-2 font-medium text-sm border-yellow-400 text-yellow-600" disabled>
                Collect Data
              </button>
            )}
            {noteTask && (
              <button className="pb-3 px-1 border-b-2 font-medium text-sm border-red-400 text-red-600" disabled>
                Add Note
              </button>
            )}
          </div>

          {activeTab === "Task" && !collectDataTask && !noteTask && (
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Status: <span className="font-medium">{statusFilter}</span>
                <span className="text-xs">▾</span>
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {STATUS_FILTERS.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                        statusFilter === s ? "text-yellow-600 font-medium" : "text-gray-600"
                      }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {collectDataTask ? (
        <CollectDataForm task={collectDataTask} onBack={() => setCollectDataTask(null)} />
      ) : noteTask ? (
        <NoteForm task={noteTask} onBack={() => setNoteTask(null)} />
      ) : activeTab === "Task" ? (
        <div className="mb-10">
          {/* Current Task */}
          <div className="mb-10">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Current Task</h3>
            <div className="text-xs font-medium text-yellow-500 border-b-2 border-yellow-400 inline-block pb-2 mb-2">
              All
            </div>
            <div className="grid grid-cols-[24px_1fr_120px_110px_150px_150px] gap-4 pb-2 mb-1 text-xs font-medium text-gray-400 border-b border-gray-100">
              <div />
              <div>Task</div>
              <div>Status</div>
              <div>Date</div>
              <div>Progress</div>
              <div>Assignee</div>
            </div>
            {loadingTasks ? (
              <div className="py-6 text-gray-500 text-sm">Loading tasks...</div>
            ) : filteredCurrentTasks.length > 0 ? (
              filteredCurrentTasks.map((task) => <TaskRow key={task.id} task={task} />)
            ) : (
              <div className="py-6 text-gray-500 text-sm">No current tasks.</div>
            )}
          </div>

          {/* Upcoming Task */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Upcoming Task</h3>
            <div className="flex items-center gap-1.5 pb-2 mb-2">
              <span className="text-xs font-medium text-yellow-500 border-b-2 border-yellow-400 pb-2">All</span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
            </div>
            <div className="grid grid-cols-[24px_1fr_120px_110px_150px_150px] gap-4 pb-2 mb-1 text-xs font-medium text-gray-300 border-b border-gray-50">
              <div />
              <div>Task</div>
              <div>Status</div>
              <div>Date</div>
              <div>Progress</div>
              <div>Assignee</div>
            </div>
            {filteredUpcomingTasks.length > 0 ? (
              filteredUpcomingTasks.map((task) => <TaskRow key={task.id} task={task} disabled />)
            ) : (
              <div className="py-6 text-gray-400 text-sm">No upcoming tasks.</div>
            )}
          </div>

          {/* Keep the original dynamic task listing available, hidden below the
              redesigned tables, so real per-field submission logic is not lost */}
          <div className="hidden">
            <ServiceTaskListing
              formConfig={formConfig}
              responseFields={responseFields}
              serviceDetails={{
                CompanyID: companyId,
                ServiceID: service?.ServiceID,
                QuoteID: service?.QuoteID,
                OrderID: service?.OrderID,
                submittedBy: service?.submittedBy ?? getSecureItem("partnerUser")?.EmployeeID,
              }}
              onTaskUpdate={fetchFields}
            />
          </div>
        </div>
      ) : activeTab === "Documents" ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
          {loadingDocuments && <p className="text-gray-600">Loading documents...</p>}
          {documentsError && <p className="text-red-500">{documentsError}</p>}
          {!loadingDocuments && !documentsError && verifiedFields.length > 0 && (
            <div className="flex flex-col gap-3">
              {verifiedFields.map((field) => (
                <div
                  key={field.fieldRows_id}
                  className="flex items-center justify-between border border-yellow-400 rounded-full px-5 py-3"
                >
                  <span className="text-sm text-gray-700 truncate max-w-lg">{field.field_key}</span>
                  {field.field_type === "File" ? (
                    <a
                      href={field.field_text}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-gray-500 hover:text-yellow-600 flex-shrink-0"
                      title="Download"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="ml-4 text-gray-800 font-semibold">{field.field_text}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {!loadingDocuments && !documentsError && verifiedFields.length === 0 && (
            <p className="text-gray-600">No verified documents found.</p>
          )}
        </div>
      ) : activeTab === "Deliverables" ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Uploaded</h3>
          {loadingDeliverables && <p className="text-gray-600">Loading deliverables...</p>}
          {deliverablesError && <p className="text-red-500">{deliverablesError}</p>}
          {!loadingDeliverables && !deliverablesError && Array.isArray(serviceDeliverables) && serviceDeliverables.length > 0 && (
            <div className="flex flex-col gap-3">
              {serviceDeliverables.map((item) => {
                const isFile = item.type === "file";
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-yellow-400 rounded-full px-5 py-3"
                  >
                    <span className="text-sm text-gray-700 truncate max-w-lg">{item.label}</span>
                    {isFile ? (
                      <a
                        href={item.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-gray-500 hover:text-yellow-600 flex-shrink-0"
                        title="Download"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <span className="ml-4 text-gray-800 font-semibold">{item.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {!loadingDeliverables && !deliverablesError && Array.isArray(serviceDeliverables) && serviceDeliverables.length === 0 && (
            <p className="text-gray-600">No deliverables available yet.</p>
          )}
        </div>
      ) : null}

      {/* Fixed Chat Button */}
      <button className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-sm font-semibold px-7 py-3 rounded-full shadow-lg">
        CHAT
      </button>
    </div>
  );
}
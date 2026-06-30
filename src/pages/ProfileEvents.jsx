import { useState } from 'react';
import {
  Calendar,
  Pencil,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Calculator,
  Building2,
  BookOpen,
  FileText,
  UserCheck,
  Shield,
  Briefcase,
  Users,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Mic
} from 'lucide-react';

/* ---------- shared status config ---------- */

const statusConfig = {
  Complete: { icon: CheckCircle2, color: 'text-green-600', pillBg: 'bg-green-100 text-green-700' },
  Yes: { icon: CheckCircle2, color: 'text-green-600', pillBg: 'bg-green-100 text-green-700' },
  Pending: { icon: Clock, color: 'text-amber-600', pillBg: 'bg-amber-100 text-amber-700' },
  'Not Applicable': { icon: AlertCircle, color: 'text-orange-600', pillBg: 'bg-orange-100 text-orange-700' },
  No: { icon: XCircle, color: 'text-red-500', pillBg: 'bg-red-100 text-red-600' }
};

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 transition-colors text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md"
  >
    <Pencil className="w-4 h-4" />
    {label}
  </button>
);

/* ---------- view mode (read-only cards) ---------- */

const registrationItems = [
  { id: 1, title: 'IE Code', subtitle: 'Import Export Code registration', status: 'Not Applicable', icon: <Briefcase className="w-5 h-5 text-amber-600" /> },
  { id: 2, title: 'FSSAI', subtitle: 'Food Safety and Standards Authority of India', status: 'Complete', icon: <Shield className="w-5 h-5 text-amber-600" /> },
  { id: 3, title: 'ESI Registration', subtitle: 'Employee State Insurance registration', status: 'Complete', icon: <Users className="w-5 h-5 text-amber-600" /> },
  { id: 4, title: 'EPF Registration', subtitle: 'Employee Provident Fund registration', status: 'Pending', icon: <Users className="w-5 h-5 text-amber-600" /> },
  { id: 5, title: 'TDS Returns', subtitle: 'Tax Deducted at Source filing', status: 'Complete', icon: <FileText className="w-5 h-5 text-amber-600" /> }
];

const complianceItems = [
  { id: 1, title: 'GST Returns', subtitle: 'Tax filing status', status: 'Up to Date', icon: <Calculator className="w-5 h-5 text-amber-500" /> },
  { id: 2, title: 'ROC Filing', subtitle: 'Current: FY 2023-24', status: 'Current', icon: <Building2 className="w-5 h-5 text-amber-500" /> },
  { id: 3, title: 'Books of Accounts', subtitle: 'Accounting records maintenance', status: 'Up to Date', icon: <BookOpen className="w-5 h-5 text-amber-500" /> },
  { id: 4, title: 'IT Returns', subtitle: 'Current: FY 2023-24', status: 'Up to Date', icon: <FileText className="w-5 h-5 text-amber-500" /> },
  { id: 5, title: 'Auditor', subtitle: 'Professional auditor assigned', status: 'Assigned', icon: <UserCheck className="w-5 h-5 text-amber-500" /> }
];

const StatusRow = ({ icon, title, subtitle, status, pill }) => (
  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${pill || 'bg-amber-100 text-amber-700'}`}>
      {status}
    </span>
  </div>
);

const RegistrationStatusCard = ({ onEdit }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-medium text-gray-900">Registration Status (For Compliance Calendar)</h2>
      </div>
      <ActionButton label="Edit Status" onClick={onEdit} />
    </div>
    <div className="space-y-2">
      {registrationItems.map((item) => (
        <StatusRow key={item.id} {...item} pill={statusConfig[item.status]?.pillBg} />
      ))}
    </div>
    <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-900">Compliance Progress</div>
        <div className="text-xs text-gray-500">Overall registration completion status</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }} />
        </div>
        <span className="text-sm font-medium text-gray-700">75%</span>
      </div>
    </div>
  </div>
);

const ComplianceStatusCard = ({ onEdit }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-medium text-gray-900">Compliance Status</h2>
      </div>
      <ActionButton label="Update Status" onClick={onEdit} />
    </div>
    <div className="space-y-2">
      {complianceItems.map((item) => (
        <StatusRow key={item.id} {...item} pill="bg-amber-100 text-amber-700" />
      ))}
    </div>
    <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-900">Overall Compliance</div>
        <div className="text-xs text-gray-500">All compliance requirements met</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
        </div>
        <span className="text-sm font-medium text-gray-700">100%</span>
      </div>
    </div>
  </div>
);

/* ---------- edit mode form controls ---------- */

const StatusSelect = ({ value, options }) => {
  const config = statusConfig[value] || statusConfig.Pending;
  const Icon = config.icon;
  return (
    <div className="relative">
      <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${config.color} pointer-events-none`} />
      <select
        defaultValue={value}
        className={`w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-9 py-2 text-sm font-medium ${config.color} focus:outline-none focus:ring-2 focus:ring-amber-400`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

const TextField = ({ value }) => (
  <input
    type="text"
    defaultValue={value}
    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
  />
);

const EditHeader = ({ title, subtitle, onBack }) => (
  <div className="flex items-center gap-3 mb-6">
    <button
      onClick={onBack}
      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 flex-shrink-0"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
    <div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const EditFooter = ({ onCancel, onSubmit, submitLabel }) => (
  <div className="flex items-center justify-end gap-3 mt-6">
    <button
      onClick={onCancel}
      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      onClick={onSubmit}
      className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium shadow-md"
    >
      {submitLabel}
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

const Connector = () => <div className="w-px h-4 border-l border-dashed border-gray-300 mx-auto" />;

/* ---------- Registration Status edit form ---------- */

const registrationEditItems = [
  { id: 1, icon: Briefcase, title: 'IE Code', subtitle: 'Import Export Code registration', question: 'DO YOU HAVE IE CODE ?', value: 'Not Applicable', options: ['Not Applicable', 'Complete', 'Pending'] },
  { id: 2, icon: Shield, title: 'FSSAI', subtitle: 'Food Safety and Standards Authority of India', question: 'DO YOU HAVE FSSAI?', value: 'Complete', options: ['Complete', 'Pending', 'Not Applicable'] },
  { id: 3, icon: Users, title: 'ESI Registration', subtitle: 'Employee State Insurance registration', question: 'DO YOU HAVE ESI REGISTRATION?', value: 'Complete', options: ['Complete', 'Pending', 'Not Applicable'] },
  { id: 4, icon: Users, title: 'EPF Registration', subtitle: 'Employee Provident Fund registration', question: 'DO YOU HAVE EPF REGISTRATION?', value: 'Pending', options: ['Complete', 'Pending', 'Not Applicable'] },
  { id: 5, icon: FileText, title: 'TDS Returns', subtitle: 'Tax Deducted at Source filing', question: 'DO YOU FILE TDS RETURNS?', value: 'Complete', options: ['Complete', 'Pending', 'Not Applicable'] }
];

const RegistrationStatusEdit = ({ onCancel, onSave }) => (
  <div>
    <EditHeader title="Registration Status" subtitle="Update your compliance registration information" onBack={onCancel} />

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
        <FileText className="w-4 h-4 text-amber-500" />
        Registration Requirements
      </div>

      {registrationEditItems.map((item, idx) => (
        <div key={item.id}>
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusConfig[item.value]?.pillBg}`}>
                {item.value}
              </span>
            </div>
            <div className="text-xs font-medium text-gray-500 mb-2 ml-12">{item.question}</div>
            <div className="ml-12">
              <StatusSelect value={item.value} options={item.options} />
            </div>
          </div>
          {idx < registrationEditItems.length - 1 && <Connector />}
        </div>
      ))}
    </div>

    <EditFooter onCancel={onCancel} onSubmit={onSave} submitLabel="Save Changes" />
  </div>
);

/* ---------- Compliance Status Check edit form ---------- */

const complianceEditItems = [
  { id: 1, icon: Calculator, question: 'ARE GST RETURNS UP TO DATE?', type: 'select', value: 'Yes', options: ['Yes', 'No'] },
  { id: 2, icon: Building2, question: 'IS ROC FILING CURRENT?', type: 'text', value: 'FY 2023-24' },
  { id: 3, icon: BookOpen, question: 'BOOKS OF ACCOUNTS UP TO DATE?', type: 'select', value: 'Yes', options: ['Yes', 'No'] },
  { id: 4, icon: FileText, question: 'IS IT RETURN UP TO DATE?', type: 'text', value: 'FY 2023-24' },
  { id: 5, icon: UserCheck, question: 'DO YOU HAVE AN AUDITOR?', type: 'select', value: 'Yes', options: ['Yes', 'No'] }
];

const AudioField = ({ label }) => (
  <div className="mb-4 last:mb-0">
    <label className="text-xs font-medium text-gray-500 block mb-2">{label}</label>
    <div className="relative">
      <textarea
        placeholder="Audio to Text"
        rows={3}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white">
        <Mic className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ComplianceStatusEdit = ({ onCancel, onSave }) => (
  <div>
    <EditHeader title="Compliance Status Check" subtitle="Update your compliance and business information" onBack={onCancel} />

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        Compliance Status Check
      </div>

      {complianceEditItems.map((item, idx) => (
        <div key={item.id}>
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-sm font-semibold text-gray-800 tracking-wide">{item.question}</div>
              </div>
              {item.type === 'select' && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusConfig[item.value]?.pillBg}`}>
                  {item.value}
                </span>
              )}
            </div>
            <div className="ml-12">
              {item.type === 'select' ? (
                <StatusSelect value={item.value} options={item.options} />
              ) : (
                <TextField value={item.value} />
              )}
            </div>
          </div>
          {idx < complianceEditItems.length - 1 && <Connector />}
        </div>
      ))}
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
      <div className="text-sm font-medium text-gray-700 mb-4">Business Understanding</div>
      <AudioField label="TELL US MORE ABOUT YOUR BUSINESS" />
      <AudioField label="WHAT IS YOUR EXPECTATION FROM BIZPOLE?" />
    </div>

    <EditFooter onCancel={onCancel} onSubmit={onSave} submitLabel="Next" />
  </div>
);

/* ---------- page ---------- */

const tabs = [
  { id: 'registration', label: 'Registration Status' },
  { id: 'compliance', label: 'Compliance Status' }
];

const CompliancePage = () => {
  const [activeTab, setActiveTab] = useState('registration');
  const [isEditing, setIsEditing] = useState(false);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Compliance</h1>
      <div className="max-w-5xl mx-auto">
        {!isEditing && (
          <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'registration' ? (
          isEditing ? (
            <RegistrationStatusEdit onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
          ) : (
            <RegistrationStatusCard onEdit={() => setIsEditing(true)} />
          )
        ) : isEditing ? (
          <ComplianceStatusEdit onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
        ) : (
          <ComplianceStatusCard onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
};

export default CompliancePage;
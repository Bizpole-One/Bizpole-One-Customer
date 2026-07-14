import { FolderOpen, CreditCard, FileText, Check, AlertCircle, ChevronRight } from "lucide-react";

const docs = [
  { title: "Certificate of Incorporation", meta: "PDF · 1.2 MB · 12 Jan 2024" },
  { title: "GST Certificate", meta: "PDF · 480 KB · 03 Feb 2024" },
  { title: "GSTR-3B — June 2026", meta: "PDF · 210 KB · 11 Jul 2026" },
  { title: "PAN & TAN", meta: "PDF · 95 KB · Verified" },
];

const invoices = [
  { title: "INV-2026-0412 · GST Package", meta: "Paid · ₹ 11,800", paid: true },
  { title: "INV-2026-0388 · ROC Filing", meta: "Paid · ₹ 6,490", paid: true },
  { title: "INV-2026-0455 · Trademark", meta: "Due 18 Jul · ₹ 8,260", paid: false },
];

const Card = ({ children }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm">{children}</div>
);

const CardHead = ({ icon: Icon, title, link }) => (
  <div className="mb-4 flex items-center justify-between gap-2">
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    </div>
    {link && (
      <button className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-yellow-700 hover:underline">
        {link} <ChevronRight className="h-3 w-3" />
      </button>
    )}
  </div>
);

const VaultFinance = () => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    {/* Document vault */}
    <Card>
      <CardHead icon={FolderOpen} title="Document Vault" link="Browse all" />
      <div className="space-y-2">
        {docs.map((d) => (
          <div key={d.title} className="flex items-center gap-3 rounded-xl border border-gray-200 p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <b className="text-[13px] text-gray-800">{d.title}</b>
              <p className="text-[11px] text-gray-500">{d.meta}</p>
            </div>
            <button className="text-xs font-semibold text-yellow-700 hover:underline">Download</button>
          </div>
        ))}
      </div>
    </Card>

    {/* Invoices */}
    <Card>
      <CardHead icon={CreditCard} title="Invoices & Payments" link="All invoices" />
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.title} className="flex items-center gap-3 rounded-xl border border-gray-200 p-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                inv.paid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {inv.paid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <b className="text-[13px] text-gray-800">{inv.title}</b>
              <p className="text-[11px] text-gray-500">{inv.meta}</p>
            </div>
            <button
              className={`text-xs font-semibold hover:underline ${
                inv.paid ? "text-yellow-700" : "text-red-600"
              }`}
            >
              {inv.paid ? "Receipt" : "Pay now"}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-[13px]">
        <span className="text-gray-500">Outstanding balance</span>
        <b className="text-gray-900">₹ 8,260</b>
      </div>
    </Card>
  </div>
);

export default VaultFinance;

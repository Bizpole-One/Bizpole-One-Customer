import { Shield, AlertTriangle, CalendarDays, TrendingUp, ChevronRight } from "lucide-react";

const statusStyles = {
  ok: "bg-green-100 text-green-700",
  warn: "bg-amber-100 text-amber-700",
  due: "bg-red-100 text-red-600",
};

const dotColors = {
  green: "bg-green-600",
  amber: "bg-amber-500",
  red: "bg-red-600",
};

const breakdown = [
  { name: "GST Returns", dot: "green", status: "Filed", tone: "ok" },
  { name: "TDS Payment", dot: "green", status: "Paid", tone: "ok" },
  { name: "ROC Annual Filing", dot: "amber", status: "Pending", tone: "warn" },
  { name: "PF / ESI", dot: "red", status: "Due 5 days", tone: "due" },
  { name: "Income Tax", dot: "green", status: "On track", tone: "ok" },
];

const alerts = [
  {
    bar: "bg-red-600",
    title: "₹2,500 late fee risk",
    body: "GSTR-3B not filed — penalty starts after 20 Jul.",
    cta: "File now",
  },
  {
    bar: "bg-amber-500",
    title: "PF challan due",
    body: "Deposit before 15 Jul to avoid interest.",
    cta: "Pay",
  },
  {
    bar: "bg-blue-600",
    title: "DIN KYC reminder",
    body: "Director KYC window opens this month.",
    cta: "Remind",
  },
];

const deadlines = [
  { d: "15", m: "Jul", title: "PF & ESI Payment", sub: "Statutory · Monthly", status: "Due", tone: "due" },
  { d: "20", m: "Jul", title: "GSTR-3B Filing", sub: "GST · Monthly summary return", status: "Soon", tone: "warn" },
  { d: "31", m: "Jul", title: "TDS Return (Q1)", sub: "Income Tax · Quarterly", status: "Soon", tone: "warn" },
  { d: "30", m: "Sep", title: "ROC Annual Return", sub: "MCA · AOC-4 / MGT-7", status: "Planned", tone: "ok" },
];

const trend = [
  { m: "Feb", h: 62 },
  { m: "Mar", h: 68 },
  { m: "Apr", h: 71 },
  { m: "May", h: 78 },
  { m: "Jun", h: 82 },
  { m: "Jul", h: 86, active: true },
];

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHead = ({ icon: Icon, title, sub, link }) => (
  <div className="mb-4 flex items-start justify-between gap-2">
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
    {link && (
      <button className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-yellow-700 hover:underline">
        {link} <ChevronRight className="h-3 w-3" />
      </button>
    )}
  </div>
);

const ComplianceHealth = () => {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const score = 86;
  const offset = circ * (1 - score / 100);

  return (
    <>
      {/* Row 1: breakdown + risk alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            icon={Shield}
            title="Compliance Score Breakdown"
            sub="Why your score is 86 — tap any item to fix"
            link="View all"
          />
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Gauge */}
            <div className="relative h-[130px] w-[130px] shrink-0">
              <svg viewBox="0 0 120 120" className="h-[130px] w-[130px]">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="14" />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#FFC42A"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <b className="text-3xl font-extrabold text-gray-900">{score}</b>
                <small className="text-[11px] text-gray-500">Good standing</small>
              </div>
            </div>
            {/* Breakdown list */}
            <div className="flex-1 self-stretch">
              {breakdown.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between border-b border-dashed border-gray-200 py-2 text-sm last:border-0"
                >
                  <span className="flex items-center text-gray-700">
                    <span className={`mr-2 inline-block h-2 w-2 rounded-full ${dotColors[row.dot]}`} />
                    {row.name}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyles[row.tone]}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHead icon={AlertTriangle} title="Risk Alerts" />
          <div className="space-y-2.5">
            {alerts.map((a) => (
              <div
                key={a.title}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-3"
              >
                <span className={`w-1 self-stretch rounded ${a.bar}`} />
                <div className="flex-1">
                  <b className="text-[13px] text-gray-800">{a.title}</b>
                  <p className="mt-0.5 text-xs text-gray-500">{a.body}</p>
                </div>
                <button className="shrink-0 whitespace-nowrap text-[11px] font-bold text-yellow-700 hover:underline">
                  {a.cta} ›
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: deadlines + trend */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead icon={CalendarDays} title="Upcoming Deadlines" link="Open calendar" />
          <div>
            {deadlines.map((dl) => (
              <div
                key={dl.title}
                className="flex items-center gap-3 border-b border-gray-100 py-2.5 last:border-0"
              >
                <div className="w-12 shrink-0 rounded-lg bg-gray-50 py-1.5 text-center">
                  <b className="block text-base leading-none text-gray-900">{dl.d}</b>
                  <small className="text-[10px] uppercase text-gray-500">{dl.m}</small>
                </div>
                <div className="flex-1">
                  <b className="text-[13px] text-gray-800">{dl.title}</b>
                  <p className="text-[11px] text-gray-500">{dl.sub}</p>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyles[dl.tone]}`}>
                  {dl.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead icon={TrendingUp} title="Compliance Score Trend" />
          <div className="flex h-32 items-end gap-2 pt-2">
            {trend.map((t) => (
              <div key={t.m} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className={`w-full rounded-t-lg ${t.active ? "bg-yellow-600" : "bg-yellow-400"}`}
                  style={{ height: `${t.h}%` }}
                />
                <small className="text-[10px] text-gray-400">{t.m}</small>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            Up 24 points since onboarding with Bizpole — a clear, shareable proof of value.
          </p>
        </Card>
      </div>
    </>
  );
};

export default ComplianceHealth;

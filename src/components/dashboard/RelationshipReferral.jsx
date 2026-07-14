import { UserRound, MessageCircle, Phone, CalendarPlus, Copy } from "lucide-react";

const RelationshipReferral = () => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    {/* Relationship manager */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
          <UserRound className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">Your Relationship Manager</h3>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-yellow-100 text-lg font-extrabold text-yellow-700">
          AK
        </div>
        <div>
          <b className="text-sm text-gray-800">Aisha Kapoor</b>
          <p className="text-xs text-gray-500">Dedicated RM · Mon–Sat, 10am–7pm</p>
          <p className="text-[11px] font-semibold text-green-600">● Online now</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-yellow-400 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-yellow-500">
          <MessageCircle className="h-3.5 w-3.5" /> Chat
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
          <Phone className="h-3.5 w-3.5" /> Call
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
          <CalendarPlus className="h-3.5 w-3.5" /> Book meeting
        </button>
      </div>
    </div>

    {/* Referral */}
    <div className="rounded-2xl border border-dashed border-yellow-400 bg-yellow-50 p-5 text-center">
      <h4 className="text-base font-bold text-gray-800">Refer a business, earn ₹1,000 🎁</h4>
      <p className="mx-auto my-2 max-w-sm text-xs text-gray-600">
        Your friend gets 10% off their first service. You get ₹1,000 credit.
      </p>
      <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 font-extrabold tracking-wide text-gray-800">
        SUNRISE1000
        <button className="flex items-center gap-1 text-xs font-semibold text-yellow-700 hover:underline">
          <Copy className="h-3.5 w-3.5" /> Copy
        </button>
      </div>
    </div>
  </div>
);

export default RelationshipReferral;

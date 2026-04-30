import { Link } from "react-router-dom";
import { Home, ClipboardCheck, Mic, AlertTriangle, Bell } from "lucide-react";

const screens = [
  { path: "/splice/today", title: "Today's Units", desc: "Home screen with daily progress", Icon: Home },
  { path: "/splice/unit/HH-047", title: "Unit Detail", desc: "Complete a unit", Icon: ClipboardCheck },
  { path: "/splice/fieldvoice", title: "FieldVoice™", desc: "Voice recording screen", Icon: Mic },
  { path: "/splice/emergency", title: "Emergency Job", desc: "Dispatch a priority ticket", Icon: AlertTriangle },
  { path: "/splice/pulseflow", title: "PulseFlow™", desc: "Notification & briefing center", Icon: Bell },
];

const SpliceIndex = () => {
  return (
    <div className="min-h-screen bg-[#F2F2F7] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-[#1A56DB]">
          SpliceOps Prototype
        </p>
        <h1 className="text-3xl font-bold text-black mt-1">iOS Mobile Screens</h1>
        <p className="text-[15px] text-[#6B7280] mt-2">
          Five screens for fiber-construction field crews. Tap any to open the iPhone 14 prototype.
        </p>

        <div className="mt-8 space-y-3">
          {screens.map(({ path, title, desc, Icon }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#1A56DB] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EFF4FE] flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#1A56DB]" />
              </div>
              <div className="flex-1">
                <p className="text-[17px] font-semibold text-black">{title}</p>
                <p className="text-[13px] text-[#6B7280]">{desc}</p>
              </div>
              <span className="text-[13px] text-[#1A56DB] font-semibold">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpliceIndex;

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CloudSun,
  Megaphone,
  Wrench,
  ChevronRight,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";
import SpliceTabBar from "@/components/splice/SpliceTabBar";

type Tab = "all" | "alerts" | "briefings";

interface Item {
  id: string;
  kind: "alert" | "briefing" | "approval" | "weather" | "broadcast";
  title: string;
  body: string;
  time: string;
  unread?: boolean;
}

const items: Item[] = [
  {
    id: "1",
    kind: "alert",
    title: "Permit issue on BR-203",
    body: "City inspector flagged setback. Pause work until reviewed.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    kind: "briefing",
    title: "Daily briefing — Crew A",
    body: "Focus zone: Maple District. 12 handholes, 4 bores. Watch for buried gas line at 4th & Oak.",
    time: "6:45 AM",
    unread: true,
  },
  {
    id: "3",
    kind: "approval",
    title: "PL-088 approved by Sarah",
    body: "Plow unit verified. 640 ft logged to project ledger.",
    time: "1h ago",
  },
  {
    id: "4",
    kind: "weather",
    title: "Weather advisory",
    body: "Thunderstorms expected after 3 PM. Aerial work should wrap by 2:30.",
    time: "7:10 AM",
  },
  {
    id: "5",
    kind: "broadcast",
    title: "Safety reminder",
    body: "New trench shoring SOP effective Monday. Review attached document.",
    time: "Yesterday",
  },
  {
    id: "6",
    kind: "alert",
    title: "HH-046 rejected by QC",
    body: "Sequential number missing. Re-photograph and resubmit.",
    time: "Yesterday",
  },
];

const kindStyle: Record<Item["kind"], { Icon: typeof Wrench; color: string; bg: string; label: string }> = {
  alert: { Icon: AlertTriangle, color: "#991B1B", bg: "#FDECEC", label: "Alert" },
  briefing: { Icon: Megaphone, color: "#1A56DB", bg: "#EFF4FE", label: "Briefing" },
  approval: { Icon: CheckCircle2, color: "#057A55", bg: "#E8F6EE", label: "Approval" },
  weather: { Icon: CloudSun, color: "#B45309", bg: "#FEF6E7", label: "Weather" },
  broadcast: { Icon: Wrench, color: "#6B7280", bg: "#F3F4F6", label: "Broadcast" },
};

const PulseFlow = () => {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = items.filter((i) => {
    if (tab === "alerts") return i.kind === "alert";
    if (tab === "briefings") return i.kind === "briefing";
    return true;
  });

  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Large title nav */}
        <div className="px-4 pt-3 pb-2 bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-black">PulseFlow™</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[#1A56DB] text-white text-[12px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Briefings, alerts & approvals from your team
          </p>
        </div>

        {/* Segmented control */}
        <div className="px-4 pb-3">
          <div className="bg-[#F2F2F7] rounded-lg p-0.5 flex">
            {(["all", "alerts", "briefings"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 h-8 rounded-md text-[13px] font-semibold capitalize transition-colors"
                style={{
                  backgroundColor: tab === t ? "#FFFFFF" : "transparent",
                  color: tab === t ? "#000000" : "#6B7280",
                  boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Today's snapshot card */}
        <div className="px-4 pb-3">
          <div className="bg-[#0B1220] rounded-2xl p-4 text-white">
            <p className="text-[12px] uppercase tracking-wider text-white/60">Today's Snapshot</p>
            <div className="flex items-end gap-4 mt-2">
              <div>
                <p className="text-[28px] font-bold leading-none">23/47</p>
                <p className="text-[12px] text-white/60 mt-1">Units complete</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-[28px] font-bold leading-none text-[#FBBF24]">2</p>
                <p className="text-[12px] text-white/60 mt-1">Open alerts</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-[28px] font-bold leading-none text-[#22C55E]">98%</p>
                <p className="text-[12px] text-white/60 mt-1">QC pass</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto pb-[72px]">
          <div className="px-4 space-y-2">
            {filtered.map((item) => {
              const k = kindStyle[item.kind];
              const Icon = k.Icon;
              return (
                <button
                  key={item.id}
                  className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex gap-3 text-left active:bg-[#F9FAFB]"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: k.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: k.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: k.color }}
                      >
                        {k.label}
                      </span>
                      {item.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]" />
                      )}
                      <span className="ml-auto text-[12px] text-[#8E8E93]">{item.time}</span>
                    </div>
                    <p className="text-[16px] font-semibold text-black mt-0.5">{item.title}</p>
                    <p className="text-[13px] text-[#6B7280] mt-0.5 leading-snug">{item.body}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C7C7CC] flex-shrink-0 self-center" />
                </button>
              );
            })}
            <p className="text-center text-[12px] text-[#8E8E93] py-4">
              Swipe left on any item to mark read
            </p>
          </div>
        </div>

        <SpliceTabBar />
      </div>
    </IPhoneFrame>
  );
};

export default PulseFlow;

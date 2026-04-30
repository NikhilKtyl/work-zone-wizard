import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Mic,
  Drill,
  Cable,
  Square,
  Radio,
  WifiOff,
  X,
  ChevronRight,
  Home,
  Map,
  Layers,
  Bell,
  User,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

type UnitStatus = "not_started" | "in_progress" | "complete";
type UnitType = "bore" | "fiber" | "handhole" | "aerial";

interface Unit {
  id: string;
  type: UnitType;
  typeLabel: string;
  status: UnitStatus;
}

const units: Unit[] = [
  { id: "HH-047", type: "handhole", typeLabel: "Handhole Installation", status: "in_progress" },
  { id: "BR-203", type: "bore", typeLabel: "Directional Bore · 320 ft", status: "not_started" },
  { id: "FB-118", type: "fiber", typeLabel: "Fiber Splice · 24-count", status: "complete" },
  { id: "AE-021", type: "aerial", typeLabel: "Aerial Wire · Pole 14→19", status: "in_progress" },
  { id: "HH-048", type: "handhole", typeLabel: "Handhole Installation", status: "not_started" },
  { id: "BR-204", type: "bore", typeLabel: "Directional Bore · 180 ft", status: "complete" },
];

const typeIcon: Record<UnitType, { Icon: typeof Drill; color: string; bg: string }> = {
  bore: { Icon: Drill, color: "#1A56DB", bg: "#DBEAFE" },
  fiber: { Icon: Cable, color: "#057A55", bg: "#D1FAE5" },
  handhole: { Icon: Square, color: "#B45309", bg: "#FEF3C7" },
  aerial: { Icon: Radio, color: "#7C3AED", bg: "#EDE9FE" },
};

const statusStyle: Record<UnitStatus, { label: string; bg: string; color: string }> = {
  not_started: { label: "Not Started", bg: "#F3F4F6", color: "#6B7280" },
  in_progress: { label: "In Progress", bg: "#FEF3C7", color: "#B45309" },
  complete: { label: "Complete", bg: "#D1FAE5", color: "#057A55" },
};

const tabs = [
  { id: "home", label: "Home", Icon: Home, active: true },
  { id: "map", label: "Map", Icon: Map },
  { id: "units", label: "Units", Icon: Layers },
  { id: "bell", label: "Alerts", Icon: Bell, path: "/splice/pulseflow" },
  { id: "person", label: "Profile", Icon: User },
];

const TodaysUnits = () => {
  const navigate = useNavigate();
  const [offlineDismissed, setOfflineDismissed] = useState(false);

  const completed = 23;
  const total = 47;
  const inProgress = 6;
  const remaining = total - completed - inProgress;
  const pct = Math.round((completed / total) * 100);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto pb-[72px]">
          {/* Offline banner */}
          {!offlineDismissed && (
            <div
              className="flex items-center gap-2 px-4 bg-[#FEF3C7]"
              style={{ height: 44 }}
            >
              <WifiOff className="w-4 h-4 text-[#B45309]" />
              <p className="text-[13px] text-[#B45309] flex-1 font-medium">
                Offline — showing cached data
              </p>
              <button
                onClick={() => setOfflineDismissed(true)}
                className="w-11 h-11 -mr-3 flex items-center justify-center"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-[#B45309]" />
              </button>
            </div>
          )}

          {/* Header */}
          <button className="w-full text-left px-4 pt-4 pb-3 active:bg-[#F9FAFB]">
            <h1 className="text-[22px] font-bold text-[#111827] leading-tight">
              Good morning, Marcus
            </h1>
            <p className="text-[14px] text-[#6B7280] mt-0.5">{today}</p>
          </button>

          {/* Progress card */}
          <div className="mx-4 bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[13px] text-[#6B7280]">Today's Progress</p>
            <p className="text-[16px] font-bold text-[#111827] mt-0.5">
              {completed} of {total} units complete
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-3 bg-[#F3F4F6] rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${pct}%`, backgroundColor: "#10B981" }}
                />
              </div>
              <span className="text-[14px] font-bold text-[#10B981]">{pct}%</span>
            </div>
            <p className="text-[12px] text-[#6B7280] mt-2">
              {remaining} remaining · {inProgress} in progress
            </p>
          </div>

          {/* Section header */}
          <h2 className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Assigned Units
          </h2>

          {/* Unit list */}
          <div className="px-4 space-y-2.5">
            {units.map((u) => {
              const t = typeIcon[u.type];
              const s = statusStyle[u.status];
              const Icon = t.Icon;
              return (
                <button
                  key={u.id}
                  onClick={() => navigate(`/splice/unit/${u.id}`)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4 active:bg-[#F9FAFB]"
                  style={{ minHeight: 72 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: t.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[15px] font-bold text-[#111827]">{u.id}</p>
                    <p className="text-[13px] text-[#6B7280] truncate">{u.typeLabel}</p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[12px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating mic FAB */}
        <button
          onClick={() => navigate("/splice/fieldvoice")}
          className="absolute rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{
            width: 72,
            height: 72,
            right: 20,
            bottom: 80,
            backgroundColor: "#1A56DB",
            border: "1px solid #1E40AF",
          }}
          aria-label="FieldVoice"
        >
          <Mic className="w-7 h-7 text-white" strokeWidth={2.5} />
        </button>

        {/* Bottom Tab Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] flex items-end justify-around px-1 pb-[6px] pt-1"
          style={{ height: 56 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                onClick={() => tab.path && navigate(tab.path)}
                className="flex flex-col items-center justify-end gap-[2px] flex-1 h-full"
                style={{ minHeight: 44 }}
              >
                <Icon
                  className="w-[22px] h-[22px]"
                  style={{ color: tab.active ? "#1A56DB" : "#8E8E93" }}
                  strokeWidth={tab.active ? 2.5 : 2}
                />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: tab.active ? "#1A56DB" : "#8E8E93" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default TodaysUnits;

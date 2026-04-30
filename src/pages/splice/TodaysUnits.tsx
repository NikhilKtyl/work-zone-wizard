import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Mic,
  Drill,
  Tractor,
  Cable,
  Square,
  Hash,
  WifiOff,
  X,
  ChevronRight,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";
import SpliceTabBar from "@/components/splice/SpliceTabBar";

type UnitStatus = "not_started" | "in_progress" | "complete" | "rejected";
type UnitType = "bore" | "plow" | "aerial" | "handhole";

interface Unit {
  id: string;
  type: UnitType;
  typeLabel: string;
  status: UnitStatus;
  sequential?: string;
  detail: string;
}

const units: Unit[] = [
  { id: "HH-047", type: "handhole", typeLabel: "Handhole", status: "in_progress", sequential: "SEQ-118", detail: "Maple St & 4th Ave" },
  { id: "BR-203", type: "bore", typeLabel: "Bore (ft)", status: "not_started", detail: "320 ft · Riverside Rd" },
  { id: "PL-088", type: "plow", typeLabel: "Plow (ft)", status: "complete", sequential: "SEQ-115", detail: "640 ft · Pine District" },
  { id: "AE-021", type: "aerial", typeLabel: "Aerial Wire", status: "rejected", detail: "Pole 14 → Pole 19" },
  { id: "BR-204", type: "bore", typeLabel: "Bore (ft)", status: "not_started", detail: "180 ft · Cedar Lane" },
  { id: "HH-048", type: "handhole", typeLabel: "Handhole", status: "not_started", detail: "Oak & Main" },
  { id: "PL-089", type: "plow", typeLabel: "Plow (ft)", status: "not_started", detail: "420 ft · Birch Way" },
];

const typeIcon: Record<UnitType, { Icon: typeof Drill; color: string; bg: string }> = {
  bore: { Icon: Drill, color: "#1A56DB", bg: "#EFF4FE" },
  plow: { Icon: Tractor, color: "#7C3AED", bg: "#F3EEFE" },
  aerial: { Icon: Cable, color: "#B45309", bg: "#FEF6E7" },
  handhole: { Icon: Square, color: "#057A55", bg: "#E8F6EE" },
};

const statusStyle: Record<UnitStatus, { label: string; bg: string; color: string }> = {
  not_started: { label: "Not Started", bg: "#F3F4F6", color: "#6B7280" },
  in_progress: { label: "In Progress", bg: "#FEF6E7", color: "#B45309" },
  complete: { label: "Complete", bg: "#E8F6EE", color: "#057A55" },
  rejected: { label: "Rejected", bg: "#FDECEC", color: "#991B1B" },
};

const TodaysUnits = () => {
  const navigate = useNavigate();
  const [offlineDismissed, setOfflineDismissed] = useState(false);

  const completed = units.filter((u) => u.status === "complete").length;
  const total = 47;
  const completedTotal = 23;
  const pct = Math.round((completedTotal / total) * 100);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto pb-[72px]">
          {/* Offline banner */}
          {!offlineDismissed && (
            <div className="mx-4 mt-2 flex items-center gap-2 bg-[#FEF6E7] border border-[#F5D789] rounded-xl px-3 py-2">
              <WifiOff className="w-4 h-4 text-[#B45309]" />
              <p className="text-[13px] text-[#B45309] flex-1">
                You're offline — showing cached units
              </p>
              <button
                onClick={() => setOfflineDismissed(true)}
                className="w-8 h-8 flex items-center justify-center -mr-2"
              >
                <X className="w-4 h-4 text-[#B45309]" />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="px-4 pt-4 pb-3">
            <h1 className="text-[24px] font-bold text-black leading-tight">
              Good morning, Marcus.
            </h1>
            <p className="text-[15px] text-[#6B7280] mt-0.5">{today}</p>
          </div>

          {/* Progress */}
          <button className="w-full px-4 mb-4 text-left active:opacity-70">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[15px] font-semibold text-black">
                {completedTotal} of {total} units complete
              </p>
              <p className="text-[15px] font-semibold text-[#057A55]">{pct}%</p>
            </div>
            <div className="w-full h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: "#057A55" }}
              />
            </div>
            <p className="text-[13px] text-[#8E8E93] mt-1.5">Tap for breakdown by type</p>
          </button>

          {/* Section header */}
          <div className="px-4 pt-2 pb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Today's Units
            </h2>
            <span className="text-[13px] text-[#8E8E93]">Pull to refresh</span>
          </div>

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
                  className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3 active:bg-[#F9FAFB]"
                  style={{ minHeight: 72 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: t.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-[16px] font-bold text-black">{u.id}</p>
                      {u.sequential && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#EFF4FE] text-[#1A56DB] text-[11px] font-semibold">
                          <Hash className="w-2.5 h-2.5" />
                          {u.sequential}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#6B7280] truncate">
                      {u.typeLabel} · {u.detail}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[12px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#C7C7CC] flex-shrink-0 -ml-1" />
                </button>
              );
            })}
            <p className="text-center text-[12px] text-[#8E8E93] py-4">
              Showing 7 of {total} · scroll for more
            </p>
          </div>
        </div>

        {/* Floating FieldVoice button */}
        <button
          onClick={() => navigate("/splice/fieldvoice")}
          className="absolute right-6 bg-[#1A56DB] rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ width: 64, height: 64, bottom: 80 }}
          aria-label="FieldVoice"
        >
          <Mic className="w-7 h-7 text-white" strokeWidth={2.5} />
        </button>

        <SpliceTabBar />
      </div>
    </IPhoneFrame>
  );
};

export default TodaysUnits;

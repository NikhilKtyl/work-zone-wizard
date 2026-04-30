import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  FileText,
  Users,
  ChevronRight,
  Inbox,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

interface Alert {
  id: string;
  kind: "rejected" | "invoice" | "crew" | "change";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const alertsInitial: Alert[] = [
  {
    id: "a1",
    kind: "rejected",
    title: "Unit HH-047 Rejected",
    body: "FM requested photo retake — too dark",
    time: "2h ago",
    unread: true,
  },
  {
    id: "a2",
    kind: "invoice",
    title: "Invoice Ready: $84,500",
    body: "Midwest Fiber Co — Route 66 Project",
    time: "1h ago",
    unread: true,
  },
  {
    id: "a3",
    kind: "crew",
    title: "New units assigned",
    body: "47 units added to your crew — Eastside Build",
    time: "3h ago",
    unread: false,
  },
];

const alertStyle = {
  rejected: {
    Icon: AlertTriangle,
    color: "#991B1B",
    stripe: "#B91C1C",
    bg: "#FEE2E2",
  },
  invoice: {
    Icon: FileText,
    color: "#057A55",
    stripe: "#10B981",
    bg: "#D1FAE5",
  },
  crew: {
    Icon: Users,
    color: "#1A56DB",
    stripe: "#1A56DB",
    bg: "#DBEAFE",
  },
  change: {
    Icon: AlertTriangle,
    color: "#B45309",
    stripe: "#B45309",
    bg: "#FEF3C7",
  },
} as const;

const PulseFlow = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(alertsInitial);

  const markAllRead = () =>
    setAlerts((arr) => arr.map((a) => ({ ...a, unread: false })));
  const markRead = (id: string) =>
    setAlerts((arr) => arr.map((a) => (a.id === id ? { ...a, unread: false } : a)));

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Nav */}
        <div className="h-11 flex items-center justify-between px-3 border-b border-[#E5E7EB] relative flex-shrink-0">
          <button
            onClick={() => navigate("/splice/today")}
            className="text-[17px] text-[#1A56DB] h-11 flex items-center"
            style={{ minWidth: 44 }}
          >
            ‹ Home
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111827]">
            Notifications
          </h1>
          <button
            onClick={markAllRead}
            className="text-[14px] font-semibold text-[#1A56DB] h-11 flex items-center px-1"
          >
            Mark All Read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          {/* Push notification preview */}
          <div className="px-4 pt-4">
            <p className="text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-2 px-1">
              Just now
            </p>
            <div
              className="bg-white rounded-xl p-3 flex items-start gap-2.5 border border-[#E5E7EB]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#1A56DB] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[15px] font-bold">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#111827]">SpliceOps</span>
                  <span className="text-[12px] text-[#9CA3AF]">now</span>
                </div>
                <p className="text-[14px] font-semibold text-[#111827] mt-0.5">
                  Good morning, Marcus
                </p>
                <p className="text-[13px] text-[#6B7280] leading-snug">
                  2 projects behind pace · Invoice $84K ready to send
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC] mt-0.5" />
            </div>
          </div>

          {/* Today section */}
          <p className="px-4 pt-5 pb-2 text-[12px] uppercase tracking-wider font-semibold text-[#9CA3AF]">
            Today
          </p>

          {/* PulseFlow Briefing */}
          <div className="mx-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#1A56DB]" />
              <p className="text-[14px] font-bold text-[#111827]">
                PulseFlow Daily Briefing
              </p>
              <span className="ml-auto text-[12px] text-[#6B7280]">6:00 AM</span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                "2 projects at risk — Westside and Route 66",
                "Invoice $84,500 ready to send to Midwest Fiber",
                "Crew C velocity dropped 40% this week",
              ].map((item) => (
                <button
                  key={item}
                  className="w-full flex items-center gap-2 text-left active:opacity-70"
                >
                  <p className="text-[13px] text-[#1A56DB] font-medium flex-1 leading-snug">
                    {item}
                  </p>
                  <ChevronRight className="w-3.5 h-3.5 text-[#1A56DB] flex-shrink-0" />
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <button className="text-[13px] font-semibold text-[#1A56DB]">
                View full briefing →
              </button>
            </div>
          </div>

          {/* Alerts */}
          <p className="px-4 pt-5 pb-2 text-[12px] uppercase tracking-wider font-semibold text-[#9CA3AF]">
            Alerts
          </p>

          {alerts.length === 0 ? (
            <div className="px-4 py-12 flex flex-col items-center text-center">
              <Inbox className="w-12 h-12 text-[#D1D5DB]" strokeWidth={1.5} />
              <p className="text-[16px] font-bold text-[#111827] mt-3">
                You're all caught up!
              </p>
              <p className="text-[14px] text-[#6B7280] mt-1">
                Check back later for updates
              </p>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              {alerts.map((a) => {
                const s = alertStyle[a.kind];
                const Icon = s.Icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => markRead(a.id)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-3 text-left active:bg-[#F9FAFB] relative overflow-hidden"
                  >
                    {/* Left stripe */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: s.stripe }}
                    />
                    {/* Unread dot */}
                    <div className="flex flex-col items-center pt-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: a.unread ? "#1A56DB" : "transparent",
                        }}
                      />
                    </div>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: s.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="text-[14px] font-bold text-[#111827] flex-1 leading-snug">
                          {a.title}
                        </p>
                        <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">
                          {a.time}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#6B7280] mt-0.5 leading-snug">
                        {a.body}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C7C7CC] flex-shrink-0 self-center" />
                  </button>
                );
              })}
              <p className="text-center text-[12px] text-[#9CA3AF] py-2">
                Swipe left to dismiss
              </p>
            </div>
          )}
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default PulseFlow;

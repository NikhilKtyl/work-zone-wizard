import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  MapPin,
  Hash,
  FileText,
  Check,
  AlertCircle,
  MessageSquare,
  Clock,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

const requirements = [
  { id: "photo", label: "Photo Required", icon: Camera, complete: true, detail: "2 photos captured" },
  { id: "gps", label: "GPS Location", icon: MapPin, complete: true, detail: "37.7749, -122.4194" },
  { id: "seq", label: "Sequential Number", icon: Hash, complete: false, detail: "SEQ-### required" },
  { id: "notes", label: "Field Notes", icon: FileText, complete: false, detail: "Optional" },
];

const SpliceUnitDetail = () => {
  const navigate = useNavigate();
  const { unitId = "HH-047" } = useParams();

  const allComplete = requirements.filter((r) => !r.complete && r.id !== "notes").length === 0;

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Nav bar */}
        <div className="h-11 flex items-center justify-between px-2 border-b border-[#E5E7EB] bg-white relative">
          <button
            onClick={() => navigate("/splice/today")}
            className="flex items-center gap-0.5 text-[#1A56DB] h-11 px-2"
            style={{ minWidth: 44 }}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[17px]">Today</span>
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-black">
            {unitId}
          </h1>
          <div className="w-16" />
        </div>

        <div className="flex-1 overflow-y-auto pb-32">
          {/* Hero */}
          <div className="px-4 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-full bg-[#FEF6E7] text-[#B45309] text-[12px] font-semibold">
                In Progress
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#EFF4FE] text-[#1A56DB] text-[12px] font-semibold">
                Handhole
              </span>
            </div>
            <h2 className="text-[22px] font-bold text-black mt-2">Maple St & 4th Ave</h2>
            <p className="text-[15px] text-[#6B7280] mt-0.5">Project: North Valley Fiber · Crew A</p>
            <div className="flex items-center gap-1.5 mt-2 text-[13px] text-[#8E8E93]">
              <Clock className="w-3.5 h-3.5" />
              <span>Started yesterday at 4:12 PM</span>
            </div>
          </div>

          {/* Requirements */}
          <div className="px-4 py-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280] mb-3">
              Completion Requirements
            </h3>
            <div className="space-y-2">
              {requirements.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3 active:bg-[#F9FAFB]"
                    style={{ minHeight: 64 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: r.complete ? "#E8F6EE" : "#F3F4F6" }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: r.complete ? "#057A55" : "#6B7280" }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[16px] font-semibold text-black">{r.label}</p>
                      <p className="text-[13px] text-[#6B7280]">{r.detail}</p>
                    </div>
                    {r.complete ? (
                      <div className="w-6 h-6 rounded-full bg-[#057A55] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-[#D1D5DB]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos preview */}
          <div className="px-4 pb-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280] mb-3">
              Captured Photos (2)
            </h3>
            <div className="flex gap-2">
              <div className="w-24 h-24 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#8E8E93]" />
              </div>
              <div className="w-24 h-24 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#8E8E93]" />
              </div>
              <button
                className="w-24 h-24 rounded-xl border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center text-[#1A56DB] gap-1"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[12px] font-semibold">Add</span>
              </button>
            </div>
          </div>

          {/* Action: change request */}
          <div className="px-4 pb-4">
            <button className="w-full flex items-center gap-2 text-[15px] text-[#1A56DB] py-3">
              <MessageSquare className="w-4 h-4" />
              Submit a change request
            </button>
          </div>

          {/* Banner */}
          {!allComplete && (
            <div className="mx-4 mb-4 flex items-start gap-2 bg-[#FEF6E7] border border-[#F5D789] rounded-xl p-3">
              <AlertCircle className="w-5 h-5 text-[#B45309] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#B45309]">
                Sequential number required before this unit can be marked complete.
              </p>
            </div>
          )}
        </div>

        {/* Sticky bottom action */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 pb-6">
          <button
            disabled={!allComplete}
            className="w-full h-12 rounded-xl text-white text-[17px] font-semibold disabled:opacity-50"
            style={{ backgroundColor: allComplete ? "#057A55" : "#9CA3AF", minHeight: 48 }}
          >
            {allComplete ? "Mark Unit Complete" : "Complete Requirements to Submit"}
          </button>
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default SpliceUnitDetail;

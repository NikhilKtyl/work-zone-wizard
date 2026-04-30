import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { X, AlertTriangle, MapPin, Camera, Mic, ChevronDown } from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

const severities = [
  { id: "low", label: "Low", color: "#057A55", bg: "#E8F6EE" },
  { id: "med", label: "Medium", color: "#B45309", bg: "#FEF6E7" },
  { id: "high", label: "High", color: "#991B1B", bg: "#FDECEC" },
  { id: "crit", label: "Critical", color: "#FFFFFF", bg: "#991B1B" },
];

const SpliceEmergency = () => {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState("high");
  const [description, setDescription] = useState("");

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Nav */}
        <div className="h-11 flex items-center justify-between px-3 border-b border-[#E5E7EB] relative">
          <button
            onClick={() => navigate("/splice/today")}
            className="text-[17px] text-[#1A56DB] h-11 flex items-center"
            style={{ minWidth: 44 }}
          >
            Cancel
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-black">
            New Emergency Job
          </h1>
          <div className="w-16" />
        </div>

        <div className="flex-1 overflow-y-auto pb-32">
          {/* Banner */}
          <div className="mx-4 mt-4 flex items-start gap-3 bg-[#FDECEC] border border-[#F5B5B5] rounded-xl p-3">
            <AlertTriangle className="w-5 h-5 text-[#991B1B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-semibold text-[#991B1B]">Emergency Dispatch</p>
              <p className="text-[13px] text-[#991B1B]/80 mt-0.5">
                Submitting will alert the on-call supervisor and create a priority ticket.
              </p>
            </div>
          </div>

          {/* Severity */}
          <div className="px-4 pt-5">
            <label className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Severity
            </label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {severities.map((s) => {
                const active = severity === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSeverity(s.id)}
                    className="h-12 rounded-xl text-[14px] font-semibold border"
                    style={{
                      backgroundColor: active ? s.bg : "#FFFFFF",
                      color: active ? s.color : "#6B7280",
                      borderColor: active ? s.color : "#E5E7EB",
                      minHeight: 44,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job type */}
          <div className="px-4 pt-5">
            <label className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Job Type
            </label>
            <button
              className="mt-2 w-full h-12 rounded-xl border border-[#E5E7EB] bg-white px-4 flex items-center justify-between"
              style={{ minHeight: 44 }}
            >
              <span className="text-[16px] text-black">Cable Cut – Aerial</span>
              <ChevronDown className="w-5 h-5 text-[#8E8E93]" />
            </button>
          </div>

          {/* Location */}
          <div className="px-4 pt-5">
            <label className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Location
            </label>
            <div className="mt-2 border border-[#E5E7EB] rounded-xl overflow-hidden">
              <div
                className="h-32 flex items-center justify-center"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #F3F4F6 0 8px, #FFFFFF 8px 16px)",
                }}
              >
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#E5E7EB]">
                  <MapPin className="w-4 h-4 text-[#1A56DB]" />
                  <span className="text-[13px] font-semibold text-black">
                    37.7749° N, 122.4194° W
                  </span>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-[#E5E7EB] flex items-center justify-between">
                <p className="text-[13px] text-[#6B7280]">Maple St & 4th Ave (auto-detected)</p>
                <button className="text-[13px] font-semibold text-[#1A56DB]">Edit</button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 pt-5">
            <label className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Description
            </label>
            <div className="mt-2 border border-[#E5E7EB] rounded-xl bg-white">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue — what happened, what's needed?"
                rows={4}
                className="w-full p-3 text-[16px] text-black placeholder:text-[#9CA3AF] outline-none resize-none rounded-xl"
              />
              <div className="border-t border-[#E5E7EB] px-2 py-1.5 flex items-center justify-between">
                <button
                  onClick={() => navigate("/splice/fieldvoice")}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A56DB] px-2 h-9"
                >
                  <Mic className="w-4 h-4" />
                  Dictate
                </button>
                <span className="text-[12px] text-[#8E8E93]">{description.length}/500</span>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="px-4 pt-5">
            <label className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Attach Photos
            </label>
            <div className="mt-2 flex gap-2">
              <button
                className="w-20 h-20 rounded-xl border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center text-[#1A56DB] gap-1"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[12px] font-semibold">Add</span>
              </button>
              <div className="w-20 h-20 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center relative">
                <Camera className="w-5 h-5 text-[#8E8E93]" />
                <button className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                  <X className="w-3 h-3 text-white" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 pb-6">
          <button
            onClick={() => navigate("/splice/today")}
            className="w-full h-12 rounded-xl bg-[#991B1B] text-white text-[17px] font-semibold active:opacity-90"
            style={{ minHeight: 48 }}
          >
            Submit Emergency Job
          </button>
          <p className="text-center text-[12px] text-[#8E8E93] mt-2">
            Hold to confirm dispatch · supervisor will be paged
          </p>
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default SpliceEmergency;

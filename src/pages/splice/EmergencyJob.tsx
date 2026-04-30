import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  MapPin,
  Camera,
  Image as ImageIcon,
  Plus,
  Minus,
  X,
  Trash2,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

type JobType = "repair" | "install" | "emergency";

interface AddedUnit {
  id: number;
  type: string;
  qty: number;
}

const SpliceEmergency = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<string | null>("Midwest Fiber Co.");
  const [jobType, setJobType] = useState<JobType>("repair");
  const [units, setUnits] = useState<AddedUnit[]>([
    { id: 1, type: "Handhole Repair", qty: 1 },
  ]);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newType, setNewType] = useState("Handhole Repair");
  const [newQty, setNewQty] = useState(1);
  const [notes, setNotes] = useState("");

  const canSubmit = !!customer && units.length > 0;

  const addUnit = () => {
    setUnits((u) => [...u, { id: Date.now(), type: newType, qty: newQty }]);
    setShowAddUnit(false);
    setNewQty(1);
  };

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Nav */}
        <div className="h-11 flex items-center justify-between px-3 border-b border-[#E5E7EB] relative flex-shrink-0">
          <div className="flex items-center gap-2 h-11">
            <AlertTriangle className="w-5 h-5 text-[#B91C1C]" />
            <h1 className="text-[17px] font-bold text-[#111827]">New Emergency Job</h1>
          </div>
          <button
            onClick={() => navigate("/splice/today")}
            className="text-[17px] text-[#B91C1C] h-11 flex items-center"
            style={{ minWidth: 44 }}
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-28">
          {/* Banner */}
          <div
            className="mx-4 mt-4 flex items-center gap-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl pl-3 pr-3 relative overflow-hidden"
            style={{ minHeight: 48 }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B91C1C]" />
            <p className="text-[13px] text-[#991B1B] py-2 ml-1">
              Emergency job — office validation required before billing.
            </p>
          </div>

          {/* Customer */}
          <div className="px-4 pt-4">
            <label className="text-[13px] font-bold text-[#374151]">Customer *</label>
            <button
              className="mt-1.5 w-full bg-white border border-[#D1D5DB] rounded-xl px-4 flex items-center justify-between"
              style={{ height: 52, minHeight: 44 }}
            >
              <span
                className="text-[15px]"
                style={{ color: customer ? "#111827" : "#9CA3AF" }}
              >
                {customer || "Select customer..."}
              </span>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>
          </div>

          {/* Job Type */}
          <div className="px-4 pt-4">
            <label className="text-[13px] font-bold text-[#374151]">Job Type</label>
            <div className="mt-1.5 grid grid-cols-3 gap-0 rounded-xl overflow-hidden border border-[#D1D5DB]">
              {(
                [
                  { id: "repair", label: "Repair" },
                  { id: "install", label: "New Install" },
                  { id: "emergency", label: "Emergency" },
                ] as { id: JobType; label: string }[]
              ).map((opt, i) => {
                const active = jobType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setJobType(opt.id)}
                    className="text-[14px] font-semibold"
                    style={{
                      height: 44,
                      backgroundColor: active ? "#1A56DB" : "#FFFFFF",
                      color: active ? "#FFFFFF" : "#6B7280",
                      borderLeft: i > 0 ? "1px solid #D1D5DB" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="px-4 pt-4">
            <label className="text-[13px] font-bold text-[#374151]">Location *</label>
            <div className="mt-1.5 relative rounded-xl overflow-hidden border border-[#E5E7EB]" style={{ height: 200 }}>
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #DBEAFE, #E0E7FF)",
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 32px)",
                }}
              />
              <div className="absolute left-0 right-0 top-[60%] h-[6px] bg-white/80" />
              <div className="absolute top-0 bottom-0 left-[45%] w-[6px] bg-white/80" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <div className="w-8 h-8 rounded-full bg-[#B91C1C] border-2 border-white flex items-center justify-center shadow-md">
                  <MapPin className="w-4 h-4 text-white" fill="white" strokeWidth={0} />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#B91C1C] mx-auto -mt-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[13px] text-[#6B7280]">123 Route 66 East, Chicago IL</p>
              <button className="text-[13px] font-semibold text-[#1A56DB]">
                Use Current Location
              </button>
            </div>
          </div>

          {/* Units */}
          <div className="px-4 pt-4">
            <label className="text-[13px] font-bold text-[#374151]">Units *</label>
            <div className="mt-1.5 space-y-2">
              {units.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border border-[#E5E7EB] rounded-lg p-3 flex items-center gap-3"
                >
                  <p className="text-[14px] text-[#111827] flex-1">{u.type}</p>
                  <span className="text-[14px] font-semibold text-[#6B7280]">× {u.qty}</span>
                  <button
                    onClick={() => setUnits((arr) => arr.filter((x) => x.id !== u.id))}
                    className="w-8 h-8 flex items-center justify-center text-[#9CA3AF]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {showAddUnit ? (
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 space-y-2">
                  <button
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 flex items-center justify-between"
                    style={{ height: 44 }}
                  >
                    <span className="text-[14px] text-[#111827]">{newType}</span>
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setNewQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 rounded-full border border-[#D1D5DB] bg-white flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-[#111827]" />
                    </button>
                    <span className="text-[18px] font-bold text-[#111827] w-8 text-center">
                      {newQty}
                    </span>
                    <button
                      onClick={() => setNewQty((q) => q + 1)}
                      className="w-11 h-11 rounded-full border border-[#D1D5DB] bg-white flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-[#111827]" />
                    </button>
                    <button
                      onClick={addUnit}
                      className="ml-auto px-4 h-11 rounded-full bg-[#1A56DB] text-white text-[14px] font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddUnit(true)}
                  className="w-full rounded-lg border border-dashed border-[#93C5FD] text-[#1A56DB] text-[14px] font-semibold flex items-center justify-center gap-1"
                  style={{ height: 44 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Unit
                </button>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="px-4 pt-4">
            <label className="text-[13px] font-bold text-[#374151]">Photos (optional)</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                className="rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#1A56DB]"
                style={{ height: 48 }}
              >
                <Camera className="w-4 h-4" />
                <span className="text-[14px] font-semibold">Take Photo</span>
              </button>
              <button
                className="rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#1A56DB]"
                style={{ height: 48 }}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[14px] font-semibold">Library</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="px-4 pt-4">
            <label className="text-[13px] font-bold text-[#374151]">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the emergency situation..."
              className="mt-1.5 w-full p-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-xl bg-white outline-none focus:border-[#1A56DB] resize-none"
              style={{ minHeight: 88 }}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 pb-6">
          <button
            disabled={!canSubmit}
            onClick={() => canSubmit && navigate("/splice/today")}
            className="w-full rounded-xl text-[17px] font-semibold transition-colors"
            style={{
              height: 56,
              backgroundColor: canSubmit ? "#B91C1C" : "#D1D5DB",
              color: canSubmit ? "#FFFFFF" : "#6B7280",
            }}
          >
            Submit Emergency Job
          </button>
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default SpliceEmergency;

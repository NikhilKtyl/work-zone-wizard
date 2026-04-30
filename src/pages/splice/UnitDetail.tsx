import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Share,
  MapPin,
  Camera,
  Image as ImageIcon,
  Hash,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

const SpliceUnitDetail = () => {
  const navigate = useNavigate();
  const { unitId = "HH-047" } = useParams();

  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [sequential, setSequential] = useState("2284");
  const [notes, setNotes] = useState("");
  const [veriLens, setVeriLens] = useState<"loading" | "verified" | "warn">("loading");

  useEffect(() => {
    if (!photoUploaded) return;
    setVeriLens("loading");
    const t = setTimeout(() => setVeriLens("verified"), 1200);
    return () => clearTimeout(t);
  }, [photoUploaded]);

  const reqPhoto = photoUploaded;
  const reqSeq = sequential.length > 0;
  const reqGps = true;
  const reqDone = [reqPhoto, reqSeq, reqGps].filter(Boolean).length;
  const allComplete = reqDone === 3;

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-white">
        {/* Nav bar */}
        <div className="h-11 flex items-center justify-between px-2 border-b border-[#E5E7EB] bg-white relative flex-shrink-0">
          <button
            onClick={() => navigate("/splice/today")}
            className="flex items-center gap-0.5 text-[#1A56DB] h-11 px-2"
            style={{ minWidth: 44 }}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[17px]">Back</span>
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111827]">
            {unitId}
          </h1>
          <button className="w-11 h-11 flex items-center justify-center text-[#1A56DB]">
            <Share className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-28">
          {/* Unit header card */}
          <div className="mx-4 mt-4 bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[22px] font-bold text-[#111827] leading-tight">{unitId}</p>
            <p className="text-[14px] text-[#6B7280] mt-0.5">Handhole Installation</p>
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#D1FAE5] text-[#057A55]">
                Seq: 2284
              </span>
              <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#D1FAE5] text-[#057A55]">
                FM Approved
              </span>
              <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F3F4F6] text-[#6B7280]">
                Crew A
              </span>
            </div>
          </div>

          {/* Map thumbnail */}
          <div className="mx-4 mt-4 relative rounded-xl overflow-hidden border border-[#E5E7EB]" style={{ height: 160 }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 50%, #DBEAFE 100%)",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 28px)",
              }}
            />
            {/* fake roads */}
            <div className="absolute left-0 right-0 top-[55%] h-[6px] bg-white/80" />
            <div className="absolute top-0 bottom-0 left-[40%] w-[6px] bg-white/80" />
            {/* Pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <div className="w-7 h-7 rounded-full bg-[#1A56DB] border-2 border-white flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4 text-white" fill="white" strokeWidth={0} />
              </div>
              <div className="w-2 h-2 rounded-full bg-[#1A56DB] mx-auto -mt-0.5" />
            </div>
            {/* Bottom gradient overlay */}
            <div
              className="absolute left-0 right-0 bottom-0 px-3 py-2 flex items-center justify-end"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
              }}
            >
              <span className="text-white text-[13px] font-semibold">View on Map →</span>
            </div>
          </div>

          {/* Requirements */}
          <h3 className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Requirements
          </h3>
          <div className="mx-4 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            {[
              { Icon: Camera, label: "Photo Documentation", done: reqPhoto, doneTxt: "Uploaded ✓", needTxt: "Required" },
              { Icon: Hash, label: "Sequential Number", done: reqSeq, doneTxt: `${sequential} ✓`, needTxt: "Required" },
              { Icon: MapPin, label: "GPS Location", done: reqGps, doneTxt: "4.2m from unit ✓", needTxt: "Required" },
            ].map((r, i, arr) => (
              <div
                key={r.label}
                className={`flex items-center gap-3 px-4 ${i < arr.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}
                style={{ height: 52 }}
              >
                <r.Icon className="w-5 h-5 text-[#6B7280]" />
                <p className="flex-1 text-[15px] text-[#111827]">{r.label}</p>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: r.done ? "#057A55" : "#991B1B" }}
                >
                  {r.done ? r.doneTxt : r.needTxt}
                </span>
              </div>
            ))}
          </div>

          {/* Photos */}
          <h3 className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Photos
          </h3>
          <div className="mx-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setPhotoUploaded(true)}
              className="h-12 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#1A56DB] active:bg-[#F9FAFB]"
              style={{ minHeight: 48 }}
            >
              <Camera className="w-4 h-4" />
              <span className="text-[14px] font-semibold">Take Photo</span>
            </button>
            <button
              onClick={() => setPhotoUploaded(true)}
              className="h-12 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#1A56DB] active:bg-[#F9FAFB]"
              style={{ minHeight: 48 }}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-[14px] font-semibold">From Library</span>
            </button>
          </div>

          {photoUploaded && (
            <div className="mx-4 mt-3 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 text-[#9CA3AF]" />
                </div>
              ))}
            </div>
          )}

          {/* VeriLens */}
          {photoUploaded && (
            <div className="mx-4 mt-3">
              {veriLens === "verified" ? (
                <div className="flex items-center gap-2 bg-[#D1FAE5] rounded-xl px-3 py-2.5">
                  <Sparkles className="w-4 h-4 text-[#057A55]" />
                  <p className="text-[13px] font-semibold text-[#057A55]">
                    AI Verified · Confidence 94%
                  </p>
                  <CheckCircle2 className="w-4 h-4 text-[#057A55] ml-auto" />
                </div>
              ) : veriLens === "warn" ? (
                <div className="flex items-center gap-2 bg-[#FEF3C7] rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-[#B45309]" />
                  <p className="text-[13px] font-semibold text-[#B45309]">
                    Retake: Photo too blurry
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-3 py-2.5">
                  <div className="w-4 h-4 border-2 border-[#6B7280] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[13px] text-[#6B7280]">VeriLens analyzing photo…</p>
                </div>
              )}
            </div>
          )}

          {/* Sequential input */}
          <h3 className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Sequential Number
          </h3>
          <div className="mx-4">
            <input
              inputMode="numeric"
              value={sequential}
              onChange={(e) => setSequential(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter sequential…"
              className="w-full text-center text-[18px] font-semibold border border-[#E5E7EB] rounded-2xl bg-white outline-none focus:border-[#1A56DB]"
              style={{ height: 56 }}
            />
          </div>

          {/* GPS */}
          <h3 className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            GPS Location
          </h3>
          <div className="mx-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#057A55] flex-shrink-0" />
            <p className="text-[13px] text-[#6B7280] flex-1">
              41.8827° N, -87.6233° W · 4.2m from unit
            </p>
            <button className="text-[13px] font-semibold text-[#1A56DB] flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {/* Notes */}
          <h3 className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Notes
          </h3>
          <div className="mx-4 mb-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add field notes..."
              className="w-full p-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-xl bg-white outline-none focus:border-[#1A56DB] resize-none"
              style={{ minHeight: 80 }}
            />
          </div>
        </div>

        {/* Sticky bottom Mark Complete */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 pb-6">
          <button
            disabled={!allComplete}
            onClick={() => allComplete && navigate("/splice/today")}
            className="w-full rounded-xl text-white text-[17px] font-semibold transition-colors"
            style={{
              height: 56,
              minHeight: 48,
              backgroundColor: allComplete ? "#057A55" : "#D1D5DB",
              color: allComplete ? "#FFFFFF" : "#6B7280",
            }}
          >
            {allComplete
              ? "Mark Complete"
              : `${reqDone} of 3 requirements complete`}
          </button>
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default SpliceUnitDetail;

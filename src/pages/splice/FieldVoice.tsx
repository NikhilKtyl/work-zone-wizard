import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X, Mic, Pencil, CheckCircle2 } from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

type Phase = "idle" | "recording" | "processing" | "review";

const transcriptWords = [
  "Handhole", "47", "complete", "sequential", "two", "two", "eight", "four",
  "moved", "three", "feet", "east", "due", "to", "utility", "conflict",
];

const FieldVoice = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const recordTimer = useRef<number | null>(null);
  const wordTimer = useRef<number | null>(null);

  const startRecording = () => {
    if (phase !== "idle") return;
    setSeconds(0);
    setWordCount(0);
    setPhase("recording");
    recordTimer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    wordTimer.current = window.setInterval(
      () => setWordCount((w) => Math.min(w + 1, transcriptWords.length)),
      450
    );
  };

  const stopRecording = () => {
    if (phase !== "recording") return;
    if (recordTimer.current) clearInterval(recordTimer.current);
    if (wordTimer.current) clearInterval(wordTimer.current);
    setPhase("processing");
    setTimeout(() => setPhase("review"), 1500);
  };

  useEffect(
    () => () => {
      if (recordTimer.current) clearInterval(recordTimer.current);
      if (wordTimer.current) clearInterval(wordTimer.current);
    },
    []
  );

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const transcript = transcriptWords.slice(0, wordCount).join(" ");

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col bg-black relative overflow-hidden">
        {/* Top */}
        <div className="flex items-center justify-between px-3 pt-2">
          <button
            onClick={() => navigate("/splice/today")}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
          <div className="w-11" />
        </div>

        {/* Context */}
        <div className="flex flex-col items-center mt-2">
          <div className="px-3 py-1.5 rounded-full bg-[#1A56DB]">
            <span className="text-[14px] font-semibold text-white">
              Recording for: HH-047
            </span>
          </div>
          <p className="text-[13px] text-[#9CA3AF] mt-2">Handhole Installation</p>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {phase === "recording" && (
            <>
              {/* Waveform */}
              <div className="flex items-center justify-center gap-[6px] h-16 mb-6">
                {Array.from({ length: 7 }).map((_, i) => {
                  const h = 12 + Math.abs(Math.sin(seconds * 1.3 + i * 0.9)) * 44;
                  return (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-white"
                      style={{ height: h, transition: "height 120ms ease" }}
                    />
                  );
                })}
              </div>
            </>
          )}

          {/* Mic button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={() => phase === "recording" && stopRecording()}
            onTouchStart={(e) => {
              e.preventDefault();
              startRecording();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stopRecording();
            }}
            disabled={phase === "processing" || phase === "review"}
            className="rounded-full flex items-center justify-center transition-transform"
            style={{
              width: 88,
              height: 88,
              backgroundColor: phase === "recording" ? "#1A56DB" : "transparent",
              border: "2px solid #1A56DB",
              animation:
                phase === "recording" ? "spliceMicPulse 0.8s ease-in-out infinite" : undefined,
            }}
            aria-label="Hold to record"
          >
            {phase === "processing" ? (
              <div className="w-8 h-8 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic className="w-9 h-9 text-white" strokeWidth={2.5} />
            )}
          </button>

          {/* Caption */}
          {phase === "idle" && (
            <p className="text-[14px] text-[#9CA3AF] mt-4">Hold to record</p>
          )}
          {phase === "recording" && (
            <p className="text-[18px] font-bold text-white tabular-nums mt-4">
              {mm}:{ss}
            </p>
          )}
          {phase === "processing" && (
            <p className="text-[14px] text-[#9CA3AF] mt-4">Processing…</p>
          )}

          {/* Live transcript */}
          {phase === "recording" && (
            <p
              className="text-center text-[16px] italic text-white mt-6 max-w-[260px] leading-snug"
              style={{ minHeight: 60 }}
            >
              {transcript}
              <span className="inline-block w-[2px] h-4 bg-white ml-0.5 animate-pulse" />
            </p>
          )}
        </div>

        {/* Extraction card */}
        {phase === "review" && (
          <div
            className="absolute left-0 right-0 bottom-0 bg-white"
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              animation: "spliceSlideUp 280ms ease-out",
            }}
          >
            <div className="flex justify-center pt-2">
              <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111827] px-4 pt-3 pb-1">
              Confirm Update
            </h3>
            <div className="px-4">
              {[
                { label: "Unit", value: "HH-047", isBadge: false },
                { label: "Status", value: "Complete", isBadge: true },
                { label: "Sequential", value: "2284", isBadge: false },
                { label: "Note", value: "Moved 3ft east — utility…", isBadge: false },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-center gap-3 ${
                    i < arr.length - 1 ? "border-b border-[#F3F4F6]" : ""
                  }`}
                  style={{ height: 48 }}
                >
                  <p className="text-[12px] text-[#6B7280] w-20">{row.label}</p>
                  {row.isBadge ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#057A55] text-[12px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {row.value}
                    </span>
                  ) : (
                    <p className="text-[14px] text-[#111827] flex-1 truncate">{row.value}</p>
                  )}
                  <Pencil className="w-4 h-4 text-[#9CA3AF] ml-auto" />
                </div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-6">
              <button
                onClick={() => navigate("/splice/today")}
                className="w-full rounded-xl bg-[#057A55] text-white text-[16px] font-semibold"
                style={{ height: 52 }}
              >
                Confirm & Save
              </button>
              <button
                onClick={() => setPhase("idle")}
                className="w-full text-center text-[14px] text-[#6B7280] mt-3"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spliceMicPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          @keyframes spliceSlideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>
    </IPhoneFrame>
  );
};

export default FieldVoice;

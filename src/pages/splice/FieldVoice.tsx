import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { X, Mic, Pause, Send, Trash2 } from "lucide-react";
import IPhoneFrame from "@/components/splice/IPhoneFrame";

const FieldVoice = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(true);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  // 32 bars for waveform
  const bars = Array.from({ length: 32 }, (_, i) => {
    const seed = (Math.sin(i * 1.3 + seconds * 0.6) + 1) / 2;
    const h = recording ? 8 + seed * 56 : 8 + seed * 20;
    return h;
  });

  return (
    <IPhoneFrame>
      <div className="h-full flex flex-col" style={{ backgroundColor: "#0B1220" }}>
        {/* Top bar */}
        <div className="h-11 flex items-center justify-between px-3">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
          <div className="text-[15px] font-semibold text-white tracking-wide">FieldVoice™</div>
          <div className="w-11" />
        </div>

        {/* Context chip */}
        <div className="px-6 mt-2">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[13px] text-white/90">Logging to HH-047 · Maple & 4th</span>
          </div>
        </div>

        {/* Center: timer & wave */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-[15px] uppercase tracking-[0.2em] text-white/60 mb-3">
            {recording ? "Recording" : "Paused"}
          </p>
          <p className="text-[64px] font-bold text-white tabular-nums tracking-tight leading-none">
            {mm}:{ss}
          </p>

          {/* Waveform */}
          <div className="mt-12 flex items-center justify-center gap-[3px] h-20">
            {bars.map((h, i) => (
              <div
                key={i}
                className="w-[4px] rounded-full"
                style={{
                  height: h,
                  backgroundColor: recording ? "#1A56DB" : "#475569",
                  transition: "height 120ms ease",
                }}
              />
            ))}
          </div>

          <p className="text-center text-[13px] text-white/60 mt-10 max-w-[260px]">
            Speak naturally. FieldVoice will auto-transcribe and tag this note to the active unit.
          </p>
        </div>

        {/* Controls */}
        <div className="px-6 pb-10">
          <div className="flex items-center justify-around">
            <button
              onClick={() => {
                setSeconds(0);
                setRecording(true);
              }}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
              aria-label="Discard"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setRecording((r) => !r)}
              className="w-20 h-20 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ backgroundColor: recording ? "#991B1B" : "#1A56DB" }}
              aria-label={recording ? "Pause" : "Resume"}
            >
              {recording ? (
                <Pause className="w-8 h-8 text-white" fill="white" strokeWidth={0} />
              ) : (
                <Mic className="w-8 h-8 text-white" strokeWidth={2.5} />
              )}
            </button>

            <button
              onClick={() => navigate("/splice/today")}
              className="w-14 h-14 rounded-full bg-[#057A55] flex items-center justify-center"
              aria-label="Send"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-center text-[12px] text-white/40 mt-4">
            Hold mic button on Home to quick-record · Swipe down to dismiss
          </p>
        </div>
      </div>
    </IPhoneFrame>
  );
};

export default FieldVoice;

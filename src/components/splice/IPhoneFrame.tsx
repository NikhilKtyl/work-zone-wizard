import { ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

interface IPhoneFrameProps {
  children: ReactNode;
  statusBarTitle?: string;
}

/**
 * iPhone 14 device frame (390x844 logical px).
 * Wraps children with bezel, notch (Dynamic Island), and status bar.
 */
const IPhoneFrame = ({ children }: IPhoneFrameProps) => {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F2F2F7] py-6 px-4">
      <div
        className="relative bg-black rounded-[54px] p-[14px] shadow-2xl"
        style={{ width: 418, height: 872 }}
      >
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[120px] w-[3px] h-[32px] bg-neutral-700 rounded-l" />
        <div className="absolute -left-[3px] top-[170px] w-[3px] h-[60px] bg-neutral-700 rounded-l" />
        <div className="absolute -left-[3px] top-[240px] w-[3px] h-[60px] bg-neutral-700 rounded-l" />
        <div className="absolute -right-[3px] top-[180px] w-[3px] h-[100px] bg-neutral-700 rounded-r" />

        {/* Screen */}
        <div
          className="relative bg-white rounded-[42px] overflow-hidden"
          style={{ width: 390, height: 844 }}
        >
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-[44px] z-50 flex items-center justify-between px-7 text-black text-[15px] font-semibold pointer-events-none">
            <span>{time}</span>
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4" strokeWidth={2.5} />
              <Wifi className="w-4 h-4" strokeWidth={2.5} />
              <BatteryFull className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>

          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[11px] bg-black rounded-full z-50"
            style={{ width: 120, height: 35 }}
          />

          {/* Content area */}
          <div className="absolute inset-0 pt-[44px] overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default IPhoneFrame;

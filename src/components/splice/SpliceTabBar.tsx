import { useNavigate, useLocation } from "react-router-dom";
import { Home, Map, Layers, Bell, User } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/splice/today" },
  { id: "map", label: "Map", icon: Map, path: "/splice/map" },
  { id: "units", label: "Units", icon: Layers, path: "/splice/units" },
  { id: "notif", label: "Notifications", icon: Bell, path: "/splice/pulseflow" },
  { id: "profile", label: "Profile", icon: User, path: "/splice/profile" },
];

const SpliceTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] flex items-end justify-around px-1 pb-[6px] pt-1"
      style={{ height: 56 }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center justify-end gap-[2px] flex-1 h-full"
            style={{ minHeight: 44 }}
          >
            <Icon
              className="w-[22px] h-[22px]"
              style={{ color: active ? "#1A56DB" : "#8E8E93" }}
              strokeWidth={active ? 2.5 : 2}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#1A56DB" : "#8E8E93" }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SpliceTabBar;

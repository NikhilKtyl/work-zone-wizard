import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Users,
  Phone,
  Mail,
  LogOut,
  RefreshCw,
  Download,
  CheckCircle2,
  CloudOff,
  Wifi,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOffline } from "@/hooks/useOffline";
import SyncStatus from "@/components/SyncStatus";
import { toast } from "sonner";

// Mock user data
const mockUserProfile = {
  name: "Alex Johnson",
  role: "Foreman",
  crew: "Crew A",
  crewMembers: ["Mike Torres", "Sarah Chen", "James Wilson"],
  email: "alex.johnson@berrytech.com",
  phone: "+1 (555) 123-4567",
  employeeId: "EMP-2024-0142",
  startDate: "March 2022",
};

const Profile = () => {
  const navigate = useNavigate();
  const { isOnline, pendingCount, isSyncing, syncData, lastSyncTime } = useOffline();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleSyncNow = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }
    if (pendingCount === 0) {
      toast.info("Everything is already synced");
      return;
    }
    await syncData();
    toast.success("Sync completed!");
  };

  const handleDownloadOfflineData = async () => {
    setIsDownloading(true);
    // Simulate downloading data
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDownloading(false);
    toast.success("Offline data downloaded!", {
      description: "Projects, units, and map tiles cached",
    });
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return "Never synced";
    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Profile</h1>
            <p className="text-xs text-muted-foreground">Account & Settings</p>
          </div>
          <SyncStatus compact />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-8 overflow-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{mockUserProfile.name}</h2>
              <p className="text-muted-foreground">{mockUserProfile.role}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {mockUserProfile.employeeId}
              </span>
            </div>
          </div>
        </div>

        {/* Crew Info */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Assigned Crew</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-3">{mockUserProfile.crew}</h3>
          <div className="space-y-2">
            {mockUserProfile.crewMembers.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">{member}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{mockUserProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{mockUserProfile.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <CloudOff className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm font-medium">Sync Status</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Connection</p>
                <p className="text-xs text-muted-foreground">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-success" : "bg-destructive"}`} />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Pending Items</p>
                <p className="text-xs text-muted-foreground">
                  {pendingCount === 0 ? "All synced" : `${pendingCount} waiting`}
                </p>
              </div>
              {pendingCount === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Last Sync</p>
                <p className="text-xs text-muted-foreground">{formatLastSync()}</p>
              </div>
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSyncNow}
            disabled={!isOnline || isSyncing || pendingCount === 0}
            className="w-full h-12 rounded-xl gap-2"
            variant="outline"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>

          <Button
            onClick={handleDownloadOfflineData}
            disabled={!isOnline || isDownloading}
            className="w-full h-12 rounded-xl gap-2"
            variant="outline"
          >
            <Download className={`w-5 h-5 ${isDownloading ? "animate-bounce" : ""}`} />
            {isDownloading ? "Downloading..." : "Download Offline Data"}
          </Button>

          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-12 rounded-xl gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">BerryTech Field App v1.0.0</p>
          <p className="text-xs text-muted-foreground">Member since {mockUserProfile.startDate}</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;

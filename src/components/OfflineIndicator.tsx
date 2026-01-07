import { WifiOff, RefreshCw, CloudOff, Check } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";
import { toast } from "sonner";

const OfflineIndicator = () => {
  const { isOnline, pendingCount, isSyncing, syncData, lastSyncTime } = useOffline();

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }
    if (pendingCount === 0) {
      toast.info("Nothing to sync");
      return;
    }
    toast.promise(syncData(), {
      loading: "Syncing data...",
      success: "Data synced successfully!",
      error: "Sync failed",
    });
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return "Never";
    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Only show when offline or has pending items
  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`fixed top-16 left-4 right-4 z-30 animate-fade-in ${
      isOnline ? "bg-warning/10 border-warning/30" : "bg-destructive/10 border-destructive/30"
    } backdrop-blur-sm rounded-xl border p-3 shadow-elevated`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isOnline ? "bg-warning/20" : "bg-destructive/20"
        }`}>
          {isOnline ? (
            <CloudOff className="w-5 h-5 text-warning" />
          ) : (
            <WifiOff className="w-5 h-5 text-destructive" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${isOnline ? "text-warning" : "text-destructive"}`}>
            {isOnline ? "Pending Sync" : "You're Offline"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {pendingCount > 0 
              ? `${pendingCount} item${pendingCount !== 1 ? "s" : ""} waiting to sync`
              : "Changes saved locally"
            }
            {lastSyncTime && ` • Last sync: ${formatLastSync()}`}
          </p>
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${isSyncing ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;

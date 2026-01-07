import { Wifi, WifiOff, CloudOff, Check, RefreshCw } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";

interface SyncStatusProps {
  compact?: boolean;
}

const SyncStatus = ({ compact = false }: SyncStatusProps) => {
  const { isOnline, pendingCount, isSyncing } = useOffline();

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        !isOnline 
          ? "bg-destructive/10 text-destructive" 
          : pendingCount > 0
            ? "bg-warning/10 text-warning"
            : "bg-success/10 text-success"
      }`}>
        {!isOnline ? (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </>
        ) : pendingCount > 0 ? (
          <>
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <CloudOff className="w-3 h-3" />
            )}
            <span>{pendingCount} pending</span>
          </>
        ) : (
          <>
            <Check className="w-3 h-3" />
            <span>Synced</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
      !isOnline 
        ? "bg-destructive/10 text-destructive" 
        : pendingCount > 0
          ? "bg-warning/10 text-warning"
          : "bg-success/10 text-success"
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Offline Mode</span>
        </>
      ) : pendingCount > 0 ? (
        <>
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CloudOff className="w-4 h-4" />
          )}
          <span className="font-medium">{pendingCount} pending sync</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span className="font-medium">All synced</span>
        </>
      )}
    </div>
  );
};

export default SyncStatus;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Clock,
  RefreshCw,
  CloudOff,
  Check,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOffline } from "@/hooks/useOffline";
import SyncStatus from "@/components/SyncStatus";

// Mock history data
const mockHistory = [
  {
    id: "1",
    type: "unit_completed",
    unitId: "U-104",
    project: "Sunrise Orchards",
    description: "Bore (ft) - 320 ft completed",
    timestamp: "2024-01-15 15:30",
    status: "synced",
  },
  {
    id: "2",
    type: "change_request",
    unitId: "U-102",
    project: "North Valley Farm",
    description: "Location adjustment requested",
    timestamp: "2024-01-15 14:45",
    status: "synced",
  },
  {
    id: "3",
    type: "unit_completed",
    unitId: "U-105",
    project: "Sunrise Orchards",
    description: "Conduit (ft) - 150 ft completed",
    timestamp: "2024-01-14 12:00",
    status: "synced",
  },
  {
    id: "4",
    type: "emergency_job",
    unitId: "EJ-001",
    project: "Highland Ranch",
    description: "Emergency bore - 200 ft",
    timestamp: "2024-01-14 10:30",
    status: "pending_approval",
  },
  {
    id: "5",
    type: "change_request",
    unitId: "U-106",
    project: "Green Meadows",
    description: "Additional units needed",
    timestamp: "2024-01-13 16:20",
    status: "approved",
  },
  {
    id: "6",
    type: "unit_completed",
    unitId: "U-101",
    project: "North Valley Farm",
    description: "Trench (ft) - 180 ft completed",
    timestamp: "2024-01-13 11:00",
    status: "synced",
  },
];

type FilterType = "all" | "unit_completed" | "change_request" | "emergency_job";

const History = () => {
  const navigate = useNavigate();
  const { syncQueue, isOnline } = useOffline();
  const [filter, setFilter] = useState<FilterType>("all");

  // Combine mock history with pending sync items
  const pendingItems = syncQueue.map((item) => ({
    id: item.id,
    type: item.type === "unit_update" ? "unit_completed" : item.type,
    unitId: (item.data as Record<string, unknown>)?.unitId as string || "Unknown",
    project: "Pending",
    description: `${item.type.replace(/_/g, " ")} - awaiting sync`,
    timestamp: item.timestamp,
    status: "pending_sync" as const,
  }));

  const allHistory = [...pendingItems, ...mockHistory];

  const filteredHistory = filter === "all" 
    ? allHistory 
    : allHistory.filter((item) => item.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "unit_completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "change_request":
        return <FileText className="w-5 h-5" />;
      case "emergency_job":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "unit_completed":
        return "bg-success/10 text-success";
      case "change_request":
        return "bg-primary/10 text-primary";
      case "emergency_job":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" />
            Synced
          </span>
        );
      case "pending_sync":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
            <CloudOff className="w-3 h-3" />
            Pending Sync
          </span>
        );
      case "pending_approval":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "unit_completed":
        return "Unit Completed";
      case "change_request":
        return "Change Request";
      case "emergency_job":
        return "Emergency Job";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "unit_completed", label: "Completed" },
    { value: "change_request", label: "Changes" },
    { value: "emergency_job", label: "Emergency" },
  ];

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
            <h1 className="text-lg font-bold text-foreground">History</h1>
            <p className="text-xs text-muted-foreground">
              {filteredHistory.length} activities
            </p>
          </div>
          <SyncStatus compact />
        </div>
      </header>

      {/* Filters */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Sync Warning */}
      {pendingItems.length > 0 && (
        <div className="mx-4 mt-4 p-3 bg-warning/10 border border-warning/20 rounded-xl">
          <div className="flex items-center gap-2 text-warning">
            <CloudOff className="w-4 h-4" />
            <span className="text-sm font-medium">
              {pendingItems.length} item{pendingItems.length !== 1 ? "s" : ""} waiting to sync
            </span>
          </div>
        </div>
      )}

      {/* History List */}
      <main className="flex-1 p-4 pb-24 overflow-auto">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No activity yet</h3>
            <p className="text-sm text-muted-foreground">
              Your completed work will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.type === "unit_completed" && item.unitId.startsWith("U-")) {
                    navigate(`/unit/${item.unitId}`);
                  } else {
                    navigate(`/history/${item.id}`);
                  }
                }}
                className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 text-left hover:shadow-elevated active:scale-[0.99] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {item.unitId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.project}
                        </p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </span>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;

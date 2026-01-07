import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Calendar,
  Camera,
  Hash,
  Crosshair,
  Building2,
  Check,
  CloudOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SyncStatus from "@/components/SyncStatus";

// Mock history details data
const mockHistoryDetails: Record<string, {
  id: string;
  type: "unit_completed" | "change_request" | "emergency_job";
  unitId: string;
  project: string;
  customer: string;
  description: string;
  timestamp: string;
  status: string;
  submittedBy: string;
  // Change request specific
  changeType?: string;
  changeReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  // Emergency job specific
  units?: { type: string; length?: string; quantity?: string }[];
  photos?: { id: string; url: string; timestamp: string }[];
  gpsData?: { lat: number; lng: number; accuracy: number };
  sequentialNumbers?: string[];
  // Unit completed specific
  timeIn?: string;
  timeOut?: string;
  duration?: string;
}> = {
  "1": {
    id: "1",
    type: "unit_completed",
    unitId: "U-104",
    project: "Sunrise Orchards",
    customer: "Sunrise Orchards Inc.",
    description: "Bore (ft) - 320 ft completed",
    timestamp: "2024-01-15 15:30",
    status: "synced",
    submittedBy: "Alex Johnson",
    timeIn: "09:00 AM",
    timeOut: "03:30 PM",
    duration: "6h 30m",
    gpsData: { lat: 37.7739, lng: -122.4174, accuracy: 2.8 },
    photos: [
      { id: "1", url: "/placeholder.svg", timestamp: "09:15 AM" },
      { id: "2", url: "/placeholder.svg", timestamp: "03:25 PM" },
    ],
  },
  "2": {
    id: "2",
    type: "change_request",
    unitId: "U-102",
    project: "North Valley Farm",
    customer: "North Valley Agricultural",
    description: "Location adjustment requested",
    timestamp: "2024-01-15 14:45",
    status: "synced",
    submittedBy: "Alex Johnson",
    changeType: "Location adjustment",
    changeReason: "Original location has underground utilities that weren't marked on the survey. Need to shift 15ft east to avoid conflict.",
    reviewedBy: "Maria Garcia (Project Manager)",
    reviewedAt: "2024-01-15 16:20",
    reviewNotes: "Approved. Updated drawings will be sent by EOD.",
  },
  "3": {
    id: "3",
    type: "unit_completed",
    unitId: "U-105",
    project: "Sunrise Orchards",
    customer: "Sunrise Orchards Inc.",
    description: "Conduit (ft) - 150 ft completed",
    timestamp: "2024-01-14 12:00",
    status: "synced",
    submittedBy: "Alex Johnson",
    timeIn: "10:00 AM",
    timeOut: "12:00 PM",
    duration: "2h 00m",
    photos: [
      { id: "1", url: "/placeholder.svg", timestamp: "10:30 AM" },
      { id: "2", url: "/placeholder.svg", timestamp: "11:45 AM" },
    ],
  },
  "4": {
    id: "4",
    type: "emergency_job",
    unitId: "EJ-001",
    project: "Highland Ranch",
    customer: "Highland Ranch LLC",
    description: "Emergency bore - 200 ft",
    timestamp: "2024-01-14 10:30",
    status: "pending_approval",
    submittedBy: "Alex Johnson",
    units: [
      { type: "Bore (ft)", length: "200" },
      { type: "Handhole", quantity: "2" },
    ],
    photos: [
      { id: "1", url: "/placeholder.svg", timestamp: "10:35 AM" },
      { id: "2", url: "/placeholder.svg", timestamp: "10:40 AM" },
    ],
    gpsData: { lat: 37.7800, lng: -122.4100, accuracy: 4.2 },
    sequentialNumbers: ["SN-4521", "SN-4522"],
  },
  "5": {
    id: "5",
    type: "change_request",
    unitId: "U-106",
    project: "Green Meadows",
    customer: "Green Meadows Farm",
    description: "Additional units needed",
    timestamp: "2024-01-13 16:20",
    status: "approved",
    submittedBy: "Alex Johnson",
    changeType: "Additional units needed",
    changeReason: "Field survey revealed additional 150ft of bore needed to reach the connection point. Original estimate was short.",
    reviewedBy: "John Smith (Field Manager)",
    reviewedAt: "2024-01-13 17:45",
    reviewNotes: "Approved. Additional units added to work order.",
  },
  "6": {
    id: "6",
    type: "unit_completed",
    unitId: "U-101",
    project: "North Valley Farm",
    customer: "North Valley Agricultural",
    description: "Trench (ft) - 180 ft completed",
    timestamp: "2024-01-13 11:00",
    status: "synced",
    submittedBy: "Alex Johnson",
    timeIn: "08:00 AM",
    timeOut: "11:00 AM",
    duration: "3h 00m",
  },
};

const HistoryDetail = () => {
  const navigate = useNavigate();
  const { historyId } = useParams<{ historyId: string }>();

  const detail = historyId ? mockHistoryDetails[historyId] : null;

  if (!detail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Record Not Found</h2>
          <Button onClick={() => navigate("/history")} variant="outline">
            Back to History
          </Button>
        </div>
      </div>
    );
  }

  const getTypeIcon = () => {
    switch (detail.type) {
      case "unit_completed":
        return <CheckCircle2 className="w-6 h-6" />;
      case "change_request":
        return <FileText className="w-6 h-6" />;
      case "emergency_job":
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getTypeColor = () => {
    switch (detail.type) {
      case "unit_completed":
        return "bg-success/10 text-success";
      case "change_request":
        return "bg-primary/10 text-primary";
      case "emergency_job":
        return "bg-destructive/10 text-destructive";
    }
  };

  const getTypeLabel = () => {
    switch (detail.type) {
      case "unit_completed":
        return "Unit Completed";
      case "change_request":
        return "Change Request";
      case "emergency_job":
        return "Emergency Job";
    }
  };

  const getStatusBadge = () => {
    switch (detail.status) {
      case "synced":
        return (
          <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-3 py-1.5 rounded-full">
            <Check className="w-4 h-4" />
            Synced
          </span>
        );
      case "pending_sync":
        return (
          <span className="flex items-center gap-1 text-sm font-medium text-warning bg-warning/10 px-3 py-1.5 rounded-full">
            <CloudOff className="w-4 h-4" />
            Pending Sync
          </span>
        );
      case "pending_approval":
        return (
          <span className="flex items-center gap-1 text-sm font-medium text-warning bg-warning/10 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            Pending Approval
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-3 py-1.5 rounded-full">
            <Check className="w-4 h-4" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-sm font-medium text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
            <X className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/history")}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{detail.unitId}</h1>
            <p className="text-xs text-muted-foreground">{getTypeLabel()}</p>
          </div>
          <SyncStatus compact />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-8 overflow-auto space-y-4">
        {/* Type & Status Card */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor()}`}>
                {getTypeIcon()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{detail.unitId}</p>
                <p className="text-sm text-muted-foreground">{getTypeLabel()}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
          <p className="text-foreground">{detail.description}</p>
        </div>

        {/* Project & Customer */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Project</p>
                <p className="font-medium text-foreground">{detail.project}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">{detail.customer}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Info */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Submission Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted By</p>
                <p className="font-medium text-foreground">{detail.submittedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted At</p>
                <p className="font-medium text-foreground">{formatDate(detail.timestamp)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Completed Specific */}
        {detail.type === "unit_completed" && (
          <>
            {/* Time Tracking */}
            {detail.timeIn && (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Time Tracking</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Time In</p>
                    <p className="font-semibold text-foreground">{detail.timeIn}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Time Out</p>
                    <p className="font-semibold text-foreground">{detail.timeOut}</p>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold text-success">{detail.duration}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Change Request Specific */}
        {detail.type === "change_request" && (
          <>
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Change Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Change Type</p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {detail.changeType}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="text-foreground bg-secondary/50 p-3 rounded-lg">{detail.changeReason}</p>
                </div>
              </div>
            </div>

            {detail.reviewedBy && (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Review</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reviewed By</p>
                      <p className="font-medium text-foreground">{detail.reviewedBy}</p>
                    </div>
                  </div>
                  {detail.reviewedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reviewed At</p>
                        <p className="font-medium text-foreground">{formatDate(detail.reviewedAt)}</p>
                      </div>
                    </div>
                  )}
                  {detail.reviewNotes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Review Notes</p>
                      <p className="text-foreground bg-success/5 border border-success/20 p-3 rounded-lg">
                        {detail.reviewNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Emergency Job Specific */}
        {detail.type === "emergency_job" && (
          <>
            {/* Units */}
            {detail.units && detail.units.length > 0 && (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Units Requested</h3>
                <div className="space-y-2">
                  {detail.units.map((unit, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="font-medium text-foreground">{unit.type}</span>
                      <span className="text-muted-foreground">
                        {unit.length ? `${unit.length} ft` : `Qty: ${unit.quantity}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GPS Data */}
            {detail.gpsData && (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Crosshair className="w-4 h-4" />
                  <span className="text-sm font-medium">GPS Location</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-foreground font-mono">
                    {detail.gpsData.lat.toFixed(6)}, {detail.gpsData.lng.toFixed(6)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accuracy: ±{detail.gpsData.accuracy}m
                  </p>
                </div>
              </div>
            )}

            {/* Sequential Numbers */}
            {detail.sequentialNumbers && detail.sequentialNumbers.length > 0 && (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm font-medium">Sequential Numbers</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detail.sequentialNumbers.map((sn, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-secondary font-mono text-sm rounded-lg">
                      {sn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Photos */}
        {detail.photos && detail.photos.length > 0 && (
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Photos ({detail.photos.length})</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {detail.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square">
                  <img
                    src={photo.url}
                    alt="Documentation"
                    className="w-full h-full object-cover rounded-lg bg-secondary"
                  />
                  <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                    {photo.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <Button
          onClick={() => navigate("/history")}
          variant="outline"
          className="w-full h-12 rounded-xl"
        >
          Back to History
        </Button>
      </main>
    </div>
  );
};

export default HistoryDetail;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Camera, Navigation, Layers, 
  Play, CheckCircle2, Clock, Edit3, AlertTriangle,
  Crosshair, Hash, Image, Plus, X, ChevronRight,
  Timer, User, Calendar, FileText, Send, CloudOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useOffline, useCachedData } from "@/hooks/useOffline";
import SyncStatus from "@/components/SyncStatus";

// Mock data - would come from API
const mockUnits: Record<string, {
  id: string;
  type: string;
  project: string;
  status: string;
  distance: string;
  requiredDocs: string[];
  lat: number;
  lng: number;
  description: string;
  assignedTo: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  gpsRequired: boolean;
  sequentialRequired: boolean;
  photosRequired: number;
  gpsCaptured?: { lat: number; lng: number; accuracy: number; timestamp: string };
  sequentialNumbers?: { value: string; timestamp: string }[];
  photos?: { id: string; url: string; timestamp: string }[];
  timeIn?: string;
  timeOut?: string;
  totalDuration?: string;
}> = {
  "U-102": {
    id: "U-102",
    type: "Bore (ft)",
    project: "North Valley Farm",
    status: "in_progress",
    distance: "450 ft",
    requiredDocs: ["gps", "photo"],
    lat: 37.7749,
    lng: -122.4194,
    description: "Underground bore installation for irrigation line. Depth: 4ft, Material: HDPE",
    assignedTo: "Team Alpha",
    startedAt: "2024-01-15 08:30",
    notes: "Access from north gate. Watch for existing utilities marked in blue.",
    gpsRequired: true,
    sequentialRequired: false,
    photosRequired: 2,
    timeIn: "08:30 AM",
    gpsCaptured: { lat: 37.7749, lng: -122.4194, accuracy: 3.2, timestamp: "08:35 AM" },
    photos: [
      { id: "1", url: "/placeholder.svg", timestamp: "09:15 AM" }
    ],
  },
  "U-103": {
    id: "U-103",
    type: "Trench (ft)",
    project: "North Valley Farm",
    status: "not_started",
    distance: "280 ft",
    requiredDocs: ["gps", "photo", "sequential"],
    lat: 37.7759,
    lng: -122.4184,
    description: "Open trench for cable laying. Depth: 3ft, Width: 18in",
    assignedTo: "Team Alpha",
    notes: "Coordinate with electrical team before starting.",
    gpsRequired: true,
    sequentialRequired: true,
    photosRequired: 3,
  },
  "U-104": {
    id: "U-104",
    type: "Bore (ft)",
    project: "Sunrise Orchards",
    status: "completed",
    distance: "320 ft",
    requiredDocs: ["gps"],
    lat: 37.7739,
    lng: -122.4174,
    description: "Directional bore under access road. Depth: 5ft",
    assignedTo: "Team Alpha",
    startedAt: "2024-01-14 09:00",
    completedAt: "2024-01-14 15:30",
    gpsRequired: true,
    sequentialRequired: false,
    photosRequired: 0,
    gpsCaptured: { lat: 37.7739, lng: -122.4174, accuracy: 2.8, timestamp: "09:05 AM" },
    timeIn: "09:00 AM",
    timeOut: "03:30 PM",
    totalDuration: "6h 30m",
  },
  "U-105": {
    id: "U-105",
    type: "Conduit (ft)",
    project: "Sunrise Orchards",
    status: "verified",
    distance: "150 ft",
    requiredDocs: ["photo"],
    lat: 37.7729,
    lng: -122.4164,
    description: "2-inch conduit installation in existing trench",
    assignedTo: "Team Alpha",
    startedAt: "2024-01-13 10:00",
    completedAt: "2024-01-13 12:00",
    gpsRequired: false,
    sequentialRequired: false,
    photosRequired: 2,
    photos: [
      { id: "1", url: "/placeholder.svg", timestamp: "10:30 AM" },
      { id: "2", url: "/placeholder.svg", timestamp: "11:45 AM" }
    ],
    timeIn: "10:00 AM",
    timeOut: "12:00 PM",
    totalDuration: "2h 00m",
  },
  "U-106": {
    id: "U-106",
    type: "Bore (ft)",
    project: "Green Meadows",
    status: "not_started",
    distance: "520 ft",
    requiredDocs: ["gps", "photo", "sequential"],
    lat: 37.7769,
    lng: -122.4204,
    description: "Long bore through hillside. Special equipment required.",
    assignedTo: "Team Alpha",
    notes: "Heavy machinery access only from east side. Soil survey completed.",
    gpsRequired: true,
    sequentialRequired: true,
    photosRequired: 3,
  },
};

const UnitDetail = () => {
  const navigate = useNavigate();
  const { unitId } = useParams<{ unitId: string }>();
  const { isOnline, addToSyncQueue, pendingCount } = useOffline();
  
  const [unit, setUnit] = useState(() => unitId ? mockUnits[unitId] : null);
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [showGPSCapture, setShowGPSCapture] = useState(false);
  const [showSequentialInput, setShowSequentialInput] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [sequentialValue, setSequentialValue] = useState("");
  const [changeType, setChangeType] = useState("");
  const [changeDescription, setChangeDescription] = useState("");

  if (!unit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Unit Not Found</h2>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-primary text-primary-foreground";
      case "not_started":
        return "bg-secondary text-muted-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "verified":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "not_started":
        return "Not Started";
      case "completed":
        return "Completed";
      case "verified":
        return "Verified";
      default:
        return status;
    }
  };

  const canComplete = () => {
    if (unit.gpsRequired && !unit.gpsCaptured) return false;
    if (unit.sequentialRequired && (!unit.sequentialNumbers || unit.sequentialNumbers.length === 0)) return false;
    if (unit.photosRequired > 0 && (!unit.photos || unit.photos.length < unit.photosRequired)) return false;
    return true;
  };

  const handleStartWork = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updatedUnit = {
      ...unit,
      status: "in_progress",
      timeIn: now,
    };
    setUnit(updatedUnit);
    
    // Queue for sync if offline
    if (!isOnline) {
      addToSyncQueue('unit_update', { unitId: unit.id, action: 'start_work', timeIn: now });
      toast.success("Work started!", { description: `Time in: ${now} (Saved offline)` });
    } else {
      toast.success("Work started!", { description: `Time in: ${now}` });
    }
  };

  const handleMarkComplete = () => {
    if (!canComplete()) {
      toast.error("Cannot complete", { description: "Please fill all required items first" });
      return;
    }
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updatedUnit = {
      ...unit,
      status: "completed",
      timeOut: now,
      totalDuration: "Calculated",
    };
    setUnit(updatedUnit);
    
    // Queue for sync if offline
    if (!isOnline) {
      addToSyncQueue('unit_update', { unitId: unit.id, action: 'mark_complete', timeOut: now });
      toast.success("Unit marked as complete!", { description: `Time out: ${now} (Saved offline)` });
    } else {
      toast.success("Unit marked as complete!", { description: `Time out: ${now}` });
    }
  };

  const handleCaptureGPS = () => {
    setShowGPSCapture(true);
    // Simulate getting GPS
    setTimeout(() => {
      setGpsAccuracy(3.5);
    }, 1000);
  };

  const confirmGPSCapture = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const gpsData = {
      lat: 37.7749 + Math.random() * 0.001,
      lng: -122.4194 + Math.random() * 0.001,
      accuracy: gpsAccuracy || 3.5,
      timestamp: now,
    };
    setUnit({
      ...unit,
      gpsCaptured: gpsData,
    });
    setShowGPSCapture(false);
    
    // Queue for sync if offline
    if (!isOnline) {
      addToSyncQueue('gps', { unitId: unit.id, gpsData });
      toast.success("GPS location captured!", { description: "Saved offline" });
    } else {
      toast.success("GPS location captured!");
    }
  };

  const handleAddSequential = () => {
    if (!sequentialValue.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newEntry = { value: sequentialValue, timestamp: now };
    setUnit({
      ...unit,
      sequentialNumbers: [...(unit.sequentialNumbers || []), newEntry],
    });
    setSequentialValue("");
    setShowSequentialInput(false);
    
    // Queue for sync if offline
    if (!isOnline) {
      addToSyncQueue('unit_update', { unitId: unit.id, action: 'add_sequential', entry: newEntry });
      toast.success("Sequential number added!", { description: "Saved offline" });
    } else {
      toast.success("Sequential number added!");
    }
  };

  const handleAddPhoto = () => {
    // Simulate adding a photo
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newPhoto = { id: Date.now().toString(), url: "/placeholder.svg", timestamp: now };
    setUnit({
      ...unit,
      photos: [...(unit.photos || []), newPhoto],
    });
    
    // Queue for sync if offline
    if (!isOnline) {
      addToSyncQueue('photo', { unitId: unit.id, photo: newPhoto });
      toast.success("Photo added!", { description: "Saved offline" });
    } else {
      toast.success("Photo added!");
    }
  };

  const handleSubmitChangeRequest = () => {
    if (!changeType || !changeDescription.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const changeRequest = {
      unitId: unit.id,
      type: changeType,
      description: changeDescription,
      timestamp: new Date().toISOString(),
    };
    
    // Queue for sync if offline
    if (!isOnline) {
      addToSyncQueue('change_request', changeRequest);
      toast.success("Change request saved!", { description: "Will submit when online" });
    } else {
      toast.success("Change request submitted!", { description: "FM/PC will review shortly" });
    }
    
    setShowChangeRequest(false);
    setChangeType("");
    setChangeDescription("");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{unit.id}</h1>
            <p className="text-xs text-muted-foreground">{unit.type} • {unit.distance}</p>
          </div>
          <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(unit.status)}`}>
            {getStatusLabel(unit.status)}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 space-y-4 animate-fade-in">
        {/* Project Info */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Project</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{unit.project}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{unit.assignedTo}</span>
            </div>
          </div>
        </div>

        {/* Time Tracking */}
        {(unit.timeIn || unit.status !== "not_started") && (
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">Time Tracking</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Time In</p>
                <p className="font-semibold text-foreground">{unit.timeIn || "--:--"}</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Time Out</p>
                <p className="font-semibold text-foreground">{unit.timeOut || "--:--"}</p>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold text-primary">{unit.totalDuration || "Active"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Checklist */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Requirements</span>
          </div>
          
          <div className="space-y-3">
            {/* GPS Requirement */}
            {unit.gpsRequired && (
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    unit.gpsCaptured ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"
                  }`}>
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">GPS Location</p>
                    <p className="text-xs text-muted-foreground">
                      {unit.gpsCaptured 
                        ? `Captured at ${unit.gpsCaptured.timestamp} (±${unit.gpsCaptured.accuracy}m)` 
                        : "Not captured yet"}
                    </p>
                  </div>
                </div>
                {!unit.gpsCaptured ? (
                  <Button size="sm" onClick={handleCaptureGPS} className="rounded-lg">
                    <Navigation className="w-4 h-4 mr-1" />
                    Capture
                  </Button>
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
              </div>
            )}

            {/* Sequential Numbers */}
            {unit.sequentialRequired && (
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      unit.sequentialNumbers && unit.sequentialNumbers.length > 0 
                        ? "bg-success/20 text-success" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Sequential Numbers</p>
                      <p className="text-xs text-muted-foreground">
                        {unit.sequentialNumbers?.length || 0} entries
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setShowSequentialInput(true)} className="rounded-lg">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {unit.sequentialNumbers && unit.sequentialNumbers.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {unit.sequentialNumbers.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-card p-2 rounded">
                        <span className="font-mono text-foreground">{entry.value}</span>
                        <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Photos */}
            {unit.photosRequired > 0 && (
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      (unit.photos?.length || 0) >= unit.photosRequired 
                        ? "bg-success/20 text-success" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Photos</p>
                      <p className="text-xs text-muted-foreground">
                        {unit.photos?.length || 0} / {unit.photosRequired} required
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddPhoto} className="rounded-lg">
                    <Camera className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {unit.photos && unit.photos.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {unit.photos.map((photo) => (
                      <div key={photo.id} className="relative flex-shrink-0">
                        <img 
                          src={photo.url} 
                          alt="Captured" 
                          className="w-16 h-16 rounded-lg object-cover bg-secondary"
                        />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 rounded-b-lg">
                          {photo.timestamp}
                        </span>
                      </div>
                    ))}
                    {(unit.photos?.length || 0) < unit.photosRequired && (
                      <button 
                        onClick={handleAddPhoto}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description & Notes */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Details</span>
          </div>
          <p className="text-foreground text-sm">{unit.description}</p>
          {unit.notes && (
            <div className="mt-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-xs font-medium text-warning mb-1">Office Notes</p>
              <p className="text-sm text-foreground">{unit.notes}</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="text-sm text-foreground font-mono">
                {unit.lat.toFixed(6)}, {unit.lng.toFixed(6)}
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Edit3 className="w-4 h-4 mr-1" />
              Adjust
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-safe-bottom z-10">
        <div className="space-y-2 max-w-md mx-auto">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            {unit.status === "not_started" && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowChangeRequest(true)}
                  className="h-12 rounded-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Propose Change
                </Button>
                <Button onClick={handleStartWork} className="h-12 rounded-xl">
                  <Play className="w-4 h-4 mr-2" />
                  Start Work
                </Button>
              </>
            )}
            {unit.status === "in_progress" && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowChangeRequest(true)}
                  className="h-12 rounded-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Propose Change
                </Button>
                <Button 
                  onClick={handleMarkComplete}
                  disabled={!canComplete()}
                  className="h-12 rounded-xl bg-success hover:bg-success/90 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </>
            )}
            {(unit.status === "completed" || unit.status === "verified") && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowChangeRequest(true)}
                  className="h-12 rounded-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Propose Change
                </Button>
                <Button variant="secondary" className="h-12 rounded-xl" disabled>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {unit.status === "verified" ? "Verified" : "Awaiting Review"}
                </Button>
              </>
            )}
          </div>
          {!canComplete() && unit.status === "in_progress" && (
            <p className="text-xs text-center text-muted-foreground">
              Complete all requirements to mark as done
            </p>
          )}
        </div>
      </div>

      {/* GPS Capture Dialog */}
      <Dialog open={showGPSCapture} onOpenChange={setShowGPSCapture}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-primary" />
              Capture GPS Location
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {gpsAccuracy === null ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground">Acquiring GPS signal...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-success/10 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="font-medium text-foreground">GPS Signal Acquired</p>
                  <p className="text-sm text-muted-foreground">Accuracy: ±{gpsAccuracy}m</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
                  <p className="font-mono text-sm text-foreground">
                    {(37.7749 + Math.random() * 0.001).toFixed(6)}, {(-122.4194 + Math.random() * 0.001).toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowGPSCapture(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button onClick={confirmGPSCapture} disabled={gpsAccuracy === null} className="flex-1 rounded-xl">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sequential Number Dialog */}
      <Dialog open={showSequentialInput} onOpenChange={setShowSequentialInput}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Add Sequential Number
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter sequential number..."
              value={sequentialValue}
              onChange={(e) => setSequentialValue(e.target.value)}
              className="h-12 rounded-xl text-lg font-mono"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowSequentialInput(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleAddSequential} disabled={!sequentialValue.trim()} className="flex-1 rounded-xl">
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Request Dialog */}
      <Dialog open={showChangeRequest} onOpenChange={setShowChangeRequest}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Propose Change
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Project</p>
              <p className="font-medium text-foreground">{unit.project}</p>
              <p className="text-xs text-muted-foreground mt-1">Unit</p>
              <p className="font-medium text-foreground">{unit.id} - {unit.type}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Change Type *</label>
              <Select value={changeType} onValueChange={setChangeType}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select change type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="location">Location Adjustment</SelectItem>
                  <SelectItem value="unit_type">Unit Type Change</SelectItem>
                  <SelectItem value="additional">Additional Units Needed</SelectItem>
                  <SelectItem value="remove">Remove Unit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description *</label>
              <Textarea
                placeholder="Describe the change needed..."
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                className="min-h-[100px] rounded-xl resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Attach Photos (Optional)</label>
              <button className="w-full h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-sm">Tap to add photos</span>
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowChangeRequest(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitChangeRequest} 
              disabled={!changeType || !changeDescription.trim()} 
              className="flex-1 rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitDetail;

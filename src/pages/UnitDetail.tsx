import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Camera, Navigation, Layers, 
  Play, CheckCircle2, Clock, Edit3, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  },
};

const UnitDetail = () => {
  const navigate = useNavigate();
  const { unitId } = useParams<{ unitId: string }>();
  
  const unit = unitId ? mockUnits[unitId] : null;

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
        return "bg-primary/10 text-primary border-primary/20";
      case "not_started":
        return "bg-secondary text-muted-foreground border-border";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "verified":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted text-muted-foreground border-border";
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

  const getDocLabel = (doc: string) => {
    switch (doc) {
      case "gps":
        return "GPS Location";
      case "photo":
        return "Photo Required";
      case "sequential":
        return "Sequential Docs";
      default:
        return doc;
    }
  };

  const getDocIcon = (doc: string) => {
    switch (doc) {
      case "gps":
        return <Navigation className="w-4 h-4" />;
      case "photo":
        return <Camera className="w-4 h-4" />;
      case "sequential":
        return <Layers className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
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
            <p className="text-xs text-muted-foreground">{unit.type}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(unit.status)}`}>
            {getStatusLabel(unit.status)}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 space-y-4 animate-fade-in">
        {/* Project Info */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Project</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{unit.project}</h3>
          <p className="text-sm text-muted-foreground mt-1">{unit.assignedTo}</p>
        </div>

        {/* Description */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
          <p className="text-foreground">{unit.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Distance:</span>
            <span className="text-sm font-medium text-foreground">{unit.distance}</span>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Required Documentation</h4>
          <div className="space-y-2">
            {unit.requiredDocs.map((doc) => (
              <div
                key={doc}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  {getDocIcon(doc)}
                </div>
                <span className="text-sm font-medium text-foreground">{getDocLabel(doc)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {(unit.startedAt || unit.completedAt) && (
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Timeline</h4>
            <div className="space-y-3">
              {unit.startedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Work Started</p>
                    <p className="text-xs text-muted-foreground">{unit.startedAt}</p>
                  </div>
                </div>
              )}
              {unit.completedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Work Completed</p>
                    <p className="text-xs text-muted-foreground">{unit.completedAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Location</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">
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
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {unit.status === "not_started" && (
            <>
              <Button variant="outline" className="h-12 rounded-xl">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
              <Button className="h-12 rounded-xl">
                <Play className="w-4 h-4 mr-2" />
                Start Work
              </Button>
            </>
          )}
          {unit.status === "in_progress" && (
            <>
              <Button variant="outline" className="h-12 rounded-xl">
                <Clock className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button className="h-12 rounded-xl bg-success hover:bg-success/90">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </>
          )}
          {(unit.status === "completed" || unit.status === "verified") && (
            <>
              <Button variant="outline" className="h-12 rounded-xl">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              <Button variant="secondary" className="h-12 rounded-xl" disabled>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {unit.status === "verified" ? "Verified" : "Awaiting Verification"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;

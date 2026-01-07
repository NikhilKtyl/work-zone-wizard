import { useState } from "react";
import { 
  Locate, ZoomIn, ZoomOut, Layers, MapPin, Camera, 
  Navigation, ChevronUp, Play, CheckCircle2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Unit {
  id: string;
  type: string;
  project: string;
  status: string;
  distance: string;
  requiredDocs: string[];
  lat: number;
  lng: number;
}

interface MapViewProps {
  units: Unit[];
  mapboxToken?: string;
  onTokenChange?: (token: string) => void;
  onUnitClick: (id: string) => void;
}

const MapView = ({ units, onUnitClick }: MapViewProps) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showAllUnits, setShowAllUnits] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-primary border-primary";
      case "not_started":
        return "bg-muted-foreground border-muted-foreground";
      case "completed":
        return "bg-success border-success";
      case "verified":
        return "bg-success border-success";
      default:
        return "bg-muted-foreground border-muted-foreground";
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

  const getDocIcon = (doc: string) => {
    switch (doc) {
      case "gps":
        return <Navigation className="w-3.5 h-3.5" />;
      case "photo":
        return <Camera className="w-3.5 h-3.5" />;
      case "sequential":
        return <Layers className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  // Generate positions for units on the mock map
  const getUnitPosition = (index: number, total: number) => {
    const positions = [
      { top: "25%", left: "30%" },
      { top: "35%", left: "55%" },
      { top: "50%", left: "25%" },
      { top: "45%", left: "70%" },
      { top: "65%", left: "45%" },
      { top: "30%", left: "75%" },
      { top: "70%", left: "30%" },
      { top: "55%", left: "60%" },
    ];
    return positions[index % positions.length];
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  };

  return (
    <div className="relative flex-1 h-full min-h-[500px] animate-fade-in">
      {/* Mock Map Container */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#e8f4e8] via-[#f0f7f0] to-[#e5f0e5] overflow-hidden"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
      >
        {/* Grid lines for map effect */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Mock Roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main road */}
          <path d="M 0 50 Q 25 45, 50 50 T 100 48" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
          <path d="M 20 0 Q 25 25, 22 50 T 25 100" stroke="#d1d5db" strokeWidth="1" fill="none" />
          <path d="M 60 0 Q 55 30, 60 50 T 55 100" stroke="#d1d5db" strokeWidth="1" fill="none" />
          <path d="M 0 30 Q 30 28, 50 32 T 100 30" stroke="#e5e7eb" strokeWidth="0.8" fill="none" />
          <path d="M 0 70 Q 40 72, 60 68 T 100 72" stroke="#e5e7eb" strokeWidth="0.8" fill="none" />
        </svg>

        {/* Mock Areas/Fields */}
        <div className="absolute top-[15%] left-[10%] w-24 h-16 bg-[#c7e2c7] rounded-lg opacity-50" />
        <div className="absolute top-[60%] left-[60%] w-32 h-20 bg-[#c7e2c7] rounded-lg opacity-50" />
        <div className="absolute top-[20%] left-[65%] w-20 h-24 bg-[#b8d4b8] rounded-lg opacity-40" />
        <div className="absolute top-[50%] left-[5%] w-16 h-28 bg-[#c7e2c7] rounded-lg opacity-50" />

        {/* Mock Labels */}
        <div className="absolute top-[12%] left-[12%] text-[10px] text-muted-foreground/60 font-medium">
          North Valley Farm
        </div>
        <div className="absolute top-[58%] left-[62%] text-[10px] text-muted-foreground/60 font-medium">
          Sunrise Orchards
        </div>
        <div className="absolute top-[18%] left-[67%] text-[10px] text-muted-foreground/60 font-medium">
          Green Meadows
        </div>

        {/* Unit Markers */}
        {units.map((unit, index) => {
          const position = getUnitPosition(index, units.length);
          return (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center transition-all hover:scale-125 hover:z-10 ${getStatusColor(unit.status)} ${
                selectedUnit?.id === unit.id ? "scale-125 z-10 ring-4 ring-primary/30" : ""
              }`}
              style={{ top: position.top, left: position.left }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </button>
          );
        })}

        {/* Current Location Indicator */}
        <div 
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-primary shadow-lg animate-pulse"
          style={{ top: "48%", left: "42%" }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="flex items-center justify-between">
          {/* Toggle */}
          <button
            onClick={() => setShowAllUnits(!showAllUnits)}
            className="pointer-events-auto bg-card rounded-xl px-4 py-2 shadow-elevated border border-border flex items-center gap-2 text-sm font-medium"
          >
            <Layers className="w-4 h-4" />
            {showAllUnits ? "All Units" : "Nearby"}
          </button>

          {/* Legend */}
          <div className="pointer-events-auto bg-card rounded-xl px-3 py-2 shadow-elevated border border-border">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span>Not Started</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom & Location Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-12 h-12 bg-card rounded-xl shadow-elevated border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-12 h-12 bg-card rounded-xl shadow-elevated border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          className="w-12 h-12 bg-primary rounded-xl shadow-elevated flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      {/* Unit Count Badge */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-card rounded-xl px-4 py-2 shadow-elevated border border-border">
          <p className="text-sm font-medium text-foreground">{units.length} units visible</p>
        </div>
      </div>

      {/* Selected Unit Sheet */}
      {selectedUnit && (
        <div className="absolute bottom-0 left-0 right-0 z-20 animate-slide-up">
          <div className="bg-card rounded-t-2xl shadow-modal border-t border-border p-4">
            {/* Handle */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

            {/* Unit Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedUnit.id} – {selectedUnit.type}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedUnit.project}</p>
              </div>
              <button
                onClick={() => setSelectedUnit(null)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Docs */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  selectedUnit.status === "completed" || selectedUnit.status === "verified"
                    ? "bg-success/10 text-success"
                    : selectedUnit.status === "in_progress"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {getStatusLabel(selectedUnit.status)}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">{selectedUnit.distance}</span>
                {selectedUnit.requiredDocs.map((doc) => (
                  <div
                    key={doc}
                    className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground"
                    title={doc}
                  >
                    {getDocIcon(doc)}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onUnitClick(selectedUnit.id)}
                variant="outline"
                className="h-12 rounded-xl"
              >
                <ChevronUp className="w-4 h-4 mr-2" />
                Unit Details
              </Button>
              {selectedUnit.status === "not_started" && (
                <Button className="h-12 rounded-xl">
                  <Play className="w-4 h-4 mr-2" />
                  Start Work
                </Button>
              )}
              {selectedUnit.status === "in_progress" && (
                <Button className="h-12 rounded-xl bg-success hover:bg-success/90">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
              {(selectedUnit.status === "completed" || selectedUnit.status === "verified") && (
                <Button variant="secondary" className="h-12 rounded-xl" disabled>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

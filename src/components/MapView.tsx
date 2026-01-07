import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { 
  Locate, ZoomIn, ZoomOut, Layers, MapPin, Camera, 
  Navigation, ChevronUp, Play, CheckCircle2, X, Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  mapboxToken: string;
  onTokenChange: (token: string) => void;
  onUnitClick: (id: string) => void;
}

const MapView = ({ units, mapboxToken, onTokenChange, onUnitClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showAllUnits, setShowAllUnits] = useState(true);
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);
  const [tempToken, setTempToken] = useState(mapboxToken);
  const [mapLoaded, setMapLoaded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "#3B82F6";
      case "not_started":
        return "#6B7280";
      case "completed":
        return "#22C55E";
      case "verified":
        return "#16A34A";
      default:
        return "#6B7280";
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

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-122.4194, 37.7749],
        zoom: 14,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      );

      map.current.on("load", () => {
        setMapLoaded(true);
        addMarkers();
      });

      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        map.current?.remove();
      };
    } catch (error) {
      console.error("Map initialization error:", error);
      setShowTokenInput(true);
    }
  }, [mapboxToken]);

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    units.forEach((unit) => {
      const el = document.createElement("div");
      el.className = "unit-marker";
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: ${getStatusColor(unit.status)};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      `;
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
      
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });
      el.addEventListener("click", () => {
        setSelectedUnit(unit);
        map.current?.flyTo({
          center: [unit.lng, unit.lat],
          zoom: 16,
          duration: 500,
        });
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([unit.lng, unit.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.current?.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 15,
            duration: 1000,
          });
        },
        () => {
          // Fallback to units center
          if (units.length > 0) {
            const avgLat = units.reduce((sum, u) => sum + u.lat, 0) / units.length;
            const avgLng = units.reduce((sum, u) => sum + u.lng, 0) / units.length;
            map.current?.flyTo({
              center: [avgLng, avgLat],
              zoom: 14,
              duration: 1000,
            });
          }
        }
      );
    }
  };

  const handleZoomIn = () => {
    map.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    map.current?.zoomOut({ duration: 300 });
  };

  const handleSaveToken = () => {
    if (tempToken.trim()) {
      onTokenChange(tempToken.trim());
      setShowTokenInput(false);
    }
  };

  if (showTokenInput || !mapboxToken) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground text-center mb-2">
            Mapbox Token Required
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            To use the map view, please enter your Mapbox public token. Get one at{" "}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <Input
            placeholder="pk.xxxxx..."
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
            className="mb-4 h-12 rounded-xl"
          />
          <Button
            onClick={handleSaveToken}
            disabled={!tempToken.trim()}
            className="w-full h-12 rounded-xl"
          >
            Save & Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 h-full animate-fade-in">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

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

          {/* Settings */}
          <button
            onClick={() => setShowTokenInput(true)}
            className="pointer-events-auto w-10 h-10 bg-card rounded-xl shadow-elevated border border-border flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
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
          onClick={handleRecenter}
          className="w-12 h-12 bg-primary rounded-xl shadow-elevated flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Unit Sheet */}
      {selectedUnit && (
        <div className="absolute bottom-0 left-0 right-0 z-10 animate-slide-up">
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Leaf, MapPin, Layers, AlertTriangle, History, User, 
  CheckCircle2, Target, Timer, LogOut, Clock, Building2, ChevronDown, Hammer
} from "lucide-react";
import ListView from "@/components/ListView";
import MapView from "@/components/MapView";
import OfflineIndicator from "@/components/OfflineIndicator";
import SyncStatus from "@/components/SyncStatus";
import { useCachedData } from "@/hooks/useOffline";
import { useProject, Project } from "@/contexts/ProjectContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data
const mockUser = {
  name: "Alex",
  role: "Foreman",
  crew: "Crew A",
};

const mockStats = {
  unitsAssigned: 12,
  unitsCompleted: 5,
  timeOnSite: "4h 32m",
};

const initialUnits = [
  {
    id: "U-102",
    type: "Bore (ft)",
    project: "North Valley Farm",
    status: "in_progress",
    distance: "450 ft",
    requiredDocs: ["gps", "photo"],
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: "U-103",
    type: "Trench (ft)",
    project: "North Valley Farm",
    status: "not_started",
    distance: "280 ft",
    requiredDocs: ["gps", "photo", "sequential"],
    lat: 37.7759,
    lng: -122.4184,
  },
  {
    id: "U-104",
    type: "Bore (ft)",
    project: "Sunrise Orchards",
    status: "completed",
    distance: "320 ft",
    requiredDocs: ["gps"],
    lat: 37.7739,
    lng: -122.4174,
  },
  {
    id: "U-105",
    type: "Conduit (ft)",
    project: "Sunrise Orchards",
    status: "verified",
    distance: "150 ft",
    requiredDocs: ["photo"],
    lat: 37.7729,
    lng: -122.4164,
  },
  {
    id: "U-106",
    type: "Bore (ft)",
    project: "Green Meadows",
    status: "not_started",
    distance: "520 ft",
    requiredDocs: ["gps", "photo", "sequential"],
    lat: 37.7769,
    lng: -122.4204,
  },
];

type ViewMode = "home" | "units" | "map";
type NavTab = "home" | "units" | "map" | "emergency" | "history";

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedProject, projects, setSelectedProject, isLoading: projectLoading } = useProject();
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [activeNav, setActiveNav] = useState<NavTab>("home");
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [projectSheetOpen, setProjectSheetOpen] = useState(false);
  
  // Use cached data for offline support
  const { data: allUnits } = useCachedData('units', initialUnits);
  
  // Filter units by selected project
  const mockUnits = selectedProject 
    ? allUnits.filter(unit => unit.project === selectedProject.name)
    : allUnits;

  // Redirect to project selection if no project is selected
  useEffect(() => {
    if (!projectLoading && !selectedProject) {
      navigate("/select-project");
    }
  }, [projectLoading, selectedProject, navigate]);

  useEffect(() => {
    if (mapboxToken) {
      localStorage.setItem("mapbox_token", mapboxToken);
    }
  }, [mapboxToken]);

  const handleNavClick = (tab: NavTab) => {
    setActiveNav(tab);
    if (tab === "home") {
      setViewMode("home");
    } else if (tab === "units") {
      setViewMode("units");
    } else if (tab === "map") {
      setViewMode("map");
    }
  };

  const handleLogout = () => {
    navigate("/auth");
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setProjectSheetOpen(false);
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Hammer className="w-3 h-3" />
            In Progress
          </span>
        );
      case "planning":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
            <Clock className="w-3 h-3" />
            Planning
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
    }
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              {/* Project Selector - Sheet Trigger */}
              <Sheet open={projectSheetOpen} onOpenChange={setProjectSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-secondary/50 rounded-lg px-2 py-1 -ml-2 transition-colors">
                    <div className="text-left">
                      <p className="text-lg font-bold text-foreground leading-tight">
                        {selectedProject?.name || "Select Project"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedProject?.customer || "No project selected"}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-xl">Switch Project</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-3 overflow-auto pb-8">
                    {projects
                      .filter((p) => p.status !== "completed")
                      .map((project) => (
                        <button
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className={`w-full rounded-xl p-4 flex items-center gap-4 text-left transition-all border ${
                            selectedProject?.id === project.id
                              ? "bg-primary/10 border-primary"
                              : "bg-card border-border/50 hover:border-primary/30 hover:shadow-card"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground truncate">
                                {project.name}
                              </h3>
                              {getStatusBadge(project.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {project.customer}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {project.unitCount} units assigned
                            </p>
                          </div>
                          {selectedProject?.id === project.id && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </button>
                      ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SyncStatus compact />
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{mockUser.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-auto">
        {viewMode === "home" && (
          <div className="px-4 py-4 animate-fade-in">
            {/* Greeting */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Hi, {mockUser.name}</h2>
              <p className="text-muted-foreground">{mockUser.role} – {mockUser.crew}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mockStats.unitsAssigned}</p>
                <p className="text-xs text-muted-foreground">Assigned</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mockStats.unitsCompleted}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-2">
                  <Timer className="w-5 h-5 text-warning" />
                </div>
                <p className="text-2xl font-bold text-foreground">{mockStats.timeOnSite}</p>
                <p className="text-xs text-muted-foreground">On Site</p>
              </div>
            </div>

            {/* Main Action Tiles */}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">My Work</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  setViewMode("map");
                  setActiveNav("map");
                }}
                className="bg-primary rounded-2xl p-6 shadow-elevated text-left hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-primary-foreground">Map View</h4>
                <p className="text-sm text-primary-foreground/70 mt-1">See units on map</p>
              </button>

              <button
                onClick={() => {
                  setViewMode("units");
                  setActiveNav("units");
                }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border text-left hover:shadow-elevated active:scale-[0.98] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Unit View</h4>
                <p className="text-sm text-muted-foreground mt-1">Browse all units</p>
              </button>
            </div>

            {/* Recent Units Preview */}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {mockUnits.slice(0, 3).map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => navigate(`/unit/${unit.id}`)}
                  className="w-full bg-card rounded-xl p-3 shadow-card border border-border/50 flex items-center gap-3 hover:shadow-elevated active:scale-[0.99] transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    unit.status === "completed" || unit.status === "verified" 
                      ? "bg-success/10" 
                      : unit.status === "in_progress" 
                        ? "bg-primary/10" 
                        : "bg-secondary"
                  }`}>
                    {unit.status === "completed" || unit.status === "verified" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : unit.status === "in_progress" ? (
                      <Clock className="w-5 h-5 text-primary" />
                    ) : (
                      <Target className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{unit.id} – {unit.type}</p>
                    <p className="text-xs text-muted-foreground">{unit.project}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{unit.distance}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === "units" && (
          <ListView 
            units={mockUnits} 
            onBack={() => setViewMode("home")} 
            onUnitClick={(id) => navigate(`/unit/${id}`)}
          />
        )}

        {viewMode === "map" && (
          <MapView 
            units={mockUnits} 
            mapboxToken={mapboxToken}
            onTokenChange={setMapboxToken}
            onUnitClick={(id) => navigate(`/unit/${id}`)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 pb-safe-bottom z-20">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => handleNavClick("home")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeNav === "home"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Leaf className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => handleNavClick("units")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeNav === "units"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-medium">Units</span>
          </button>

          <button
            onClick={() => handleNavClick("map")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeNav === "map"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium">Map</span>
          </button>

          <button
            onClick={() => navigate("/emergency")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeNav === "emergency"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Emergency</span>
          </button>

          <button
            onClick={() => navigate("/history")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeNav === "history"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;

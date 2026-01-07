import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  MapPin,
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  LogOut,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Mock data for demonstration
const mockProjects = [
  {
    id: "1",
    name: "North Valley Farm",
    location: "Block A-12",
    status: "in_progress",
    tasksTotal: 8,
    tasksCompleted: 3,
    priority: "normal",
  },
  {
    id: "2",
    name: "Sunrise Orchards",
    location: "Section 4",
    status: "pending",
    tasksTotal: 5,
    tasksCompleted: 0,
    priority: "high",
  },
  {
    id: "3",
    name: "Green Meadows",
    location: "Unit 7B",
    status: "in_progress",
    tasksTotal: 12,
    tasksCompleted: 10,
    priority: "normal",
  },
];

const mockUser = {
  name: "John Martinez",
  role: "Foreman",
  crew: "Team Alpha",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"projects" | "map" | "emergency">("projects");

  const handleLogout = () => {
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-primary/10 text-primary";
      case "pending":
        return "bg-warning/10 text-warning";
      case "completed":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">BerryTech</h1>
              <p className="text-xs text-muted-foreground">{mockUser.crew}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <p className="text-sm font-medium text-foreground">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Tasks</span>
            </div>
            <p className="text-xl font-bold text-foreground">25</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-xl font-bold text-foreground">12</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Done</span>
            </div>
            <p className="text-xl font-bold text-foreground">13</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Assigned Projects</h2>
          <span className="text-sm text-muted-foreground">{mockProjects.length} active</span>
        </div>

        {/* Project Cards */}
        <div className="space-y-3">
          {mockProjects.map((project, index) => (
            <button
              key={project.id}
              className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 text-left hover:shadow-elevated transition-all active:scale-[0.99] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    {project.priority === "high" && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
                        Priority
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusLabel(project.status)}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all"
                      style={{
                        width: `${(project.tasksCompleted / project.tasksTotal) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.tasksCompleted}/{project.tasksTotal}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 pb-safe-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === "projects"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs font-medium">Work List</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === "map"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs font-medium">Map</span>
          </button>

          <button
            onClick={() => setActiveTab("emergency")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === "emergency"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="text-xs font-medium">Emergency</span>
          </button>

          <button
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;

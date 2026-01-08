import { useNavigate } from "react-router-dom";
import { useProject, Project } from "@/contexts/ProjectContext";
import { Leaf, Building2, CheckCircle2, Clock, Hammer, ChevronRight } from "lucide-react";

const ProjectSelection = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useProject();

  // Filter to show only active projects by default (in_progress and planning)
  const activeProjects = projects.filter((p) => p.status !== "completed");

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    navigate("/dashboard");
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">BerryTech</h1>
            <p className="text-xs text-muted-foreground">Field Operations</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">Select a Project</h2>
          <p className="text-muted-foreground mt-1">
            Choose a project to view your assigned units
          </p>
        </div>

        {/* Project List */}
        <div className="space-y-3 animate-slide-up">
          {activeProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleSelectProject(project)}
              className="w-full bg-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-4 hover:shadow-elevated hover:border-primary/30 active:scale-[0.99] transition-all text-left"
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
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>

        {activeProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active projects assigned</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectSelection;

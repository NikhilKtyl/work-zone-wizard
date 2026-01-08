import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  customer: string;
  status: "in_progress" | "planning" | "completed";
  unitCount: number;
}

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "North Valley Farm",
    customer: "Valley Farms Inc.",
    status: "in_progress",
    unitCount: 8,
  },
  {
    id: "proj-2",
    name: "Sunrise Orchards",
    customer: "Sunrise Agriculture Co.",
    status: "in_progress",
    unitCount: 5,
  },
  {
    id: "proj-3",
    name: "Green Meadows",
    customer: "Meadows Development LLC",
    status: "planning",
    unitCount: 3,
  },
  {
    id: "proj-4",
    name: "Riverside Vineyards",
    customer: "Riverside Estates",
    status: "completed",
    unitCount: 12,
  },
];

const STORAGE_KEY = "selected_project_id";

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored project on mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem(STORAGE_KEY);
    if (storedProjectId) {
      const found = projects.find((p) => p.id === storedProjectId);
      if (found) {
        setSelectedProjectState(found);
      }
    }
    setIsLoading(false);
  }, [projects]);

  const setSelectedProject = (project: Project) => {
    setSelectedProjectState(project);
    localStorage.setItem(STORAGE_KEY, project.id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

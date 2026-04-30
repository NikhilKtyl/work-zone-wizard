import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProjectSelection from "./pages/ProjectSelection";
import Dashboard from "./pages/Dashboard";
import UnitDetail from "./pages/UnitDetail";
import EmergencyJob from "./pages/EmergencyJob";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import Profile from "./pages/Profile";
import SpliceIndex from "./pages/splice/SpliceIndex";
import SpliceTodaysUnits from "./pages/splice/TodaysUnits";
import SpliceUnitDetail from "./pages/splice/UnitDetail";
import SpliceFieldVoice from "./pages/splice/FieldVoice";
import SpliceEmergency from "./pages/splice/EmergencyJob";
import SplicePulseFlow from "./pages/splice/PulseFlow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/select-project" element={<ProjectSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/unit/:unitId" element={<UnitDetail />} />
            <Route path="/emergency" element={<EmergencyJob />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:historyId" element={<HistoryDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/splice" element={<SpliceIndex />} />
            <Route path="/splice/today" element={<SpliceTodaysUnits />} />
            <Route path="/splice/unit/:unitId" element={<SpliceUnitDetail />} />
            <Route path="/splice/fieldvoice" element={<SpliceFieldVoice />} />
            <Route path="/splice/emergency" element={<SpliceEmergency />} />
            <Route path="/splice/pulseflow" element={<SplicePulseFlow />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

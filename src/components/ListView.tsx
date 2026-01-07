import { useState } from "react";
import { ArrowLeft, MapPin, Camera, Navigation, Layers, Search, Filter, X } from "lucide-react";
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

interface ListViewProps {
  units: Unit[];
  onBack: () => void;
  onUnitClick: (id: string) => void;
}

type FilterType = "today" | "all" | "by_project" | "by_status";

const ListView = ({ units, onBack, onUnitClick }: ListViewProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const getDocIcon = (doc: string) => {
    switch (doc) {
      case "gps":
        return <Navigation className="w-3 h-3" />;
      case "photo":
        return <Camera className="w-3 h-3" />;
      case "sequential":
        return <Layers className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = 
      unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "all", label: "All" },
    { key: "by_project", label: "By Project" },
    { key: "by_status", label: "By Status" },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Assigned Units</h2>
            <p className="text-xs text-muted-foreground">{filteredUnits.length} units</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              showFilters ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-background border-border"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Unit List */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-auto">
        {filteredUnits.map((unit, index) => (
          <button
            key={unit.id}
            onClick={() => onUnitClick(unit.id)}
            className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 text-left hover:shadow-elevated active:scale-[0.99] transition-all animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{unit.id} – {unit.type}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{unit.project}</span>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{unit.distance}</span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(unit.status)}`}
              >
                {getStatusLabel(unit.status)}
              </span>

              {/* Required Docs Icons */}
              <div className="flex items-center gap-2">
                {unit.requiredDocs.map((doc) => (
                  <div
                    key={doc}
                    className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-muted-foreground"
                    title={doc}
                  >
                    {getDocIcon(doc)}
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}

        {filteredUnits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No units found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;

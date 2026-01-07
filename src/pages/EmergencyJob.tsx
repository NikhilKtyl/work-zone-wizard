import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Building2,
  Layers,
  Camera,
  Send,
  CheckCircle2,
  Plus,
  X,
  Navigation,
  Minus,
  Circle,
  Hash,
  FileText,
  AlertTriangle,
  CloudOff,
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
import { toast } from "sonner";
import { useOffline } from "@/hooks/useOffline";
import SyncStatus from "@/components/SyncStatus";

// Mock data
const mockCustomers = [
  { id: "1", name: "North Valley Farm", location: "Block A-12" },
  { id: "2", name: "Sunrise Orchards", location: "Section 4" },
  { id: "3", name: "Green Meadows", location: "Unit 7B" },
  { id: "4", name: "Highland Ranch", location: "Parcel 15" },
];

const unitTypes = [
  { id: "bore", name: "Bore (ft)", icon: "line" },
  { id: "trench", name: "Trench (ft)", icon: "line" },
  { id: "conduit", name: "Conduit (ft)", icon: "line" },
  { id: "handhole", name: "Handhole", icon: "marker" },
  { id: "pedestal", name: "Pedestal", icon: "marker" },
  { id: "vault", name: "Vault", icon: "marker" },
];

interface Drawing {
  id: string;
  type: "line" | "marker";
  position: { x: number; y: number };
  unitType?: string;
  length?: string;
  quantity?: string;
  description?: string;
}

interface Photo {
  id: string;
  url: string;
  timestamp: string;
}

const EmergencyJob = () => {
  const navigate = useNavigate();
  const { isOnline, addToSyncQueue } = useOffline();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [drawingMode, setDrawingMode] = useState<"line" | "marker" | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [sequentialNumbers, setSequentialNumbers] = useState<string[]>([]);
  const [newSequential, setNewSequential] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: "Customer", icon: Building2 },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Units", icon: Layers },
    { number: 4, title: "Docs", icon: Camera },
    { number: 5, title: "Submit", icon: Send },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedCustomer;
      case 2:
        return drawings.length > 0;
      case 3:
        return drawings.every((d) => d.unitType && (d.type === "marker" ? d.quantity : d.length));
      case 4:
        return true; // Photos optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newDrawing: Drawing = {
      id: Date.now().toString(),
      type: drawingMode,
      position: { x, y },
    };

    setDrawings([...drawings, newDrawing]);
    setDrawingMode(null);
  };

  const removeDrawing = (id: string) => {
    setDrawings(drawings.filter((d) => d.id !== id));
  };

  const updateDrawing = (id: string, updates: Partial<Drawing>) => {
    setDrawings(drawings.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const handleAddPhoto = () => {
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const newPhoto = { id: Date.now().toString(), url: "/placeholder.svg", timestamp: now };
    setPhotos([...photos, newPhoto]);
    toast.success("Photo captured!");
  };

  const handleCaptureGPS = () => {
    // Simulate GPS capture
    setGpsData({
      lat: 37.7749 + Math.random() * 0.01,
      lng: -122.4194 + Math.random() * 0.01,
      accuracy: 3.5,
    });
    toast.success("GPS location captured!");
  };

  const handleAddSequential = () => {
    if (newSequential.trim()) {
      setSequentialNumbers([...sequentialNumbers, newSequential.trim()]);
      setNewSequential("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const emergencyJobData = {
      customer: selectedCustomer,
      drawings,
      photos,
      gpsData,
      sequentialNumbers,
      timestamp: new Date().toISOString(),
    };
    
    if (!isOnline) {
      // Queue for sync when offline
      addToSyncQueue('emergency_job', emergencyJobData);
      setIsSubmitting(false);
      toast.success("Emergency job saved offline!", {
        description: "Will submit when connection returns",
      });
      navigate("/dashboard");
      return;
    }
    
    // Simulate API call when online
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("Emergency job submitted!", {
      description: "Pending office validation",
    });
    navigate("/dashboard");
  };

  const selectedCustomerData = mockCustomers.find((c) => c.id === selectedCustomer);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h1 className="text-lg font-bold text-foreground">Emergency Job</h1>
            </div>
            <p className="text-xs text-muted-foreground">Step {currentStep} of 5</p>
          </div>
          <SyncStatus compact />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.number
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-1 ${
                    currentStep > step.number ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-24">
        {/* Step 1: Customer Selection */}
        {currentStep === 1 && (
          <div className="p-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">Select Customer</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Choose the customer for this emergency job
            </p>

            <div className="space-y-3">
              {mockCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedCustomer === customer.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedCustomer === customer.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.location}</p>
                    </div>
                    {selectedCustomer === customer.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Location/Map */}
        {currentStep === 2 && (
          <div className="p-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">Mark Location</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tap the map to add lines or markers for units
            </p>

            {/* Drawing Tools */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setDrawingMode(drawingMode === "line" ? null : "line")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  drawingMode === "line"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <Minus className="w-5 h-5" />
                <span className="font-medium">Line</span>
              </button>
              <button
                onClick={() => setDrawingMode(drawingMode === "marker" ? null : "marker")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  drawingMode === "marker"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <Circle className="w-5 h-5" />
                <span className="font-medium">Marker</span>
              </button>
            </div>

            {drawingMode && (
              <p className="text-sm text-primary text-center mb-4 animate-pulse">
                Tap on the map to place a {drawingMode}
              </p>
            )}

            {/* Mock Map */}
            <div
              onClick={handleMapClick}
              className="relative w-full h-64 bg-gradient-to-br from-[#e8f4e8] via-[#f0f7f0] to-[#e5f0e5] rounded-xl border border-border overflow-hidden cursor-crosshair"
            >
              {/* Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="emGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#emGrid)" />
                </svg>
              </div>

              {/* Customer Label */}
              {selectedCustomerData && (
                <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-foreground shadow-sm">
                  {selectedCustomerData.name}
                </div>
              )}

              {/* Drawings */}
              {drawings.map((drawing) => (
                <div
                  key={drawing.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${drawing.position.x}%`, top: `${drawing.position.y}%` }}
                >
                  {drawing.type === "line" ? (
                    <div className="w-12 h-1 bg-primary rounded-full shadow-lg" />
                  ) : (
                    <div className="w-6 h-6 bg-destructive rounded-full border-2 border-white shadow-lg" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDrawing(drawing.id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {drawings.length === 0 && !drawingMode && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Select a tool above, then tap to draw</p>
                </div>
              )}
            </div>

            {/* Drawings List */}
            {drawings.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {drawings.length} item{drawings.length !== 1 ? "s" : ""} added
                </p>
                <div className="flex flex-wrap gap-2">
                  {drawings.map((drawing, idx) => (
                    <div
                      key={drawing.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border"
                    >
                      {drawing.type === "line" ? (
                        <Minus className="w-4 h-4 text-primary" />
                      ) : (
                        <Circle className="w-4 h-4 text-destructive" />
                      )}
                      <span className="text-sm text-foreground">
                        {drawing.type === "line" ? "Line" : "Marker"} {idx + 1}
                      </span>
                      <button
                        onClick={() => removeDrawing(drawing.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Units */}
        {currentStep === 3 && (
          <div className="p-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">Define Units</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Specify unit type and details for each marked location
            </p>

            <div className="space-y-4">
              {drawings.map((drawing, idx) => (
                <div
                  key={drawing.id}
                  className="bg-card rounded-xl p-4 border border-border shadow-card"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {drawing.type === "line" ? (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Minus className="w-4 h-4 text-primary" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Circle className="w-4 h-4 text-destructive" />
                      </div>
                    )}
                    <span className="font-medium text-foreground">
                      {drawing.type === "line" ? "Line" : "Marker"} {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Unit Type *
                      </label>
                      <Select
                        value={drawing.unitType || ""}
                        onValueChange={(value) => updateDrawing(drawing.id, { unitType: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select unit type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {unitTypes
                            .filter((ut) =>
                              drawing.type === "line"
                                ? ut.icon === "line"
                                : ut.icon === "marker"
                            )
                            .map((ut) => (
                              <SelectItem key={ut.id} value={ut.id}>
                                {ut.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {drawing.type === "line" ? (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">
                          Approximate Length (ft) *
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 150"
                          value={drawing.length || ""}
                          onChange={(e) => updateDrawing(drawing.id, { length: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">
                          Quantity *
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 1"
                          value={drawing.quantity || ""}
                          onChange={(e) => updateDrawing(drawing.id, { quantity: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Description
                      </label>
                      <Textarea
                        placeholder="Brief description..."
                        value={drawing.description || ""}
                        onChange={(e) => updateDrawing(drawing.id, { description: e.target.value })}
                        className="rounded-xl resize-none min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Documentation */}
        {currentStep === 4 && (
          <div className="p-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">Documentation</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Capture photos and location data (optional)
            </p>

            {/* Photos */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-card mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Photos</span>
                </div>
                <span className="text-sm text-muted-foreground">{photos.length} captured</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt="Captured"
                      className="w-20 h-20 rounded-lg object-cover bg-secondary"
                    />
                    <button
                      onClick={() => setPhotos(photos.filter((p) => p.id !== photo.id))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddPhoto}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs mt-1">Add</span>
                </button>
              </div>
            </div>

            {/* GPS */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-card mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">GPS Location</p>
                    {gpsData ? (
                      <p className="text-xs text-muted-foreground">
                        {gpsData.lat.toFixed(6)}, {gpsData.lng.toFixed(6)} (±{gpsData.accuracy}m)
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not captured</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={gpsData ? "outline" : "default"}
                  onClick={handleCaptureGPS}
                  className="rounded-lg"
                >
                  {gpsData ? "Recapture" : "Capture"}
                </Button>
              </div>
            </div>

            {/* Sequential Numbers */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Sequential Numbers</span>
              </div>

              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Enter number..."
                  value={newSequential}
                  onChange={(e) => setNewSequential(e.target.value)}
                  className="h-10 rounded-lg flex-1"
                />
                <Button onClick={handleAddSequential} size="sm" className="rounded-lg px-4">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {sequentialNumbers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sequentialNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg"
                    >
                      <span className="font-mono text-sm text-foreground">{num}</span>
                      <button
                        onClick={() =>
                          setSequentialNumbers(sequentialNumbers.filter((_, i) => i !== idx))
                        }
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="p-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">Review & Submit</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Verify the details before submitting
            </p>

            {/* Summary */}
            <div className="space-y-4">
              {/* Customer */}
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer</span>
                </div>
                <p className="font-semibold text-foreground">{selectedCustomerData?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomerData?.location}</p>
              </div>

              {/* Units */}
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Layers className="w-4 h-4" />
                  <span className="text-sm font-medium">Units ({drawings.length})</span>
                </div>
                <div className="space-y-2">
                  {drawings.map((drawing, idx) => {
                    const unitType = unitTypes.find((ut) => ut.id === drawing.unitType);
                    return (
                      <div
                        key={drawing.id}
                        className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {drawing.type === "line" ? (
                            <Minus className="w-4 h-4 text-primary" />
                          ) : (
                            <Circle className="w-4 h-4 text-destructive" />
                          )}
                          <span className="text-sm text-foreground">{unitType?.name || "Unit"}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {drawing.type === "line" ? `${drawing.length} ft` : `x${drawing.quantity}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation */}
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Documentation</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{photos.length}</p>
                    <p className="text-xs text-muted-foreground">Photos</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{gpsData ? "✓" : "-"}</p>
                    <p className="text-xs text-muted-foreground">GPS</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{sequentialNumbers.length}</p>
                    <p className="text-xs text-muted-foreground">Sequential</p>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Office Validation Required</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This emergency job will be submitted for office review and approval before
                      work can proceed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-safe-bottom z-20">
        <div className="flex gap-3 max-w-md mx-auto">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 h-12 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          {currentStep < 5 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Validation
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyJob;

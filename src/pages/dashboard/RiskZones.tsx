import React, { useState } from 'react';
import { AlertTriangle, MapPin, Cloud, Construction, TrendingUp, Filter, Plus, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface RiskZone {
  id: string;
  name: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  reports: number;
  lastReported: string;
  location: { x: number; y: number };
}

const initialRiskZones: RiskZone[] = [
  { id: '1', name: 'Highway 101 Curve', type: 'accident', severity: 'high', description: 'Frequent accidents due to sharp curve', reports: 45, lastReported: '2 hours ago', location: { x: 30, y: 25 } },
  { id: '2', name: 'Main Street Intersection', type: 'accident', severity: 'high', description: 'High collision rate intersection', reports: 38, lastReported: '1 day ago', location: { x: 55, y: 45 } },
  { id: '3', name: 'Oak Bridge', type: 'road_condition', severity: 'medium', description: 'Pothole and road damage reported', reports: 22, lastReported: '5 hours ago', location: { x: 70, y: 35 } },
  { id: '4', name: 'Coastal Highway', type: 'weather', severity: 'medium', description: 'Frequent fog and low visibility', reports: 18, lastReported: '3 hours ago', location: { x: 20, y: 60 } },
  { id: '5', name: 'Downtown Tunnel', type: 'construction', severity: 'low', description: 'Ongoing construction work', reports: 12, lastReported: '1 week ago', location: { x: 45, y: 70 } },
  { id: '6', name: 'Industrial Park Road', type: 'road_condition', severity: 'high', description: 'Severe road deterioration', reports: 32, lastReported: '4 hours ago', location: { x: 80, y: 55 } },
];

const RiskZones: React.FC = () => {
  const [riskZones, setRiskZones] = useState<RiskZone[]>(initialRiskZones);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // New Report State
  const [newReportType, setNewReportType] = useState("accident");
  const [newReportSeverity, setNewReportSeverity] = useState("medium");
  const [newReportDesc, setNewReportDesc] = useState("");
  const [newReportLocation, setNewReportLocation] = useState("");

  const handleReportSubmit = () => {
    if (!newReportDesc || !newReportLocation) {
      toast.error("Please fill in all fields");
      return;
    }

    const newZone: RiskZone = {
      id: `new-${Date.now()}`,
      name: newReportLocation,
      type: newReportType,
      severity: newReportSeverity as 'low' | 'medium' | 'high',
      description: newReportDesc,
      reports: 1,
      lastReported: 'Just now',
      location: {
        x: Math.random() * 80 + 10, // Random position for demo
        y: Math.random() * 80 + 10
      }
    };

    setRiskZones([newZone, ...riskZones]);
    setIsReportOpen(false);
    setNewReportDesc("");
    setNewReportLocation("");
    toast.success("Risk report submitted successfully");
  };

  const handleVerify = (id: string) => {
    setRiskZones(current => current.map(z => {
      if (z.id === id) {
        return { ...z, reports: z.reports + 1, lastReported: 'Just now' };
      }
      return z;
    }));
    toast.success("Report verified. Thank you for your contribution.");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="w-4 h-4" />;
      case 'road_condition':
        return <Construction className="w-4 h-4" />;
      case 'weather':
        return <Cloud className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-destructive';
      case 'medium':
        return 'border-warning';
      default:
        return 'border-success';
    }
  };

  const filteredZones = riskZones.filter(
    (zone) => selectedSeverity === 'all' || zone.severity === selectedSeverity
  );

  const highCount = riskZones.filter(z => z.severity === 'high').length;
  const mediumCount = riskZones.filter(z => z.severity === 'medium').length;
  const lowCount = riskZones.filter(z => z.severity === 'low').length;

  const currentZone = riskZones.find(z => z.id === selectedZone);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Risk Zones</h1>
          <p className="text-muted-foreground mt-1">Identify and avoid high-risk areas</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedSeverity === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('all')}
            className="flex-1 sm:flex-none"
          >
            All ({riskZones.length})
          </Button>
          <Button
            variant={selectedSeverity === 'high' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('high')}
            className="flex-1 sm:flex-none"
          >
            High ({highCount})
          </Button>
          <Button
            variant={selectedSeverity === 'medium' ? 'warning' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('medium')}
            className="flex-1 sm:flex-none"
          >
            Medium ({mediumCount})
          </Button>
          <Button
            variant={selectedSeverity === 'low' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('low')}
            className="flex-1 sm:flex-none"
          >
            Low ({lowCount})
          </Button>

          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto gap-2">
                <Plus className="w-4 h-4" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report New Risk Zone</DialogTitle>
                <DialogDescription>
                  Help the community by reporting a new hazard or risk area.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Input
                    id="location"
                    placeholder="e.g., I-95 North Exit 42"
                    value={newReportLocation}
                    onChange={(e) => setNewReportLocation(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Hazard Type</Label>
                    <Select value={newReportType} onValueChange={setNewReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident">Accident Prone</SelectItem>
                        <SelectItem value="road_condition">Road Damage</SelectItem>
                        <SelectItem value="weather">Weather Hazard</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={newReportSeverity} onValueChange={setNewReportSeverity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the hazard..."
                    value={newReportDesc}
                    onChange={(e) => setNewReportDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReportOpen(false)}>Cancel</Button>
                <Button onClick={handleReportSubmit}>Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-destructive/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highCount}</p>
              <p className="text-xs text-muted-foreground">High Risk Zones</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
              <Construction className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{riskZones.filter(z => z.type === 'road_condition' || z.type === 'construction').length}</p>
              <p className="text-xs text-muted-foreground">Road Issues</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/20 rounded-xl flex items-center justify-center">
              <Cloud className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{riskZones.filter(z => z.type === 'weather').length}</p>
              <p className="text-xs text-muted-foreground">Weather Alerts</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{riskZones.reduce((acc, curr) => acc + curr.reports, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6 min-h-[400px] sm:h-[500px] flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Risk Zone Map</h3>

            <div className="relative w-full flex-1 bg-card-secondary rounded-xl overflow-hidden min-h-[300px]">
              {/* Grid */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="risk-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#risk-grid)" />
                </svg>
              </div>

              {/* Risk Zone Markers */}
              {filteredZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 hover:z-20"
                  style={{ left: `${zone.location.x}%`, top: `${zone.location.y}%` }}
                >
                  {/* Pulse Ring */}
                  {selectedZone === zone.id && (
                    <div className={cn(
                      "absolute inset-0 w-8 h-8 rounded-full animate-ping opacity-75",
                      zone.severity === 'high' && "bg-destructive",
                      zone.severity === 'medium' && "bg-warning",
                      zone.severity === 'low' && "bg-success"
                    )} />
                  )}

                  {/* Marker */}
                  <div className={cn(
                    "relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                    getSeverityColor(zone.severity),
                    selectedZone === zone.id && "ring-4 ring-background"
                  )}>
                    {getIcon(zone.type)}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-elevated z-10 pointer-events-none">
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-muted-foreground">{zone.reports} reports</p>
                  </div>
                </button>
              ))}

              {/* Selected Zone Info Overlay */}
              {currentZone && (
                <div className="absolute bottom-4 left-4 right-4 animate-slide-up">
                  <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {currentZone.name}
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider", getSeverityColor(currentZone.severity))}>
                          {currentZone.severity}
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground">{currentZone.description}</p>
                    </div>
                    <Button size="sm" onClick={() => handleVerify(currentZone.id)} className="gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Verify
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zone List */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 h-[500px] overflow-hidden flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Zone Details</h3>

            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
              {filteredZones.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No risk zones match the selected filter.
                </div>
              ) : (
                filteredZones.map((zone, index) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200 animate-slide-up border-2",
                      selectedZone === zone.id
                        ? cn("bg-card-secondary", getSeverityBorder(zone.severity))
                        : "bg-card-secondary border-transparent hover:border-border"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        getSeverityColor(zone.severity)
                      )}>
                        {getIcon(zone.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{zone.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{zone.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{zone.reports} reports</span>
                          <span className="text-xs text-muted-foreground">{zone.lastReported}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskZones;

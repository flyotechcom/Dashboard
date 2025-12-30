import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Construction, Cloud, Filter, RefreshCw, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TrafficIncident {
  id: string;
  type: 'congestion' | 'accident' | 'construction' | 'weather';
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  delay: string;
  updatedAt: string;
  coords: { x: number; y: number };
}

const initialIncidents: TrafficIncident[] = [
  { id: '1', type: 'accident', title: 'Vehicle Collision', location: 'Highway 101 North, Mile 45', severity: 'high', delay: '+25 min', updatedAt: '2 min ago', coords: { x: 30, y: 40 } },
  { id: '2', type: 'congestion', title: 'Heavy Traffic', location: 'Downtown Main Street', severity: 'high', delay: '+18 min', updatedAt: '5 min ago', coords: { x: 50, y: 50 } },
  { id: '3', type: 'construction', title: 'Road Work', location: 'Oak Avenue Bridge', severity: 'medium', delay: '+12 min', updatedAt: '1 hour ago', coords: { x: 70, y: 30 } },
  { id: '4', type: 'weather', title: 'Low Visibility', location: 'Coastal Highway', severity: 'medium', delay: '+8 min', updatedAt: '30 min ago', coords: { x: 20, y: 70 } },
  { id: '5', type: 'congestion', title: 'Moderate Traffic', location: 'Interstate 280 South', severity: 'low', delay: '+5 min', updatedAt: '15 min ago', coords: { x: 60, y: 80 } },
];

const filterOptions = ['All', 'Congestion', 'Accidents', 'Construction', 'Weather'];

const LiveTraffic: React.FC = () => {
  const [incidents, setIncidents] = useState<TrafficIncident[]>(initialIncidents);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data update
    setTimeout(() => {
      const updatedIncidents = incidents.map(inc => ({
        ...inc,
        delay: `+${Math.floor(Math.random() * 30 + 5)} min`,
        updatedAt: 'Just now'
      }));
      setIncidents(updatedIncidents);
      setIsRefreshing(false);
      toast.success("Traffic data updated successfully");
    }, 1500);
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="w-4 h-4" />;
      case 'construction':
        return <Construction className="w-4 h-4" />;
      case 'weather':
        return <Cloud className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-success/20 text-success border-success/30';
    }
  };

  const filteredIncidents = incidents.filter(
    (incident) => activeFilter === 'All' || incident.type.toLowerCase() === activeFilter.toLowerCase().slice(0, -1)
  );

  const activeIncident = incidents.find(i => i.id === activeIncidentId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Live Traffic</h1>
          <p className="text-muted-foreground mt-1">Real-time traffic conditions and incidents</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none">
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Updating..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="flex-1 sm:flex-none"
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6 min-h-[400px] sm:h-[500px] flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Traffic Map</h3>
            <div className="relative w-full flex-1 bg-card-secondary rounded-xl overflow-hidden min-h-[300px]">
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="traffic-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#traffic-grid)" />
                </svg>
              </div>

              {/* Roads */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 10 50 Q 30 30, 50 50 T 90 50" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 50 10 L 50 90" stroke="hsl(var(--muted))" strokeWidth="3" fill="none" />
                <path d="M 20 20 L 80 80" stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
                <path d="M 80 20 L 20 80" stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
              </svg>

              {/* Traffic Flow Animation */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-success rounded-full animate-ping" />
              <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-warning rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-destructive rounded-full animate-ping" style={{ animationDelay: '1s' }} />

              {/* Markers */}
              {filteredIncidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setActiveIncidentId(incident.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 hover:z-20"
                  style={{ left: `${incident.coords.x}%`, top: `${incident.coords.y}%` }}
                >
                  {/* Pulse Ring */}
                  {activeIncidentId === incident.id && (
                    <div className={cn(
                      "absolute inset-0 w-8 h-8 rounded-full animate-ping opacity-75",
                      incident.severity === 'high' ? 'bg-destructive' : incident.severity === 'medium' ? 'bg-warning' : 'bg-primary'
                    )} />
                  )}

                  {/* Marker */}
                  <div className={cn(
                    "relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                    getSeverityStyle(incident.severity),
                    "bg-card border-none ring-2",
                    incident.severity === 'high' ? 'ring-destructive' : incident.severity === 'medium' ? 'ring-warning' : 'ring-success',
                    activeIncidentId === incident.id && "scale-110"
                  )}>
                    {getIncidentIcon(incident.type)}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-elevated z-10 pointer-events-none">
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-muted-foreground">{incident.delay}</p>
                  </div>
                </button>
              ))}

              {activeIncident && (
                <div className="absolute bottom-4 left-4 right-4 animate-slide-up">
                  <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {activeIncident.title}
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border", getSeverityStyle(activeIncident.severity))}>
                          {activeIncident.severity}
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground">{activeIncident.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-destructive">{activeIncident.delay}</p>
                      <p className="text-xs text-muted-foreground">Delay</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Incidents List */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 h-[400px] sm:h-[500px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Active Incidents</h3>
              <span className="text-sm text-muted-foreground">{filteredIncidents.length} total</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
              {filteredIncidents.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No traffic events found.
                </div>
              ) : (
                filteredIncidents.map((incident, index) => (
                  <div
                    key={incident.id}
                    onClick={() => setActiveIncidentId(incident.id)}
                    className={cn(
                      "p-4 rounded-xl transition-all duration-200 cursor-pointer animate-slide-up border-2",
                      activeIncidentId === incident.id
                        ? "bg-primary/5 border-primary"
                        : "bg-card-secondary border-transparent hover:border-border"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                        getSeverityStyle(incident.severity)
                      )}>
                        {getIncidentIcon(incident.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">{incident.title}</p>
                          {activeIncidentId === incident.id && <ChevronRight className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{incident.location}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-destructive">{incident.delay}</span>
                          <span className="text-xs text-muted-foreground">{incident.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-destructive">{incidents.filter(i => i.severity === 'high').length}</p>
          <p className="text-sm text-muted-foreground mt-1">High Severity</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-warning">{incidents.filter(i => i.severity === 'medium').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Medium Severity</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-success">{incidents.filter(i => i.severity === 'low').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Low Severity</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-primary">
            {incidents.reduce((acc, curr) => acc + parseInt(curr.delay.replace(/\D/g, '')), 0)} min
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Delay</p>
        </div>
      </div>
    </div>
  );
};

export default LiveTraffic;

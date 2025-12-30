import React from 'react';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';

interface TrafficPoint {
  id: string;
  x: number;
  y: number;
  type: 'congestion' | 'accident' | 'construction';
  severity: 'low' | 'medium' | 'high';
}

const trafficPoints: TrafficPoint[] = [
  { id: '1', x: 25, y: 30, type: 'congestion', severity: 'high' },
  { id: '2', x: 45, y: 55, type: 'accident', severity: 'medium' },
  { id: '3', x: 70, y: 25, type: 'congestion', severity: 'low' },
  { id: '4', x: 60, y: 70, type: 'construction', severity: 'medium' },
  { id: '5', x: 35, y: 75, type: 'congestion', severity: 'high' },
];

const TrafficMap: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="w-3 h-3" />;
      case 'construction':
        return <Navigation className="w-3 h-3" />;
      default:
        return <MapPin className="w-3 h-3" />;
    }
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Live Traffic Map</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 lg:h-80 bg-card-secondary rounded-xl overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 50 L 100 50" stroke="hsl(var(--muted))" strokeWidth="3" fill="none" />
          <path d="M 50 0 L 50 100" stroke="hsl(var(--muted))" strokeWidth="3" fill="none" />
          <path d="M 0 30 L 100 30" stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
          <path d="M 0 70 L 100 70" stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
          <path d="M 30 0 L 30 100" stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
          <path d="M 70 0 L 70 100" stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
        </svg>

        {/* Traffic Points */}
        {trafficPoints.map((point) => (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className={`w-6 h-6 rounded-full ${getSeverityColor(point.severity)} flex items-center justify-center text-background animate-pulse shadow-lg`}>
              {getIcon(point.type)}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <span className="capitalize font-medium">{point.type}</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="capitalize text-muted-foreground">{point.severity} severity</span>
            </div>
          </div>
        ))}

        {/* Current Location */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute" />
          <div className="w-4 h-4 bg-primary rounded-full relative shadow-glow" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center p-3 bg-card-secondary rounded-xl">
          <p className="text-2xl font-bold text-destructive">3</p>
          <p className="text-xs text-muted-foreground">High Risk Areas</p>
        </div>
        <div className="text-center p-3 bg-card-secondary rounded-xl">
          <p className="text-2xl font-bold text-warning">2</p>
          <p className="text-xs text-muted-foreground">Active Incidents</p>
        </div>
        <div className="text-center p-3 bg-card-secondary rounded-xl">
          <p className="text-2xl font-bold text-success">5</p>
          <p className="text-xs text-muted-foreground">Clear Routes</p>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;

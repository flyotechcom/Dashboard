import React, { useState } from 'react';
import { MapPin, Navigation, Clock, AlertTriangle, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RouteOption {
  id: string;
  name: string;
  distance: string;
  duration: string;
  delay: string;
  riskScore: number;
  isRecommended?: boolean;
  features: string[];
}

const routes: RouteOption[] = [
  {
    id: '1',
    name: 'AI Recommended Route',
    distance: '24.5 km',
    duration: '28 min',
    delay: '+0 min',
    riskScore: 15,
    isRecommended: true,
    features: ['Avoids congestion', 'Scenic route', 'Lower risk'],
  },
  {
    id: '2',
    name: 'Highway Route',
    distance: '22.1 km',
    duration: '35 min',
    delay: '+12 min',
    riskScore: 45,
    features: ['Fastest in clear traffic', 'Currently congested'],
  },
  {
    id: '3',
    name: 'Surface Streets',
    distance: '28.3 km',
    duration: '42 min',
    delay: '+5 min',
    riskScore: 25,
    features: ['Multiple stops', 'No highway driving'],
  },
];

const RouteOptimization: React.FC = () => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>('1');
  const [isCalculating, setIsCalculating] = useState(false);
  const [routesVisible, setRoutesVisible] = useState(false);

  const handleCalculate = () => {
    if (!startLocation || !destination) {
      toast.error('Please enter both start location and destination');
      return;
    }

    setIsCalculating(true);
    // Simulate API call
    setTimeout(() => {
      setIsCalculating(false);
      setRoutesVisible(true);
      setSelectedRoute('1');
      toast.success('Optimal routes identified');
    }, 1500);
  };

  const handleStartNavigation = () => {
    toast.success('Navigation started sent to driver app');
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-success';
    if (score <= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getRiskBg = (score: number) => {
    if (score <= 20) return 'bg-success/20';
    if (score <= 50) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  const currentRoute = routes.find(r => r.id === selectedRoute);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Route Optimization</h1>
        <p className="text-muted-foreground mt-1">AI-powered route planning with real-time traffic analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Input */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-lg mb-4">Plan Your Route</h3>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-success rounded-full" />
                <Input
                  placeholder="Start location (e.g. Warehouse A)"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex justify-center">
                <div className="w-px h-8 bg-border" />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
                <Input
                  placeholder="Destination (e.g. City Center)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Find Optimal Route
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Route Options */}
          {routesVisible && (
            <div className="glass-card p-6 animate-slide-up">
              <h3 className="font-semibold text-lg mb-4">Available Routes</h3>

              <div className="space-y-3">
                {routes.map((route, index) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200",
                      selectedRoute === route.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-card-secondary border-2 border-transparent hover:border-border"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {route.isRecommended && (
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
                            AI Pick
                          </span>
                        )}
                        <span className="font-medium text-sm">{route.name}</span>
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        selectedRoute === route.id && "rotate-90"
                      )} />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{route.distance}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.duration}
                      </span>
                      <span className={cn("font-medium", route.delay !== '+0 min' ? 'text-destructive' : 'text-success')}>
                        {route.delay}
                      </span>
                    </div>

                    {selectedRoute === route.id && (
                      <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className={cn("w-4 h-4", getRiskColor(route.riskScore))} />
                          <span className="text-sm">Risk Score: </span>
                          <span className={cn("font-bold", getRiskColor(route.riskScore))}>{route.riskScore}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {route.features.map((feature, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6 h-full min-h-[400px] sm:min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Route Preview</h3>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span className="text-xs text-muted-foreground">Start</span>
                <div className="w-3 h-3 bg-primary rounded-full ml-2" />
                <span className="text-xs text-muted-foreground">End</span>
              </div>
            </div>

            <div className="relative w-full flex-1 bg-card-secondary rounded-xl overflow-hidden min-h-[350px] sm:min-h-[500px]">
              {/* Grid */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="route-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#route-grid)" />
                </svg>
              </div>

              {/* Map Content - Only show when calculated */}
              {routesVisible ? (
                <>
                  {/* Route Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Route 3: Surface Streets */}
                    <path
                      d="M 15 80 Q 40 85, 60 60 T 85 20"
                      stroke={selectedRoute === '3' ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      strokeWidth={selectedRoute === '3' ? "4" : "2"}
                      fill="none"
                      strokeDasharray={selectedRoute === '3' ? "" : "5 5"}
                      opacity={selectedRoute === '3' ? "1" : "0.3"}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

                    {/* Route 2: Highway */}
                    <path
                      d="M 15 80 L 50 50 L 85 20"
                      stroke={selectedRoute === '2' ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      strokeWidth={selectedRoute === '2' ? "4" : "2"}
                      fill="none"
                      strokeDasharray={selectedRoute === '2' ? "" : "5 5"}
                      opacity={selectedRoute === '2' ? "1" : "0.3"}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

                    {/* Route 1: AI Recommended */}
                    <path
                      d="M 15 80 Q 25 60, 35 55 T 55 40 T 75 25 T 85 20"
                      stroke={selectedRoute === '1' ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      strokeWidth={selectedRoute === '1' ? "4" : "2"}
                      fill="none"
                      strokeDasharray={selectedRoute === '1' ? "" : "5 5"}
                      opacity={selectedRoute === '1' ? "1" : "0.3"}
                      strokeLinecap="round"
                      className={cn("transition-all duration-300", selectedRoute === '1' && "animate-pulse-slow")}
                    />
                  </svg>

                  {/* Start Point */}
                  <div className="absolute" style={{ left: '15%', bottom: '20%' }}>
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg animate-bounce-short">
                      <div className="w-2 h-2 bg-success-foreground rounded-full" />
                    </div>
                  </div>

                  {/* End Point */}
                  <div className="absolute" style={{ left: '85%', top: '20%' }}>
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-glow animate-bounce-short">
                      <MapPin className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Congestion Areas */}
                  <div className="absolute" style={{ left: '45%', top: '45%' }}>
                    <div className="w-16 h-16 bg-destructive/30 rounded-full blur-xl animate-pulse" />
                  </div>

                  {/* Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 animate-slide-up">
                    <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                            currentRoute?.isRecommended ? "bg-primary/20" : "bg-secondary")}>
                            <Navigation className={cn("w-5 h-5",
                              currentRoute?.isRecommended ? "text-primary" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <p className="font-semibold">{currentRoute?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {currentRoute?.distance} • {currentRoute?.duration} • Risk: {currentRoute?.riskScore}%
                            </p>
                          </div>
                        </div>
                        <Button size="sm" onClick={handleStartNavigation} className="w-full sm:w-auto">
                          Start Navigation
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                  <MapPin className="w-8 h-8 opacity-20" />
                  <p>Enter start and destination to view routes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;

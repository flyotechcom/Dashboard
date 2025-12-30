import React from 'react';
import { Activity, AlertTriangle, Navigation, Shield, Clock, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import TrafficMap from '@/components/dashboard/TrafficMap';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import TrafficChart from '@/components/dashboard/TrafficChart';
import QuickActions from '@/components/dashboard/QuickActions';
import { useAuth } from '@/contexts/AuthContext';

const Overview: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Driver'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your traffic intelligence overview
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Congestion"
          value="42%"
          change={-8}
          changeLabel="vs yesterday"
          icon={Activity}
          variant="primary"
        />
        <StatCard
          title="Active Alerts"
          value="7"
          change={2}
          changeLabel="new today"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Route Efficiency"
          value="94%"
          change={3}
          changeLabel="improvement"
          icon={Navigation}
          variant="success"
        />
        <StatCard
          title="Safety Score"
          value="87"
          change={5}
          changeLabel="this week"
          icon={Shield}
          variant="primary"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Map - Takes 2 columns */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <TrafficMap />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <ActivityFeed />
        </div>
      </div>

      {/* Traffic Chart - Full Width */}
      <div className="w-full overflow-hidden">
        <TrafficChart />
      </div>

      {/* AI Insights */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Traffic Prediction</h3>
            <p className="text-sm text-muted-foreground">Next 60 minutes forecast</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-card-secondary rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Highway 101</span>
              <span className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive rounded-full">Increasing</span>
            </div>
            <p className="text-2xl font-bold">+15%</p>
            <p className="text-xs text-muted-foreground mt-1">Expected congestion rise</p>
          </div>

          <div className="p-4 bg-card-secondary rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Downtown Core</span>
              <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">Decreasing</span>
            </div>
            <p className="text-2xl font-bold">-22%</p>
            <p className="text-xs text-muted-foreground mt-1">Expected congestion drop</p>
          </div>

          <div className="p-4 bg-card-secondary rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Best Departure</span>
              <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">Optimal</span>
            </div>
            <p className="text-2xl font-bold">4:45 PM</p>
            <p className="text-xs text-muted-foreground mt-1">Recommended leave time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

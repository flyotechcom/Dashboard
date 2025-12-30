import React from 'react';
import { AlertTriangle, Navigation, MapPin, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'alert' | 'route' | 'location' | 'safety';
  title: string;
  description: string;
  time: string;
  severity?: 'low' | 'medium' | 'high';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Traffic Alert',
    description: 'Heavy congestion detected on Highway 101 North',
    time: '2 min ago',
    severity: 'high',
  },
  {
    id: '2',
    type: 'route',
    title: 'Route Updated',
    description: 'New optimal route found - saves 12 minutes',
    time: '15 min ago',
  },
  {
    id: '3',
    type: 'safety',
    title: 'Safety Score Improved',
    description: 'Your driving safety score increased to 94',
    time: '1 hour ago',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Accident Reported',
    description: 'Minor accident on Main Street - expect delays',
    time: '2 hours ago',
    severity: 'medium',
  },
  {
    id: '5',
    type: 'location',
    title: 'Destination Reached',
    description: 'Successfully arrived at Downtown Office',
    time: '3 hours ago',
  },
];

const ActivityFeed: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return AlertTriangle;
      case 'route':
        return Navigation;
      case 'location':
        return MapPin;
      case 'safety':
        return Shield;
      default:
        return Clock;
    }
  };

  const getIconStyle = (type: string, severity?: string) => {
    if (type === 'alert') {
      switch (severity) {
        case 'high':
          return 'bg-destructive/20 text-destructive';
        case 'medium':
          return 'bg-warning/20 text-warning';
        default:
          return 'bg-info/20 text-info';
      }
    }
    
    switch (type) {
      case 'route':
        return 'bg-primary/20 text-primary';
      case 'safety':
        return 'bg-success/20 text-success';
      case 'location':
        return 'bg-info/20 text-info';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          
          return (
            <div 
              key={activity.id} 
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer animate-slide-up",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                getIconStyle(activity.type, activity.severity)
              )}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;

import React from 'react';
import { Navigation, AlertTriangle, Map, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/dashboard/routes">
          <Button variant="glass" className="w-full h-auto flex-col gap-2 py-4">
            <Navigation className="w-5 h-5 text-primary" />
            <span className="text-xs">New Route</span>
          </Button>
        </Link>
        
        <Link to="/dashboard/alerts">
          <Button variant="glass" className="w-full h-auto flex-col gap-2 py-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="text-xs">Report Issue</span>
          </Button>
        </Link>
        
        <Link to="/dashboard/traffic">
          <Button variant="glass" className="w-full h-auto flex-col gap-2 py-4">
            <Map className="w-5 h-5 text-info" />
            <span className="text-xs">Live Map</span>
          </Button>
        </Link>
        
        <Link to="/dashboard/reports">
          <Button variant="glass" className="w-full h-auto flex-col gap-2 py-4">
            <FileText className="w-5 h-5 text-success" />
            <span className="text-xs">Reports</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;

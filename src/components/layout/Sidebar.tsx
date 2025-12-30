import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Route,
  AlertTriangle,
  Bell,
  BarChart3,
  Truck,
  FileText,
  Settings,
  LogOut,
  Car,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Map, label: 'Live Traffic', path: '/dashboard/traffic' },
  { icon: Route, label: 'Route Optimization', path: '/dashboard/routes' },
  { icon: AlertTriangle, label: 'Risk Zones', path: '/dashboard/risks' },
  { icon: Bell, label: 'Alerts', path: '/dashboard/alerts' },
  { icon: BarChart3, label: 'Driver Analytics', path: '/dashboard/analytics' },
];

const secondaryNavItems = [
  { icon: Truck, label: 'Fleet Management', path: '/dashboard/fleet', fleetOnly: true },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const showFleetItems = user?.accountType === 'fleet' || user?.accountType === 'enterprise';

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-sidebar-border relative">
        <Link to="/dashboard" className="flex items-center justify-center">
          <img
            src="/Main Logo.svg"
            alt="FlyoTech"
            className={cn(
              "h-10 w-auto flex-shrink-0 transition-all duration-300",
              isCollapsed ? "h-11" : "h-10"
            )}
          />
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hidden lg:flex absolute right-2 text-muted-foreground hover:text-foreground h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
              Main Menu
            </p>
          )}

          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item",
                isActive(item.path) && "nav-item-active",
                isCollapsed && "justify-center px-3"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
              Management
            </p>
          )}

          {secondaryNavItems.map((item) => {
            if (item.fleetOnly && !showFleetItems) return null;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-item",
                  isActive(item.path) && "nav-item-active",
                  isCollapsed && "justify-center px-3"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            "nav-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center px-3"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Route, AlertTriangle, Bell, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Map, label: 'Traffic', path: '/dashboard/traffic' },
  { icon: Route, label: 'Routes', path: '/dashboard/routes' },
  { icon: AlertTriangle, label: 'Risks', path: '/dashboard/risks' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
];

const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-secondary border-t border-border z-50">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "mobile-nav-item flex-1",
              isActive(item.path) && "mobile-nav-item-active"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              isActive(item.path) && "text-primary"
            )} />
            <span className={cn(
              isActive(item.path) && "text-primary font-medium"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;

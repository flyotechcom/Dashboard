import React, { useState } from 'react';
import { Search, Bell, Menu, Radio, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Traffic Alert', message: 'Heavy congestion on Highway 101', time: '2 min ago', type: 'warning' },
    { id: 2, title: 'Route Updated', message: 'New optimal route available', time: '15 min ago', type: 'info' },
    { id: 3, title: 'Safety Alert', message: 'Accident reported on Main St', time: '1 hour ago', type: 'danger' },
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-16 bg-background-secondary border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search routes, locations..."
            className="w-80 pl-10 h-10 bg-card/50"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
          <Radio className="w-3.5 h-3.5 text-success animate-pulse" />
          <span className="text-xs font-medium text-success">Live Data Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          </Button>

          {isNotificationsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsNotificationsOpen(false)} 
              />
              <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          notification.type === 'warning' && "bg-warning",
                          notification.type === 'info' && "bg-info",
                          notification.type === 'danger' && "bg-destructive"
                        )} />
                        <div>
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-primary">
                    View all notifications
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-primary font-semibold">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-tight">{user?.fullName || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.accountType || 'Account'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              <div className="absolute right-0 top-14 w-56 bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-border">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Globe, LogOut, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showPassword, setShowPassword] = useState(false);
  
  const [notifications, setNotifications] = useState({
    trafficAlerts: true,
    safetyAlerts: true,
    routeUpdates: true,
    weeklyReport: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleLogoutAll = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out from all devices.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              
              <hr className="my-2 border-border" />
              
              <button
                onClick={handleLogoutAll}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout All Devices</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Profile Settings</h2>
                  <p className="text-sm text-muted-foreground">Update your personal information</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Account Type
                  </label>
                  <div className="p-4 bg-card-secondary rounded-xl">
                    <p className="font-medium capitalize">{user?.accountType || 'Individual'}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contact support to change your account type
                    </p>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Security Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage your password and security</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      New Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose what notifications you receive</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div 
                      key={key}
                      className="flex items-center justify-between p-4 bg-card-secondary rounded-xl"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Privacy Settings</h2>
                  <p className="text-sm text-muted-foreground">Control your data and privacy</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Location Tracking</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Allow app to track your location for better routes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Driving Data Collection</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Collect driving patterns to improve safety score
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Share Anonymous Data</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Help improve traffic predictions with anonymous data
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" size="sm" className="mt-3">
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Language & Region</h2>
                  <p className="text-sm text-muted-foreground">Set your preferred language and region</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Language
                    </label>
                    <select className="w-full h-11 px-4 bg-card/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="en">English (US)</option>
                      <option value="en-gb">English (UK)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Distance Unit
                    </label>
                    <select className="w-full h-11 px-4 bg-card/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="km">Kilometers</option>
                      <option value="mi">Miles</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Time Format
                    </label>
                    <select className="w-full h-11 px-4 bg-card/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="12h">12-hour</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

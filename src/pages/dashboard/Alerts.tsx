import React, { useState } from 'react';
import { Bell, AlertTriangle, MapPin, Clock, CheckCircle, X, Filter, Shield, RefreshCw, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Alert {
  id: string;
  type: 'traffic' | 'enforcement' | 'weather' | 'safety';
  title: string;
  message: string;
  location: string;
  time: string;
  severity: 'info' | 'warning' | 'critical';
  isRead: boolean;
  isVerified: boolean;
}

const initialAlerts: Alert[] = [
  { id: '1', type: 'traffic', title: 'Heavy Congestion', message: 'Major backup on Highway 101 due to accident', location: 'Highway 101, Exit 42', time: '5 min ago', severity: 'critical', isRead: false, isVerified: true },
  { id: '2', type: 'enforcement', title: 'Speed Camera Ahead', message: 'Active speed enforcement zone', location: 'Main Street & Oak Ave', time: '15 min ago', severity: 'warning', isRead: false, isVerified: true },
  { id: '3', type: 'weather', title: 'Fog Advisory', message: 'Low visibility conditions expected', location: 'Coastal Highway', time: '30 min ago', severity: 'warning', isRead: true, isVerified: false },
  { id: '4', type: 'safety', title: 'Road Hazard', message: 'Debris reported on roadway', location: 'Interstate 280', time: '1 hour ago', severity: 'warning', isRead: true, isVerified: true },
  { id: '5', type: 'traffic', title: 'Lane Closure', message: 'Right lane closed for construction', location: 'Downtown Bridge', time: '2 hours ago', severity: 'info', isRead: true, isVerified: true },
  { id: '6', type: 'enforcement', title: 'Police Activity', message: 'Traffic stop in progress', location: 'Park Avenue', time: '3 hours ago', severity: 'info', isRead: true, isVerified: false },
];

const AlertsList: React.FC = () => {
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // New Alert State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<string>("traffic");
  const [newSeverity, setNewSeverity] = useState<string>("warning");
  const [newLocation, setNewLocation] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/30' };
      case 'warning':
        return { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30' };
      default:
        return { bg: 'bg-info/20', text: 'text-info', border: 'border-info/30' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <AlertTriangle className="w-5 h-5" />;
      case 'enforcement':
        return <Shield className="w-5 h-5" />;
      case 'weather':
        return <Clock className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Checking for new alerts...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Alerts list is up to date");
    }, 1500);
  };

  const markAsRead = (id: string) => {
    setAlertList(prev => prev.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlertList(prev => prev.filter(alert => alert.id !== id));
    toast.success("Alert dismissed");
  };

  const markAllAsRead = () => {
    setAlertList(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast.success("All alerts marked as read");
  };

  const clearAllAlerts = () => {
    setAlertList([]);
    toast.success("All alerts cleared");
  };

  const handleSubmitReport = () => {
    if (!newTitle || !newLocation || !newMessage) {
      toast.error("Please fill in all fields");
      return;
    }

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      type: newType as any,
      title: newTitle,
      message: newMessage,
      location: newLocation,
      time: 'Just now',
      severity: newSeverity as any,
      isRead: false,
      isVerified: false
    };

    setAlertList([newAlert, ...alertList]);
    setIsReportOpen(false);
    setNewTitle("");
    setNewLocation("");
    setNewMessage("");
    toast.success("Your report has been submitted to the community");
  };

  const filteredAlerts = alertList.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.isRead;
    return alert.type === filter;
  });

  const unreadCount = alertList.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground mt-1">
            Real-time traffic and safety notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-destructive/20 text-destructive text-xs rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none">
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="flex-1 sm:flex-none">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark all read
          </Button>

          <Button variant="outline" size="sm" onClick={clearAllAlerts} disabled={alertList.length === 0} className="flex-1 sm:flex-none hover:text-destructive hover:border-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>

          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto gap-2">
                <Plus className="w-4 h-4" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report Traffic Incident</DialogTitle>
                <DialogDescription>
                  Share real-time updates with other drivers in your area.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Issue Summary</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Stalled Vehicle"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="enforcement">Enforcement</SelectItem>
                        <SelectItem value="weather">Weather</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Severity</Label>
                    <Select value={newSeverity} onValueChange={setNewSeverity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Exact Location</Label>
                  <Input
                    id="location"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g., Near Main St Bridge"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Details</Label>
                  <Textarea
                    id="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Describe what you see..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReportOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitReport}>Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'unread', 'traffic', 'enforcement', 'weather', 'safety'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize flex-1 sm:flex-none"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-destructive">{alertList.filter(a => a.severity === 'critical').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Critical</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-warning">{alertList.filter(a => a.severity === 'warning').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Warnings</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-info">{alertList.filter(a => a.severity === 'info').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Info</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-success">{alertList.filter(a => a.isVerified).length}</p>
          <p className="text-sm text-muted-foreground mt-1">Verified</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No alerts</p>
            <p className="text-muted-foreground text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                onClick={() => markAsRead(alert.id)}
                className={cn(
                  "glass-card p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01] animate-slide-up",
                  !alert.isRead && "border-l-4",
                  !alert.isRead && style.border
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    style.bg, style.text
                  )}>
                    {getTypeIcon(alert.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={cn("font-semibold", !alert.isRead && "text-foreground")}>
                            {alert.title}
                          </p>
                          {alert.isVerified && (
                            <span className="px-1.5 py-0.5 bg-success/20 text-success text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                          {!alert.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissAlert(alert.id);
                        }}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full capitalize",
                        style.bg, style.text
                      )}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsList;

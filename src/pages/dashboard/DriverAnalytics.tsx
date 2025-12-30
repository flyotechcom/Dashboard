import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Shield, Zap, AlertTriangle, Clock, TrendingUp, TrendingDown, Award, Target, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface DataPoint {
  day?: string;
  time?: string;
  score?: number;
  trips?: number;
  speed?: number;
  limit?: number;
}

interface BehaviorPoint {
  name: string;
  value: number;
  color: string;
}

const DriverAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for all data
  const [overallScore, setOverallScore] = useState(87);
  const [scoreChange, setScoreChange] = useState(5);
  const [weeklyData, setWeeklyData] = useState<DataPoint[]>([
    { day: 'Mon', score: 85, trips: 4 },
    { day: 'Tue', score: 92, trips: 3 },
    { day: 'Wed', score: 78, trips: 5 },
    { day: 'Thu', score: 88, trips: 4 },
    { day: 'Fri', score: 91, trips: 6 },
    { day: 'Sat', score: 95, trips: 2 },
    { day: 'Sun', score: 89, trips: 1 },
  ]);
  const [speedData, setSpeedData] = useState<DataPoint[]>([
    { time: '6AM', speed: 45, limit: 55 },
    { time: '8AM', speed: 35, limit: 55 },
    { time: '10AM', speed: 52, limit: 55 },
    { time: '12PM', speed: 48, limit: 55 },
    { time: '2PM', speed: 55, limit: 55 },
    { time: '4PM', speed: 42, limit: 55 },
    { time: '6PM', speed: 38, limit: 55 },
  ]);
  const [behaviorData, setBehaviorData] = useState<BehaviorPoint[]>([
    { name: 'Smooth Driving', value: 65, color: 'hsl(142, 76%, 45%)' },
    { name: 'Moderate Braking', value: 25, color: 'hsl(45, 100%, 50%)' },
    { name: 'Harsh Events', value: 10, color: 'hsl(0, 84%, 60%)' },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Updating analytics data...");

    setTimeout(() => {
      // Simulate data changes
      setOverallScore(prev => Math.min(100, Math.max(70, prev + (Math.floor(Math.random() * 5) - 2))));
      setScoreChange(Math.floor(Math.random() * 10) - 5);

      setWeeklyData(prev => prev.map(d => ({
        ...d,
        score: Math.floor(Math.random() * 25) + 75
      })));

      setSpeedData(prev => prev.map(d => ({
        ...d,
        speed: Math.floor(Math.random() * 20) + 35
      })));

      setIsRefreshing(false);
      toast.success("Analytics updated");
    }, 1500);
  };

  const handleExport = () => {
    toast.success("Exporting data as CSV...");
    setTimeout(() => {
      toast.success("Download complete");
    }, 1000);
  };

  // Simulate range changes
  useEffect(() => {
    if (timeRange !== "week") {
      toast.info(`Fetching data for ${timeRange}...`);
      // In a real app, this would be an API call
      setOverallScore(Math.floor(Math.random() * 15) + 80);
    }
  }, [timeRange]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Driver Analytics</h1>
          <p className="text-muted-foreground mt-1">Your driving performance and safety insights</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none">
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 glass-card p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${overallScore * 2.83} 283`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{overallScore}</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>

            <h3 className="font-semibold text-lg">Safety Score</h3>
            <div className={cn(
              "inline-flex items-center gap-1 mt-2 text-sm",
              scoreChange >= 0 ? "text-success" : "text-destructive"
            )}>
              {scoreChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(scoreChange)} points this week
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 glass-card p-4 sm:p-6 overflow-hidden">
          <h3 className="font-semibold text-lg mb-4">Safety Trend</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="score" fill="rgb(249 115 22)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">Good</span>
          </div>
          <p className="text-2xl font-bold">94%</p>
          <p className="text-sm text-muted-foreground">Safe Driving Rate</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">Optimal</span>
          </div>
          <p className="text-2xl font-bold">47 mph</p>
          <p className="text-sm text-muted-foreground">Avg Speed</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">Low</span>
          </div>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-muted-foreground">Harsh Brakes</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-info/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <span className="text-xs px-2 py-0.5 bg-info/10 text-info rounded-full">Efficient</span>
          </div>
          <p className="text-2xl font-bold">4.2h</p>
          <p className="text-sm text-muted-foreground">Driving Time</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Analysis */}
        <div className="glass-card p-4 sm:p-6">
          <h3 className="font-semibold text-lg mb-4">Speed Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="rgb(249 115 22)"
                  strokeWidth={2}
                  dot={{ fill: 'rgb(249 115 22)', strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="limit"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-muted-foreground">Your Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-muted-foreground" style={{ borderStyle: 'dashed' }} />
              <span className="text-xs text-muted-foreground">Speed Limit</span>
            </div>
          </div>
        </div>

        {/* Behavior Breakdown */}
        <div className="glass-card p-4 sm:p-6">
          <h3 className="font-semibold text-lg mb-4">Driving Behavior</h3>
          <div className="flex items-center justify-center h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={behaviorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {behaviorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {behaviorData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-card-secondary rounded-xl text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <p className="font-medium text-xs sm:text-sm">Safe Driver</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">7 days streak</p>
          </div>

          <div className="p-4 bg-card-secondary rounded-xl text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
            </div>
            <p className="font-medium text-xs sm:text-sm">Zero Incidents</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">This month</p>
          </div>

          <div className="p-4 bg-card-secondary rounded-xl text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
            </div>
            <p className="font-medium text-xs sm:text-sm">Route Master</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">95% efficiency</p>
          </div>

          <div className="p-4 bg-card-secondary rounded-xl text-center opacity-50">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-xs sm:text-sm">Top 10%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">3 more trips</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAnalytics;

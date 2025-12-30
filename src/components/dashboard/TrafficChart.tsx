import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '6AM', congestion: 20, prediction: 25 },
  { time: '8AM', congestion: 75, prediction: 70 },
  { time: '10AM', congestion: 45, prediction: 50 },
  { time: '12PM', congestion: 55, prediction: 52 },
  { time: '2PM', congestion: 48, prediction: 45 },
  { time: '4PM', congestion: 60, prediction: 65 },
  { time: '6PM', congestion: 85, prediction: 80 },
  { time: '8PM', congestion: 40, prediction: 35 },
  { time: '10PM', congestion: 20, prediction: 18 },
];

const TrafficChart: React.FC = () => {
  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Traffic Patterns</h3>
          <p className="text-sm text-muted-foreground">Actual vs Predicted congestion</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/40" />
            <span className="text-xs text-muted-foreground">Predicted</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(28, 100%, 50%)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(28, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(28, 100%, 50%)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="hsl(28, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Area
              type="monotone"
              dataKey="prediction"
              stroke="hsl(28, 100%, 50%)"
              strokeOpacity={0.4}
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorPrediction)"
            />
            <Area
              type="monotone"
              dataKey="congestion"
              stroke="hsl(28, 100%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCongestion)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;

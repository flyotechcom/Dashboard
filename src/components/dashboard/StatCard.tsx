import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const iconColors = {
    default: 'bg-secondary text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconColors[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
            isPositive && "bg-success/10 text-success",
            isNegative && "bg-destructive/10 text-destructive",
            !isPositive && !isNegative && "bg-secondary text-muted-foreground"
          )}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
        {changeLabel && (
          <p className="text-xs text-muted-foreground/60 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

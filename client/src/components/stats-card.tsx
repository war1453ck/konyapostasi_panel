import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon, 
  iconBgColor = 'bg-blue-100' 
}: StatsCardProps) {
  return (
    <Card className="stats-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={cn(
                "text-sm mt-1 flex items-center",
                changeType === 'increase' ? "text-green-600" : "text-red-600"
              )}>
                <i className={cn(
                  "fas mr-1",
                  changeType === 'increase' ? "fa-arrow-up" : "fa-arrow-down"
                )} />
                {change}
              </p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

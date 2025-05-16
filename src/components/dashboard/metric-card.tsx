import type { Metric } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: Metric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  const IconComponent = metric.icon;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.title}
        </CardTitle>
        <IconComponent className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{metric.value}</div>
        {metric.change && (
          <p className={cn(
            "text-xs text-muted-foreground mt-1",
            metric.changeType === 'positive' ? 'text-green-600' : '',
            metric.changeType === 'negative' ? 'text-red-600' : ''
          )}>
            {metric.change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

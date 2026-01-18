import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/atoms/card";
import { BookOpen, BarChart2, PieChart, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detailed Reports</h1>
        <p className="text-muted-foreground mt-1">
          Deep analytical insights into system usage and revenue.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          title="User Growth"
          description="Monthly active users trend"
          icon={TrendingUp}
        />
        <ReportCard
          title="Revenue Split"
          description="Breakdown by subscription tier"
          icon={PieChart}
        />
        <ReportCard
          title="API Utilization"
          description="Programmatic usage metrics"
          icon={BarChart2}
        />
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-primary opacity-50" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Report Generation</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Automated reports are currently being aggregated. Weekly summaries
            will be available here soon.
          </p>
        </div>
      </Card>
    </div>
  );
}

function ReportCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all cursor-pointer group">
      <CardHeader>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

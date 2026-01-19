import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/atoms/card";
import { BookOpen, BarChart2, PieChart, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="slide-in-from-bottom-4 space-y-8 animate-in duration-700 fade-in">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Detailed Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Deep analytical insights into system usage and revenue.
        </p>
      </div>

      <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
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

      <Card className="flex flex-col justify-center items-center space-y-4 bg-card/50 backdrop-blur-sm p-12 border-border/50 text-center">
        <div className="flex justify-center items-center bg-primary/10 rounded-full w-20 h-20">
          <BookOpen className="opacity-50 w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl">Report Generation</h3>
          <p className="mx-auto max-w-md text-muted-foreground">
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
    <Card className="group bg-card/50 hover:shadow-md backdrop-blur-sm border-border/50 transition-all cursor-pointer">
      <CardHeader>
        <div className="flex justify-center items-center bg-primary/10 mb-2 rounded-lg w-8 h-8 text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

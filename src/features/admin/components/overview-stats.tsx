import { Users, Image as ImageIcon, CreditCard, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { format } from "date-fns";
import { getAdminMetrics } from "../api";
import { use } from "react";
import { Skeleton } from "@/components/atoms/skeleton";


export function StatsGrid() {
  const metrics = use(getAdminMetrics());
  const stats = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      description: "Registered accounts",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Images",
      value: metrics.totalImages,
      description: "Generated ALT texts",
      icon: ImageIcon,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      description: "Pro plan members",
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Last Activity",
      value: metrics.lastActivity
        ? format(new Date(metrics.lastActivity), "MMM d, HH:mm")
        : "N/A",
      description: "Latest system event",
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-card/50 hover:shadow-md backdrop-blur-sm border-border/50 transition-all"
        >
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stat.value}</div>
            <p className="mt-1 text-muted-foreground text-xs">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="rounded-xl w-full h-32" />
      ))}
    </div>
  );
}
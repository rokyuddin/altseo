import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { Save, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="slide-in-from-bottom-4 flex flex-col space-y-8 mx-auto max-w-7xl animate-in duration-700 fade-in">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Admin Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure global system parameters and administrative controls.
        </p>
      </div>

      <div className="flex-1 gap-8 grid">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
            <CardDescription>
              General settings for the AltSEO platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="gap-3 grid">
              <Label htmlFor="site-name">Platform Name</Label>
              <Input
                id="site-name"
                defaultValue="AltSEO"
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="gap-3 grid">
              <Label htmlFor="support-email">Admin Contact Email</Label>
              <Input
                id="support-email"
                defaultValue="admin@altseo.io"
                className="bg-background/50 border-border/50"
              />
            </div>
            <Separator className="bg-border/30" />
            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 backdrop-blur-sm border-destructive/20">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <CardTitle>Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Actions that have significant impact on the entire system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Maintenance Mode</div>
                <div className="text-muted-foreground text-xs">
                  Disable user access to the platform temporarily.
                </div>
              </div>
              <Button
                variant="outline"
                className="hover:bg-destructive/10 border-destructive/50 text-destructive"
              >
                Enable
              </Button>
            </div>
            <Separator className="bg-destructive/10" />
            <div className="flex justify-between items-center py-2">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Flush System Cache</div>
                <div className="text-muted-foreground text-xs">
                  Clear all global and local application caches.
                </div>
              </div>
              <Button
                variant="outline"
                className="hover:bg-destructive/10 border-destructive/50 text-destructive"
              >
                Flush
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

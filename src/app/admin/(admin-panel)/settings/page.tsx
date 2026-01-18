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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure global system parameters and administrative controls.
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
            <CardDescription>
              General settings for the AltSEO platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="site-name">Platform Name</Label>
              <Input
                id="site-name"
                defaultValue="AltSEO"
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="grid gap-3">
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
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Actions that have significant impact on the entire system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Maintenance Mode</div>
                <div className="text-xs text-muted-foreground">
                  Disable user access to the platform temporarily.
                </div>
              </div>
              <Button
                variant="outline"
                className="border-destructive/50 hover:bg-destructive/10 text-destructive"
              >
                Enable
              </Button>
            </div>
            <Separator className="bg-destructive/10" />
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Flush System Cache</div>
                <div className="text-xs text-muted-foreground">
                  Clear all global and local application caches.
                </div>
              </div>
              <Button
                variant="outline"
                className="border-destructive/50 hover:bg-destructive/10 text-destructive"
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

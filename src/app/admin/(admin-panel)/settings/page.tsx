import { SettingsContainer } from "@/features/admin/components/settings-container";

export default function AdminSettingsPage() {
  return (
    <div className="slide-in-from-bottom-4 flex flex-col space-y-8 mx-auto max-w-7xl animate-in duration-700 fade-in">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Admin Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure global system parameters and administrative controls.
        </p>
      </div>

      <SettingsContainer />
    </div>
  );
}

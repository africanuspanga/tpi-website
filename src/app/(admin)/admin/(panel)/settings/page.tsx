import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/admin/SettingsForm";

async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("setting_key");
  if (error) throw error;
  return data;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">Website Settings</h1>
        <p className="text-muted-text">Manage organization details shown across the site.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-navy">Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteSetting } from "@/actions/admin/settings";
import { toast } from "sonner";

interface SettingsFormProps {
  settings: { setting_key: string; setting_value: unknown }[];
}

const fields = [
  { key: "organization_name", label: "Organization Name" },
  { key: "tagline", label: "Tagline" },
  { key: "contact_email", label: "Contact Email" },
  { key: "website", label: "Website" },
  { key: "address", label: "Address" },
];

export function SettingsForm({ settings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.setting_key] =
        typeof s.setting_value === "string"
          ? s.setting_value
          : JSON.stringify(s.setting_value);
    }
    return map;
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    for (const field of fields) {
      const value = values[field.key];
      const parsed =
        field.key === "contact_phones"
          ? JSON.parse(value || "[]")
          : value;
      const result = await updateSiteSetting(field.key, parsed);
      if (!result.success) {
        toast.error(`Failed to update ${field.label}`);
        setIsLoading(false);
        return;
      }
    }

    toast.success("Settings saved successfully.");
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            value={values[field.key] || ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
          />
        </div>
      ))}
      <Button
        type="submit"
        className="bg-navy hover:bg-navy/90"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}

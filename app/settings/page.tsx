"use client";

import { Sliders, Bell, Database, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure your supervisor profile, AI behaviour, and integrations."
        showStepper={false}
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" /> Supervisor profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Display name</Label>
              <Input defaultValue="Dr. Wattana" />
            </div>
            <div>
              <Label>Affiliation</Label>
              <Input defaultValue="CBT Lab" />
            </div>
            <div>
              <Label>Default modality</Label>
              <Select defaultValue="CBT — Anxiety">
                <option>CBT — Anxiety</option>
                <option>CBT — Depression</option>
                <option>CBT — OCD</option>
                <option>CBT — Panic</option>
                <option>CBT — PTSD</option>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select defaultValue="th-en">
                <option value="th-en">Thai / English (mixed)</option>
                <option value="th">Thai</option>
                <option value="en">English</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> AI scoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Model</Label>
                <Select defaultValue="cts-r-v2">
                  <option value="cts-r-v2">CTS-R Reviewer v2</option>
                  <option value="cts-r-v1">CTS-R Reviewer v1</option>
                </Select>
              </div>
              <div>
                <Label>Confidence threshold</Label>
                <Input type="number" min={0} max={1} step={0.05} defaultValue={0.7} />
              </div>
            </div>
            <Separator />
            <ToggleRow
              title="Auto-suggest evidence"
              desc="Highlight relevant transcript snippets per CTS-R item."
              defaultChecked
            />
            <ToggleRow
              title="Flag low-agreement items"
              desc="Surface items where AI confidence is below threshold."
              defaultChecked
            />
            <ToggleRow
              title="Use supervisor history for calibration"
              desc="Adjust AI scoring style to match your historical ratings."
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              title="Email me when a session is ready for review"
              desc="Sent after AI scoring completes."
              defaultChecked
            />
            <ToggleRow
              title="Weekly reliability digest"
              desc="Summary of Cohen's κ across your sessions."
            />
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Data
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Export all sessions (CSV)
            </Button>
            <Button variant="outline" size="sm">
              Export reports (PDF)
            </Button>
            <Button variant="destructive" size="sm">
              Delete account
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </>
  );
}

function ToggleRow({
  title,
  desc,
  defaultChecked,
}: {
  title: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 flex-shrink-0 rounded border-input text-primary focus:ring-ring"
      />
    </label>
  );
}

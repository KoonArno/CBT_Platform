"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Sliders } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function SettingsPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure your supervisor profile and password."
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
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-primary" /> Change password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>New password</Label>
                <PasswordInput
                  placeholder="Enter new password"
                  visible={showNewPassword}
                  onToggle={() => setShowNewPassword((p) => !p)}
                />
              </div>
              <div>
                <Label>Confirm new password</Label>
                <PasswordInput
                  placeholder="Confirm new password"
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((p) => !p)}
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update password
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

function PasswordInput({
  placeholder,
  visible,
  onToggle,
}: {
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <Icon className="h-4 w-4" />
      </button>
    </div>
  );
}

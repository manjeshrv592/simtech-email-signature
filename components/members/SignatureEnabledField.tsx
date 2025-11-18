"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SignatureEnabledField({ defaultChecked = true }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div>
      <Label htmlFor="signatureEnabled-switch">Signature Enabled</Label>
      <div className="flex items-center gap-2 mt-1">
        <Switch id="signatureEnabled-switch" checked={checked} onCheckedChange={setChecked} />
        <input type="hidden" name="signatureEnabled" value={checked ? "true" : "false"} />
      </div>
    </div>
  );
}
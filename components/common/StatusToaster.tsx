"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function StatusToaster({ success, error }: { success?: string; error?: string }) {
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);
  return null;
}
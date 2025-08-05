// components/DeleteAccountButton.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onDelete() {
    if (
      !confirm(
        "Are you sure? This will permanently delete your account and all your data."
      )
    ) {
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/delete", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/auth/register" });
    } else {
      setLoading(false);
      alert("Could not delete account. Try again.");
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onDelete}
      disabled={loading}
    >
      {loading ? "Deleting…" : "Delete Account"}
    </Button>
  );
}
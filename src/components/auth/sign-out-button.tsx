// src/components/auth/sign-out-button.tsx
"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          退出中...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </>
      )}
    </Button>
  );
}
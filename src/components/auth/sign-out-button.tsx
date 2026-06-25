"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  }

  return (
    <button
     type="button"
      onClick={handleSignOut}
      className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 font-medium text-white"
    >
      退出登录
    </button>
  );
}
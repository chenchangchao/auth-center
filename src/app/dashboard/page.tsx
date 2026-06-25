import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold mb-4">当前登录用户</h2>

          <pre className="overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-300">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        <div className="mb-6">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}

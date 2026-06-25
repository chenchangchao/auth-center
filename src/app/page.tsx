import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Auth Center</h1>
        <p className="text-slate-400 mb-8">
          基于 Next.js、Better Auth、Supabase PostgreSQL 的统一身份认证中心 Demo。
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 font-medium"
          >
            去登录
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-5 py-3 font-medium"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
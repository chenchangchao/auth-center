// src/app/page.tsx
import Link from "next/link";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Auth Center</p>
            <p className="text-sm text-muted-foreground">
              Next.js + Better Auth + Supabase
            </p>
          </div>

          <ModeToggle />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-2xl text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold tracking-tight">
                Auth Center
              </CardTitle>
              <CardDescription className="text-base">
                基于 Next.js、Better Auth、Supabase PostgreSQL 的统一身份认证中心 Demo。
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center gap-4">
              <Button >
                <Link href="/login">去登录</Link>
              </Button>

              <Button variant="secondary">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
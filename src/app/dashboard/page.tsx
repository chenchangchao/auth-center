// src/app/dashboard/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  Fingerprint,
  Mail,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) return name.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const currentSession = session.session;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Auth Center / Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              统一身份认证中心
            </h1>
            <p className="mt-2 text-muted-foreground">
              Next.js + Better Auth + Supabase PostgreSQL 的认证管理 Demo。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <SignOutButton />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                <AvatarFallback>
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {user.name || "未命名用户"}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "邮箱已验证" : "邮箱未验证"}
                  </Badge>
                  <Badge variant="outline">已登录</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<UserCircle className="h-4 w-4" />}
                  label="用户 ID"
                  value={user.id}
                />
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="邮箱"
                  value={user.email ?? "-"}
                />
                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="注册时间"
                  value={formatDate(user.createdAt)}
                />
                <InfoItem
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="账号状态"
                  value="Active"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>当前 Session</CardTitle>
              <CardDescription>
                这里只展示安全字段，不直接暴露 session token。
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoItem
                icon={<Fingerprint className="h-4 w-4" />}
                label="Session ID"
                value={currentSession.id}
              />
              <InfoItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="创建时间"
                value={formatDate(currentSession.createdAt)}
              />
              <InfoItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="过期时间"
                value={formatDate(currentSession.expiresAt)}
              />

              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium">User Agent</p>
                <p className="break-all text-sm text-muted-foreground">
                  {currentSession.userAgent || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>项目能力说明</CardTitle>
            <CardDescription>
              这部分后续可以作为作品集展示和简历项目说明。
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="OAuth2.0 登录"
              description="已支持 GitHub OAuth，后续扩展 Google、Apple 等社交登录。"
            />
            <FeatureCard
              title="会话管理"
              description="基于 Better Auth 管理用户、账户、Session 与安全退出。"
            />
            <FeatureCard
              title="云端部署"
              description="计划部署到 AWS EC2，通过 Nginx 与 Cloudflare 绑定二级域名。"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="break-all text-sm font-medium">{value}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
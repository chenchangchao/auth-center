"use client";

import { useState } from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<
    "email" | "signup" | "github" | "google" | null
  >(null);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123456");
  const [name, setName] = useState("Test User");
  const [message, setMessage] = useState("");

  function getAuthErrorMessage(
    error: { message?: string; code?: string; statusText?: string } | undefined,
    fallback: string,
  ) {
    return error?.message || error?.code || error?.statusText || fallback;
  }

  async function handleSignUp() {
    setLoadingProvider("signup");
    setMessage("正在注册账号...");

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setMessage(
          `注册失败：${getAuthErrorMessage(result.error, "服务端暂时不可用，请稍后重试。")}`,
        );
        return;
      }

      setMessage("注册成功，可以继续登录。");
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleSignIn() {
    setLoadingProvider("email");
    setMessage("正在使用邮箱密码登录...");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setMessage(
          `邮箱登录失败：${getAuthErrorMessage(result.error, "服务端暂时不可用，请稍后重试。")}`,
        );
        return;
      }

      setMessage("邮箱登录成功，正在跳转到 Dashboard...");
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleGithubLogin() {
    setLoadingProvider("github");
    setMessage("正在跳转到 GitHub 授权页面...");

    try {
      const result = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        setMessage(
          `GitHub 登录失败：${getAuthErrorMessage(result.error, "服务端暂时不可用，请稍后重试。")}`,
        );
        setLoadingProvider(null);
      }
    } catch (error) {
      setMessage("GitHub 登录发起失败，请稍后重试。");
      setLoadingProvider(null);
      throw error; // TODO: handle error
    }
  }

  async function handleGoogleLogin() {
    setLoadingProvider("google");
    setMessage("正在跳转到 Google 授权页面...");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        setMessage(
          `Google 登录失败：${getAuthErrorMessage(result.error, "服务端暂时不可用，请稍后重试。")}`,
        );
        setLoadingProvider(null);
      }
    } catch (error) {
      setMessage("Google 登录发起失败，请稍后重试。");
      setLoadingProvider(null);
      throw error;
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 返回首页
          </Link>

          <ModeToggle />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">登录 Auth Center</CardTitle>
              <CardDescription>
                使用邮箱密码、GitHub 或 Google 登录你的认证 Demo。
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Test User"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="test@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="password123456"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleSignUp}
                  variant="secondary"
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "signup" ? "注册中..." : "注册"}
                </Button>

                <Button
                  onClick={handleSignIn}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "email" ? "登录中..." : "登录"}
                </Button>
              </div>

              <Separator />

              <Button
                onClick={handleGithubLogin}
                variant="outline"
                className="w-full"
                disabled={loadingProvider !== null}
              >
                <Icons.gitHub className="size-4" aria-hidden="true" />
                {loadingProvider === "github"
                  ? "正在跳转到 GitHub..."
                  : "使用 GitHub 登录"}
              </Button>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full"
                disabled={loadingProvider !== null}
              >
                <Icons.google className="size-4" aria-hidden="true" />
                {loadingProvider === "google"
                  ? "正在跳转到 Google..."
                  : "使用 Google 登录"}
              </Button>

              {message && (
                <div className="rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground">
                  {message}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

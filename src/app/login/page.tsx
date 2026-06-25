"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123456");
  const [name, setName] = useState("Test User");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setMessage("注册中...");

    const result = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (result.error) {
      setMessage(`注册失败：${result.error.message}`);
      return;
    }

    setMessage("注册成功，可以登录了。");
  }

  async function handleSignIn() {
    setMessage("登录中...");

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (result.error) {
      setMessage(`登录失败：${result.error.message}`);
      return;
    }

    setMessage("登录成功，正在跳转...");
  }

  async function handleGithubLogin() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  }

  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Auth Center</h1>
        <p className="text-slate-400 mb-6">
          Next.js + Better Auth + Supabase PostgreSQL 认证 Demo
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm mb-1">Name</label>
            <input
              id="name"
              title="Name"
              placeholder="Your full name"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              id="email"
              title="Email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              title="Password"
              placeholder="Enter your password"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSignUp}
              className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 font-medium"
            >
              注册
            </button>

            <button
              type="button"
              onClick={handleSignIn}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
            >
              登录
            </button>
          </div>

          <div className="h-px bg-slate-800 my-4" />

          <button
            type="button"
            onClick={handleGithubLogin}
            className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 font-medium"
          >
            使用 GitHub 登录
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 font-medium"
          >
            使用 Google 登录
          </button>

          {message && (
            <p className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

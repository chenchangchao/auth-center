"use client";

import { useSyncExternalStore } from "react";
import { Laptop, Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/theme-provider";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ModeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { setTheme, theme, resolvedTheme } = useTheme();

  const displayTheme = mounted
    ? theme === "system"
      ? "system"
      : resolvedTheme
    : "system";

  const Icon =
    displayTheme === "light"
      ? Sun
      : displayTheme === "dark"
        ? Moon
        : Laptop;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="切换主题"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        suppressHydrationWarning
      >
        <Icon className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          浅色
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          深色
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

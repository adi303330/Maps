"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  Map as MapIcon,
  FileText,
  Users,
  User,
  Building,
  Sun,
  Moon,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  mode: "citizen" | "government";
}

export default function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initialize theme from document class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasDark = document.documentElement.classList.contains("dark");
      setIsDark(hasDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof window !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("cl_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("cl_theme", "light");
      }
    }
  };

  const citizenNav = [
    { name: "Dashboard", href: "/citizen", icon: LayoutDashboard },
    { name: "Report Issue", href: "/citizen/report", icon: Camera },
    { name: "City Map", href: "/citizen/map", icon: MapIcon },
    { name: "My Reports", href: "/citizen/my-reports", icon: FileText },
    { name: "Community", href: "/citizen/community", icon: Users },
    { name: "Profile", href: "/citizen/profile", icon: User },
  ];

  const govNav = [
    { name: "Command Center", href: "/government", icon: Building },
    { name: "City Map", href: "/citizen/map", icon: MapIcon }, // reuse same map
    { name: "Community Feed", href: "/citizen/community", icon: Users },
  ];

  const navItems = mode === "citizen" ? citizenNav : govNav;

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-card text-card-foreground transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } h-screen flex-shrink-0 z-30`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight select-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Shield className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-foreground">CivicLens AI</span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">Smart City OS</span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm mx-auto">
            <Shield className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        <div className="px-2 mb-2">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {mode === "citizen" ? "Citizen Portal" : "Government Admin"}
            </span>
          )}
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? "" : "text-muted-foreground group-hover:text-foreground"}`} />
              {!isCollapsed && <span>{item.name}</span>}
              {isCollapsed && (
                <div className="absolute left-14 bg-popover border border-border text-popover-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggles */}
      <div className="p-3 border-t border-border bg-muted/20 flex flex-col gap-2.5">
        {/* Toggle Mode Button */}
        {!isCollapsed ? (
          <Link
            href={mode === "citizen" ? "/government" : "/citizen"}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-secondary hover:text-foreground transition-all shadow-sm"
          >
            {mode === "citizen" ? (
              <>
                <Building className="h-3.5 w-3.5" />
                <span>Go to Gov Dashboard</span>
              </>
            ) : (
              <>
                <User className="h-3.5 w-3.5" />
                <span>Go to Citizen Portal</span>
              </>
            )}
          </Link>
        ) : (
          <Link
            href={mode === "citizen" ? "/government" : "/citizen"}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-foreground hover:bg-secondary hover:text-foreground transition-all mx-auto shadow-sm"
            title={mode === "citizen" ? "Government Dashboard" : "Citizen Portal"}
          >
            {mode === "citizen" ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </Link>
        )}

        {/* Theme and Collapse Controls */}
        <div className={`flex items-center ${isCollapsed ? "flex-col gap-2.5" : "justify-between"} px-1`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}

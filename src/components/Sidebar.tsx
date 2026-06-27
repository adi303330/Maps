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
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";

interface SidebarProps {
  mode: "citizen" | "government";
}

export default function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pitch" | "architecture">("pitch");

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
    { name: "City Map", href: "/government/map", icon: MapIcon },
    { name: "Community Feed", href: "/government/community", icon: Users },
  ];

  const navItems = mode === "citizen" ? citizenNav : govNav;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 items-center justify-between px-4 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold tracking-tight">CivicLens AI</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <Link
            href={mode === "citizen" ? "/government" : "/citizen"}
            className="text-[10px] font-bold border border-border px-2.5 py-1 rounded-lg bg-secondary hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground transition-all"
          >
            {mode === "citizen" ? "Gov Command" : "Citizen Portal"}
          </Link>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card text-card-foreground transition-all duration-300 ${
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
            {/* Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary text-primary hover:text-foreground transition-colors animate-pulse"
              title="Platform Hackathon Pitch Guide"
            >
              <Sparkles className="h-4 w-4 stroke-[2]" />
            </button>

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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-40 items-center justify-around px-1 pb-safe shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-[9px] tracking-tight truncate max-w-[64px]">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Hackathon Pitch Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-card-foreground">
            
            {/* Modal Header */}
            <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/10 flex-shrink-0">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Hackathon Pitch & Evaluation Guide</span>
              </div>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-border text-xs font-bold uppercase tracking-wider bg-muted/20">
              <button
                type="button"
                onClick={() => setActiveTab('pitch')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeTab === 'pitch' ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:bg-muted/10'
                }`}
              >
                1. How to Test (Pitch Loop)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeTab === 'architecture' ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:bg-muted/10'
                }`}
              >
                2. System Architecture
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
              {activeTab === 'pitch' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">The 4-Step Hackathon Demo Script:</h3>
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/5 space-y-1.5">
                      <strong className="text-foreground font-bold flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">1</span>
                        <span>Filing the report (AI Telemetry)</span>
                      </strong>
                      <p className="text-xs text-muted-foreground font-medium">
                        Go to the <Link href="/citizen/report" className="text-primary hover:underline font-bold" onClick={() => setIsGuideOpen(false)}>Report Issue</Link> page. Upload any photo. Next-Gen Gemini scans the photo to extract metadata, class, severity, and automatically drafts an official dispatch email to correct authorities.
                      </p>
                      <div className="text-[10px] bg-primary/10 border border-primary/20 text-primary rounded px-2 py-1 inline-flex items-center gap-1 font-bold mt-1">
                        💡 Click "Use Live Location" to resolve address via GPS instantly!
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/5 space-y-1.5">
                      <strong className="text-foreground font-bold flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">2</span>
                        <span>Tracking on the Map (Heatmaps)</span>
                      </strong>
                      <p className="text-xs text-muted-foreground font-medium">
                        Go to the <Link href="/citizen/map" className="text-primary hover:underline font-bold" onClick={() => setIsGuideOpen(false)}>City Map</Link> page. Click on your newly added issue pin. Check out the community details and timeline. Tap <strong>"Toggle Heatmap Layer"</strong> to view overlapping density hotspots.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/5 space-y-1.5">
                      <strong className="text-foreground font-bold flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">3</span>
                        <span>Upvoting & Comments</span>
                      </strong>
                      <p className="text-xs text-muted-foreground font-medium">
                        Go to the <Link href="/citizen/community" className="text-primary hover:underline font-bold" onClick={() => setIsGuideOpen(false)}>Community Validation</Link> board. Upvote issues to boost their priority queue position and add comment updates to simulate local citizen participation.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/5 space-y-1.5">
                      <strong className="text-foreground font-bold flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">4</span>
                        <span>Government Visual Audit (Before/After)</span>
                      </strong>
                      <p className="text-xs text-muted-foreground font-medium">
                        Switch to the <Link href="/government" className="text-primary hover:underline font-bold" onClick={() => setIsGuideOpen(false)}>Government Command Center</Link>. Look at the AI insights and Recharts analytics. In the Priority Queue table, click **"Verify Fix"**, upload a completed repair photo, and let the AI run a side-by-side verification comparison.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">How does it work under the hood?</h3>
                  <div className="space-y-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                      <p>
                        <strong className="text-foreground">Next.js 15 & Tailwind CSS v4:</strong> Built for performance, styling controls, and responsive styling tokens (fully mobile-ready navigation drawer & layout structure).
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                      <p>
                        <strong className="text-foreground">Google Gemini 1.5 Flash API:</strong> Handles real-world image parsing and resolution audits. It outputs structured JSON parameters dynamically mapped to database states.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                      <p>
                        <strong className="text-foreground">Free Leaflet Maps & Cache-memoized Icons:</strong> Map coordinates and layout shapes rendered dynamically without expensive Google Maps API key billing setups. DivIcon assets are cached to prevent browser lagging during zoom transitions.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                      <p>
                        <strong className="text-foreground">LocalStorage Persistence:</strong> All newly added reports, upvotes, and comments persist locally in the user's browser, simulating a live real-time Supabase system out-of-the-box.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/10 border-t border-border px-6 py-3.5 flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-400">CivicLens AI • Hackathon Pitch Assistant</span>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm"
              >
                Let's Demo!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

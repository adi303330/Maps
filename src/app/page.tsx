"use client";

import React from "react";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Users, 
  Layers, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Play
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <ShieldCheck className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold leading-none">CivicLens AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Platform Features</a>
          <Link href="/citizen/map" className="hover:text-primary transition-colors">Live Map</Link>
          <Link href="/citizen/community" className="hover:text-primary transition-colors">Community Feed</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link 
            href="/citizen" 
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            Citizen Portal
          </Link>
          <Link 
            href="/government" 
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Building className="h-3.5 w-3.5" />
            <span>Government Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-28 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>Next-Gen Smart City Infrastructure OS</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
              Making Cities <br className="hidden sm:inline" />
              <span className="text-primary">Visible</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl font-normal leading-relaxed">
              AI-powered infrastructure intelligence that helps citizens report issues and helps governments resolve them faster. Built for real-world municipal operations.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/citizen/report"
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/10 flex items-center gap-2"
              >
                <Camera className="h-4.5 w-4.5" />
                <span>Report an Issue</span>
              </Link>
              <Link
                href="/citizen/map"
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                <MapPin className="h-4.5 w-4.5 text-primary" />
                <span>View Live City Map</span>
              </Link>
            </div>
          </div>

          {/* Hero Illustration: Interactive Mock OS Interface */}
          <div className="flex-1 w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl shadow-slate-100 flex flex-col h-[460px]">
            {/* Top Window Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">CivicLens Operational Node</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
            </div>

            {/* Mock Layout Grid */}
            <div className="flex-1 grid grid-cols-5 h-full overflow-hidden bg-slate-50/50">
              {/* Mock Map Panel (3 cols) */}
              <div className="col-span-3 border-r border-slate-200 p-4 flex flex-col gap-3 relative overflow-hidden bg-slate-100">
                {/* SVG Mock Map Grid */}
                <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" strokeWidth="2"/>
                    <line x1="0" y1="250" x2="600" y2="250" stroke="currentColor" strokeWidth="2"/>
                    <line x1="200" y1="0" x2="200" y2="500" stroke="currentColor" strokeWidth="2"/>
                    <line x1="450" y1="0" x2="450" y2="500" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                
                {/* Map Pins */}
                <div className="absolute top-[35%] left-[25%] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-md animate-pulse"></div>
                  <div className="ml-5 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-800 shadow-sm">Critical Pothole</div>
                </div>
                <div className="absolute top-[65%] left-[60%] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md"></div>
                  <div className="ml-5 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-800 shadow-sm">Water Leak Resolved</div>
                </div>
                <div className="absolute top-[20%] left-[75%] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-md"></div>
                </div>

                <div className="mt-auto bg-white/95 border border-slate-200 rounded-lg p-3 shadow-sm z-10">
                  <h4 className="text-[11px] font-bold text-slate-900">Map View: Downtown Core</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 12 Critical
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 38 High
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 145 Resolved
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock AI Analysis & Resolution Panel (2 cols) */}
              <div className="col-span-2 p-4 flex flex-col justify-between overflow-y-auto">
                {/* AI Analysis block */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h4 className="text-xs font-bold text-slate-900">AI Telemetry</h4>
                  </div>
                  
                  {/* Analysis card details */}
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold">ISSUE TYPE</span>
                      <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-1.5 py-0.5 rounded">Pothole</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold">SEVERITY</span>
                      <span className="text-[10px] text-red-600 font-black">8.4 / 10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold">DEPARTMENT</span>
                      <span className="text-[9px] text-slate-800 font-bold truncate max-w-[110px]">Public Works</span>
                    </div>
                  </div>

                  {/* Mock workflow stages */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block">Resolution Progress</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[8px] font-bold text-emerald-600">✓</span>
                        <span className="text-slate-800 font-semibold">Report Submitted</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[8px] font-bold text-emerald-600">✓</span>
                        <span className="text-slate-800 font-semibold">Assigned (Crew 4)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[8px] font-bold text-primary animate-pulse">•</span>
                        <span className="text-slate-900 font-bold">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <span className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[8px]"></span>
                        <span>Resolution Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4 text-[10px] text-slate-400 font-medium">
                  Analysis Confidence: <span className="font-bold text-slate-700">97.8%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* Features Section */}
          <section id="features" className="bg-white border-t border-b border-slate-200 py-24 px-6">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Engineered for Smart Cities</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Capabilities</h2>
                <p className="text-slate-500 font-medium">
                  A high-performance architecture providing visibility, tracking, and validation for municipal operations.
                </p>
              </div>

              {/* Grid of 6 Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Camera className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">AI Issue Detection</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Upload an image and instantly identify infrastructure problems. High-precision neural classification maps defects.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Building className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Smart Department Routing</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Automatically find the responsible authority. Directly dispatches reports to Roads, Water, Sanitation, or Energy crews.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Live Infrastructure Map</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Visualize city-wide infrastructure issues in real time. Coordinates, severity alerts, and local clusters mapped live.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Government Dashboard</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Prioritize and manage issues efficiently. Command center queue sorted by AI severity and community upvotes.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Resolution Verification</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Compare before and after images using AI. Restores system trust by verifying quality of structural repair works.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Community Validation</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Citizens can verify, comment, and upvote reports. Crowd-sourcing confirms existence and impact severity in real time.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-slate-50/50 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <span className="font-bold text-slate-800">CivicLens AI</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">SF Operational Node</span>
            </div>
            <span>© 2026 CivicLens AI. All rights reserved. Professional Smart-City OS framework.</span>
          </div>
        </footer>
      </div>
  );
}

"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  User, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Award,
  Globe,
  Settings,
  Building,
  Smartphone,
  Save
} from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@gmail.com");
  const [phone, setPhone] = useState("+1 (555) 382-9482");
  const [neighborhood, setNeighborhood] = useState("Mission District, San Francisco");
  
  // Notification States
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [nearbyAlerts, setNearbyAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile and operational settings saved to workspace.");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="citizen" />

      {/* Main pane */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">User Profile & Settings</h1>
            <p className="text-xs text-muted-foreground font-medium">Manage your civic profile, notification bounds, and achievements</p>
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full space-y-8 flex-1">
          {/* User Scorecard Banner */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <User className="h-7 w-7 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground leading-none">{name}</h2>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/15 uppercase tracking-wide">
                    Level 4 Reporter
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{neighborhood}</span>
                </p>
              </div>
            </div>

            {/* Achievements stats */}
            <div className="flex gap-8 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Citizen Rank</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Senior Civic Guardian</span>
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Verifications</span>
                <span className="text-xs font-bold text-foreground block">
                  18 resolved issues
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Account Information (7 cols) */}
            <div className="lg:col-span-7 bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Specifications</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Neighborhood Zone</label>
                    <input 
                      type="text" 
                      value={neighborhood} 
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Phone</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Preferences (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Notification Toggles */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-primary" />
                  <span>Telemetry Dispatch Notifications</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Email Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-foreground">Status Updates</span>
                      <p className="text-[10px] text-muted-foreground font-medium leading-tight">Notify me via email when my report status transitions (e.g. Assigned, Resolved).</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                    />
                  </div>

                  {/* SMS Toggle */}
                  <div className="flex items-center justify-between border-t border-border/80 pt-4">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-foreground">SMS Alerts</span>
                      <p className="text-[10px] text-muted-foreground font-medium leading-tight">Send mobile message notifications for rapid crew actions on critical reports.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={smsNotif}
                      onChange={(e) => setSmsNotif(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                    />
                  </div>

                  {/* Nearby alerts */}
                  <div className="flex items-center justify-between border-t border-border/80 pt-4">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-foreground">Nearby Hazards</span>
                      <p className="text-[10px] text-muted-foreground font-medium leading-tight">Alert me if a critical (severity ≥ 8) infrastructure issue is reported in my zone.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={nearbyAlerts}
                      onChange={(e) => setNearbyAlerts(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>Save Operational Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

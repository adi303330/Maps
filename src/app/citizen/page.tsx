"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { db, Report } from "@/services/db";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Award, 
  Plus, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  ArrowUp,
  ExternalLink
} from "lucide-react";

export default function CitizenDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, impact: 0 });

  useEffect(() => {
    // Load reports and compute metrics
    const data = db.getReports();
    setReports(data);

    const total = data.length;
    const resolved = data.filter(r => r.status === "Resolved").length;
    const pending = total - resolved;
    const impact = data.reduce((acc, r) => acc + r.votes, 0);

    setStats({ total, resolved, pending, impact });
  }, []);

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Resolved":
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Resolved</span>;
      case "In Progress":
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 animate-pulse">In Progress</span>;
      case "Assigned":
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">Assigned</span>;
      case "Submitted":
      default:
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Submitted</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="citizen" />

      {/* Main content pane */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
        {/* Header */}
        <header className="hidden md:flex h-16 border-b border-border bg-card items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Citizen Dashboard</h1>
            <p className="text-xs text-muted-foreground font-medium">Overview of your municipal reports and contributions</p>
          </div>
          <Link
            href="/citizen/report"
            className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Report New Issue</span>
          </Link>
        </header>

        {/* Dashboard Widgets Grid */}
        <div className="p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Widget 1 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reports Logged</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">{stats.total}</span>
                <span className="text-xs text-muted-foreground font-semibold">total issues</span>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resolved Issues</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">{stats.resolved}</span>
                <span className="text-xs text-muted-foreground font-semibold">fixed by crews</span>
              </div>
            </div>

            {/* Widget 3 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Issues</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">{stats.pending}</span>
                <span className="text-xs text-muted-foreground font-semibold">under review</span>
              </div>
            </div>

            {/* Widget 4 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Community Impact</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">{stats.impact}</span>
                <span className="text-xs text-muted-foreground font-semibold">upvotes generated</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
                <Link href="/citizen/community" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                  <span>View All Reports</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-4">
                {reports.slice(0, 4).map((report) => (
                  <div key={report.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-4 sm:gap-5">
                    {/* Thumbnail */}
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <img 
                        src={report.image_url} 
                        alt={report.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800";
                        }}
                      />
                    </div>
                    {/* Report Summary */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors break-words">
                            <Link href={`/citizen/map?id=${report.id}`}>{report.title}</Link>
                          </h3>
                          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>{report.location_name}</span>
                          </p>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                        {report.ai_summary}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground pt-1 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5 text-primary" />
                          <span>{report.votes} upvotes</span>
                        </span>
                        {report.comments_count > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{report.comments_count} comments</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-foreground">Interactive City Operations</h2>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-foreground">How CivicLens AI works</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Once you upload a photograph of an issue, our neural pipeline automatically parses metadata, flags safety hazards, writes a complaint draft, and routes it to the corresponding city crew.
                  </p>
                </div>
                <div className="space-y-2 pt-3 border-t border-border">
                  <Link 
                    href="/citizen/report" 
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Report Infrastructure Defect</span>
                  </Link>
                  <Link 
                    href="/citizen/map" 
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary text-xs font-bold hover:text-foreground transition-all shadow-sm"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Explore Infrastructure Map</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

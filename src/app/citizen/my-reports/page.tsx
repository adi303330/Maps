"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { db, Report } from "@/services/db";
import { 
  FileText, 
  MapPin, 
  Calendar, 
  ArrowUp, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function MyReportsPage() {
  const [myReports, setMyReports] = useState<Report[]>([]);

  useEffect(() => {
    // Get all reports, filter for user's reports (session-added + two specific mock ones)
    const all = db.getReports();
    const filtered = all.filter(r => 
      r.id === "rep-1" || 
      r.id === "rep-4" || 
      !r.id.startsWith("rep-") // Newly created session reports don't start with standard mock id prefix 'rep-'
    );
    setMyReports(filtered);
  }, []);

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Resolved":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>;
      case "In Progress":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 animate-pulse">In Progress</span>;
      case "Assigned":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">Assigned</span>;
      case "Submitted":
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Submitted</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="citizen" />

      {/* Main pane */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
        <header className="hidden md:flex h-16 border-b border-border bg-card items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">My Reported Issues</h1>
            <p className="text-xs text-muted-foreground font-medium">History of your infrastructure reports and validation logs</p>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full space-y-6 flex-1">
          {myReports.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center mx-auto mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No reports found</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">You haven't submitted any infrastructure reports yet.</p>
              <Link 
                href="/citizen/report"
                className="inline-flex items-center gap-1 mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-sm"
              >
                <span>Report an Issue Now</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/10">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Submitted Reports</h2>
              </div>
              
              <div className="divide-y divide-border">
                {myReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-slate-50/40 dark:hover:bg-slate-800/5 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Visual Photo */}
                    <div className="h-16 w-16 rounded-lg bg-slate-100 border border-border overflow-hidden flex-shrink-0">
                      <img 
                        src={report.image_url} 
                        alt={report.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800";
                        }}
                      />
                    </div>

                    {/* Details Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate">
                          <Link href={`/citizen/map?id=${report.id}`}>{report.title}</Link>
                        </h3>
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{report.location_name.split(",")[0]}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions / Stats */}
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t border-border/50 sm:border-0 pt-3 sm:pt-0">
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5" />
                          <span>{report.votes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{report.comments_count}</span>
                        </span>
                      </div>

                      <Link 
                        href={`/citizen/map?id=${report.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold rounded-lg shadow-sm"
                      >
                        <span>Specifications</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

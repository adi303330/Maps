"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { db, Report, Comment } from "@/services/db";
import { 
  ArrowUp, 
  MessageSquare, 
  MapPin, 
  Check, 
  Sparkles,
  Building,
  Calendar,
  X,
  Plus
} from "lucide-react";

export default function CommunityPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setReports(db.getReports());
  }, []);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const votes = db.upvoteReport(id);
    setReports(reports.map(r => r.id === id ? { ...r, votes } : r));
    if (activeReport && activeReport.id === id) {
      setActiveReport({ ...activeReport, votes });
    }
  };

  const handleOpenDetail = (report: Report) => {
    setActiveReport(report);
    setComments(db.getComments(report.id));
  };

  const handleCloseDetail = () => {
    setActiveReport(null);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport || !newComment.trim()) return;

    const added = db.addComment(activeReport.id, "Citizen Participant", newComment);
    setComments([...comments, added]);
    setNewComment("");

    // Refresh reports list
    setReports(db.getReports());
    setActiveReport({
      ...activeReport,
      comments_count: activeReport.comments_count + 1
    });
  };

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Resolved":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>;
      case "In Progress":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 animate-pulse">In Progress</span>;
      case "Assigned":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">Assigned</span>;
      case "Submitted":
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Submitted</span>;
    }
  };

  const getSeverityBadgeColor = (severity: number) => {
    if (severity >= 8) return "bg-red-500 text-white";
    if (severity >= 5) return "bg-orange-500 text-white";
    return "bg-amber-500 text-white";
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="citizen" />

      {/* Content area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Community Validation Board</h1>
            <p className="text-xs text-muted-foreground font-medium">Verify reports, review public comments, and upvote local repairs</p>
          </div>
          <Link
            href="/citizen/report"
            className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Report Defect</span>
          </Link>
        </header>

        {/* List Grid */}
        <div className="p-8 space-y-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div 
                key={report.id}
                onClick={() => handleOpenDetail(report)}
                className="bg-card border border-border hover:border-slate-300 dark:hover:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image and Severity Pill */}
                <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative">
                  <img src={report.image_url} alt={report.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-white/20 shadow-sm ${getSeverityBadgeColor(report.severity)}`}>
                      Severity {report.severity}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                {/* Details info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">{report.issue_type}</span>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 leading-snug hover:text-primary transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{report.location_name}</span>
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {report.ai_summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-3 font-semibold text-muted-foreground">
                      <button
                        onClick={(e) => handleUpvote(report.id, e)}
                        className="flex items-center gap-1 hover:text-primary transition-colors group"
                      >
                        <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                        <span>{report.votes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{report.comments_count}</span>
                      </span>
                    </div>
                    
                    <span className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                      <span>Specifications</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Overlay Detail View */}
        {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="h-14 border-b border-border px-5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/10 flex-shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Community Verification Detail</span>
                <button onClick={handleCloseDetail} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Scroll area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Photo and general status (5 cols) */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-slate-100">
                      <img src={activeReport.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                        {getStatusBadge(activeReport.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Severity</span>
                        <span className="text-xs font-black text-red-600">{activeReport.severity} / 10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Authority</span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{activeReport.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Commuter details (7 cols) */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{activeReport.title}</h3>
                      <p className="text-xs text-muted-foreground font-semibold flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{activeReport.location_name}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Analysis Summary</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {activeReport.ai_summary}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 border border-border text-xs text-slate-500 font-medium">
                      <strong>Estimated Impact:</strong> {activeReport.estimated_impact}
                    </div>
                  </div>
                </div>

                {/* Validation Actions */}
                <div className="border-t border-border pt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleUpvote(activeReport.id, e)}
                      className="inline-flex items-center gap-1 px-4.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-sm"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>Upvote Importance ({activeReport.votes})</span>
                    </button>
                    <button
                      onClick={() => alert("Verification vote registered. Thank you for validating this issue.")}
                      className="inline-flex items-center gap-1 px-4.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-foreground text-xs font-bold transition-all shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Confirm Issue Exists</span>
                    </button>
                  </div>
                  
                  <Link 
                    href={`/citizen/map?id=${activeReport.id}`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View on Live Map</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Comment feeds */}
                <div className="border-t border-border pt-5 space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Comments Feed ({activeReport.comments_count})</span>
                  </h4>

                  {/* List comments */}
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-slate-50 dark:bg-slate-800/40 border border-border rounded-lg p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                          <span>{c.author}</span>
                          <span className="text-[9px] text-muted-foreground font-medium">
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add comment */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Share a status update on this issue..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-sm"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

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

export default function GovCommunityPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userCommentAuthor, setUserCommentAuthor] = useState("Gov Admin (Operations)");

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

    // Post as Official response
    const added = db.addComment(activeReport.id, newComment, userCommentAuthor);
    setComments([...comments, added]);
    setNewComment("");

    // Sync count locally
    const updatedCount = activeReport.comments_count + 1;
    setActiveReport({
      ...activeReport,
      comments_count: updatedCount
    });

    setReports(reports.map(r => r.id === activeReport.id ? { ...r, comments_count: updatedCount } : r));
    db.getReports(); // Force sync in db layer
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

  // Mock Sentiment Parser helper for government moderation analytics
  const getCommentSentiment = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("danger") || t.includes("unsafe") || t.includes("risk") || t.includes("accident") || t.includes("injury")) {
      return { label: "🚨 Critical Hazard", class: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30" };
    }
    if (t.includes("terrible") || t.includes("worst") || t.includes("angry") || t.includes("ruin") || t.includes("broken")) {
      return { label: "⚠️ Frustrated", class: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30" };
    }
    if (t.includes("thank") || t.includes("nice") || t.includes("appreciate") || t.includes("good") || t.includes("fixed")) {
      return { label: "✨ Positive Feedback", class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" };
    }
    return { label: "💬 Informational", class: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" };
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="government" />

      {/* Content area */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
        <header className="hidden md:flex h-16 border-b border-border bg-card items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Community Moderation Board</h1>
            <p className="text-xs text-muted-foreground font-medium">Review citizen activity, track validation loops, and reply officially</p>
          </div>
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
                  <img 
                    src={report.image_url} 
                    alt={report.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-white/20 shadow-sm ${getSeverityBadgeColor(report.severity)}`}>
                      Severity {report.severity}
                    </span>
                  </div>
                </div>

                {/* Details Summary */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate max-w-[140px]">
                        {report.department}
                      </span>
                      {getStatusBadge(report.status)}
                    </div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 break-words">{report.title}</h3>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-0.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{report.location_name.split(",")[0]}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[11px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>{report.votes} upvotes</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{report.comments_count} updates</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Overlay for Comments & Moderation */}
        {activeReport && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1050] flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-3xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-card-foreground">
              {/* Modal Header */}
              <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/25">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Issue Discussion & Audit</span>
                  {getStatusBadge(activeReport.status)}
                </div>
                <button 
                  onClick={handleCloseDetail}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column (5 cols) */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border">
                      <img 
                        src={activeReport.image_url} 
                        alt={activeReport.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800";
                        }}
                      />
                    </div>

                    <div className="border border-border rounded-xl p-3.5 bg-muted/20 text-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Severity Rating</span>
                        <span className="text-xs font-black text-red-600">{activeReport.severity} / 10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Authority</span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{activeReport.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (7 cols) */}
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
                <div className="border-t border-border pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">
                      Community Upvotes: <strong className="text-foreground">{activeReport.votes}</strong>
                    </span>
                  </div>
                  
                  <Link 
                    href={`/government/map?id=${activeReport.id}`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Open in Operations Map</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Comment Feed Moderation Panel */}
                <div className="border-t border-border pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>Citizen Discussion Feed ({activeReport.comments_count})</span>
                    </h4>
                    <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                      AI Sentiment Enabled
                    </span>
                  </div>

                  {/* List comments with sentiment tags */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {comments.map((c) => {
                      const sentiment = getCommentSentiment(c.text);
                      const isOfficial = c.author.includes("Gov");
                      return (
                        <div 
                          key={c.id} 
                          className={`border rounded-lg p-3 text-xs space-y-1.5 ${
                            isOfficial 
                              ? "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200/50 dark:border-blue-900/30" 
                              : "bg-slate-50 dark:bg-slate-800/40 border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className={isOfficial ? "text-primary flex items-center gap-1" : "text-slate-700 dark:text-slate-300"}>
                              {isOfficial && <Building className="h-3 w-3" />}
                              <span>{c.author}</span>
                            </span>
                            <span className="text-[9px] text-muted-foreground font-medium">
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 dark:text-slate-400 font-medium leading-normal">{c.text}</p>
                          
                          {/* Sentiment Badge for Citizens */}
                          {!isOfficial && (
                            <div className="pt-1 flex items-center gap-1">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold ${sentiment.class}`}>
                                {sentiment.label}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                    <input 
                      type="text" 
                      placeholder="Add official government update / response..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-sm"
                    >
                      Post Reply
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

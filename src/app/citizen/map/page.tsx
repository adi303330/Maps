"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MapComponent from "@/components/MapComponent";
import { db, Report, Comment } from "@/services/db";
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  Building, 
  ArrowUp, 
  MessageSquare, 
  Check, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";

function CityMapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userCommentAuthor, setUserCommentAuthor] = useState("Jane Doe (Citizen)");

  useEffect(() => {
    // Load all reports
    const data = db.getReports();
    setReports(data);

    // Check if an ID was passed in search query
    const id = searchParams.get("id");
    if (id) {
      const found = data.find((r) => r.id === id);
      if (found) {
        setSelectedReport(found);
      }
    }
  }, [searchParams]);

  // Load comments when selected report changes
  useEffect(() => {
    if (selectedReport) {
      const list = db.getComments(selectedReport.id);
      setComments(list);
    }
  }, [selectedReport]);

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
    // Sync query string
    router.replace(`/citizen/map?id=${report.id}`);
  };

  const handleCloseDrawer = () => {
    setSelectedReport(null);
    router.replace("/citizen/map");
  };

  const handleUpvote = () => {
    if (!selectedReport) return;
    const updatedVotes = db.upvoteReport(selectedReport.id);
    setSelectedReport({
      ...selectedReport,
      votes: updatedVotes
    });
    // Refresh global list
    setReports(db.getReports());
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !newComment.trim()) return;

    const added = db.addComment(selectedReport.id, userCommentAuthor, newComment);
    setComments([...comments, added]);
    setNewComment("");

    // Update comment counts on selected report and reports list
    setSelectedReport({
      ...selectedReport,
      comments_count: selectedReport.comments_count + 1
    });
    setReports(db.getReports());
  };

  const getSeverityBadge = (score: number) => {
    let color = "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
    if (score >= 8) color = "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
    else if (score >= 5) color = "text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${color}`}>
        Severity {score}/10
      </span>
    );
  };

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Resolved":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>;
      case "In Progress":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 animate-pulse">In Progress</span>;
      case "Assigned":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">Assigned</span>;
      case "Submitted":
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Submitted</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="citizen" />

      {/* Screen container */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Full-width Map Container */}
        <div className="flex-1 h-full w-full">
          <MapComponent 
            reports={reports} 
            onReportSelect={handleReportSelect}
            selectedReport={selectedReport}
          />
        </div>

        {/* Drawer Slide-in Detail Panel */}
        <div 
          className={`absolute top-0 right-0 h-full bg-card border-l border-border shadow-2xl transition-all duration-300 z-[1001] w-full sm:w-[420px] flex flex-col ${
            selectedReport ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedReport && (
            <>
              {/* Drawer Header */}
              <div className="h-14 border-b border-border px-5 flex items-center justify-between flex-shrink-0 bg-slate-50 dark:bg-slate-800/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Report Specifications</span>
                <button 
                  onClick={handleCloseDrawer}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Visual Image */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border">
                  <img 
                    src={selectedReport.image_url} 
                    alt={selectedReport.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Coordinates */}
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-foreground leading-snug">{selectedReport.title}</h2>
                  <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{selectedReport.location_name}</span>
                  </p>
                </div>

                {/* Status Indicators row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {getStatusBadge(selectedReport.status)}
                  {getSeverityBadge(selectedReport.severity)}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-border bg-muted/40 uppercase tracking-wider text-muted-foreground">
                    {selectedReport.issue_type}
                  </span>
                </div>

                {/* Resolution Progress Timeline */}
                <div className="border-t border-border pt-5 space-y-3">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolution Status Tracker</h4>
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-center">
                    <div className={`p-1.5 rounded border ${selectedReport.status !== "Submitted" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-primary text-primary-foreground border-primary"}`}>
                      Submitted
                    </div>
                    <div className={`p-1.5 rounded border ${
                      selectedReport.status === "Assigned" ? "bg-primary text-primary-foreground border-primary" : 
                      ["In Progress", "Resolved"].includes(selectedReport.status) ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-border text-slate-400"
                    }`}>
                      Assigned
                    </div>
                    <div className={`p-1.5 rounded border ${
                      selectedReport.status === "In Progress" ? "bg-primary text-primary-foreground border-primary animate-pulse" : 
                      selectedReport.status === "Resolved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-border text-slate-400"
                    }`}>
                      In Progress
                    </div>
                    <div className={`p-1.5 rounded border ${selectedReport.status === "Resolved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-border text-slate-400"}`}>
                      Resolved
                    </div>
                  </div>
                </div>

                {/* Department and Date Row */}
                <div className="border-t border-border pt-5 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span>Authority</span>
                    </span>
                    <span className="text-xs font-bold text-foreground block truncate">{selectedReport.department}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Report Date</span>
                    </span>
                    <span className="text-xs font-bold text-foreground block">
                      {new Date(selectedReport.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* AI Summary description */}
                <div className="border-t border-border pt-5 space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Telemetry Assessment</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {selectedReport.ai_summary}
                  </p>
                  {selectedReport.estimated_impact && (
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 border border-border text-xs text-slate-500 font-medium">
                      <strong className="text-slate-700 dark:text-slate-300 font-semibold">Commuter Impact:</strong> {selectedReport.estimated_impact}
                    </div>
                  )}
                </div>

                {/* AI Verification Box (If verified/resolved) */}
                {selectedReport.verification_status && (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/60 dark:border-emerald-900/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">AI Verification Verified</span>
                      <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded">
                        {selectedReport.verification_confidence}% Conf.
                      </span>
                    </div>
                    {selectedReport.after_image && (
                      <div className="grid grid-cols-2 gap-2 pt-1.5">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Before</span>
                          <div className="aspect-video w-full rounded overflow-hidden border border-border">
                            <img src={selectedReport.before_image || selectedReport.image_url} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">After Repair</span>
                          <div className="aspect-video w-full rounded overflow-hidden border border-border">
                            <img src={selectedReport.after_image} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Community Section: Upvote, existence validation, comments list */}
                <div className="border-t border-border pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Community Validation</h4>
                    <button
                      onClick={handleUpvote}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all shadow-sm"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>Upvote Importance ({selectedReport.votes})</span>
                    </button>
                  </div>

                  {/* Existence affirmation */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-border space-y-1 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground">Confirm Existence</span>
                      <p className="text-[10px] text-muted-foreground leading-none font-medium">Affirm this problem currently exists</p>
                    </div>
                    <button 
                      onClick={() => alert("Thank you. Your confirmation has been logged for municipal tracking.")}
                      className="px-3 py-1 bg-white dark:bg-card border border-border text-foreground hover:bg-secondary rounded text-[11px] font-bold shadow-sm"
                    >
                      Yes, Active
                    </button>
                  </div>

                  {/* Comments section list */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Discussion feed ({selectedReport.comments_count})</span>
                    </h5>

                    {comments.length === 0 ? (
                      <p className="text-xs text-muted-foreground font-medium italic py-2">No comments have been posted. Start the discussion below.</p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {comments.map((c) => (
                          <div key={c.id} className="bg-muted/50 rounded-lg p-3 border border-border/60 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                              <span>{c.author}</span>
                              <span className="text-[9px] text-muted-foreground font-medium">
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                      <input 
                        type="text" 
                        placeholder="Add community update..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                      />
                      <button 
                        type="submit" 
                        className="px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-sm"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CityMapPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-muted-foreground">Loading Map Telemetry...</span>
        </div>
      </div>
    }>
      <CityMapContent />
    </Suspense>
  );
}

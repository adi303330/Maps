"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { db, Report } from "@/services/db";
import { gemini, VerificationResult } from "@/services/gemini";
import { 
  Building, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Upload, 
  Loader2, 
  ArrowRight,
  Eye,
  Check,
  X,
  FileCheck
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";

export default function GovernmentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ active: 0, resolved: 0, critical: 0, avgHrs: 0 });
  const [selectedVerifyReport, setSelectedVerifyReport] = useState<Report | null>(null);
  
  // Verification Upload State
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyPreview, setVerifyPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    const data = db.getReports();
    setReports(data);

    // Compute stats
    const active = data.filter(r => r.status !== "Resolved").length;
    const resolved = data.filter(r => r.status === "Resolved").length;
    const critical = data.filter(r => r.severity >= 8 && r.status !== "Resolved").length;
    setStats({
      active,
      resolved,
      critical,
      avgHrs: 34.5
    });
  };

  const handleStatusChange = (id: string, newStatus: Report["status"]) => {
    db.updateReportStatus(id, newStatus);
    loadData();
  };

  const calculateDaysOpen = (dateStr: string) => {
    const created = new Date(dateStr);
    const diffTime = Math.abs(Date.now() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? "Today" : `${diffDays} days`;
  };

  const handleVerifyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVerifyFile(file);
      setVerifyPreview(URL.createObjectURL(file));
      setVerificationResult(null);
      runVerification(file);
    }
  };

  const runVerification = async (file: File) => {
    if (!selectedVerifyReport) return;
    setIsVerifying(true);
    try {
      const result = await gemini.verifyResolution(
        selectedVerifyReport.image_url,
        file
      );
      setVerificationResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyResolution = () => {
    if (!selectedVerifyReport || !verificationResult || !verifyPreview) return;
    
    // Update report to Resolved with after image & confidence
    db.updateReportStatus(
      selectedVerifyReport.id,
      "Resolved",
      verifyPreview,
      verificationResult.status,
      verificationResult.confidence
    );
    
    // Close modal and reset
    setSelectedVerifyReport(null);
    setVerifyFile(null);
    setVerifyPreview(null);
    setVerificationResult(null);
    loadData();
  };

  const getSeverityBadgeColor = (severity: number) => {
    if (severity >= 8) return "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
    if (severity >= 5) return "text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
    return "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
  };

  // Chart Data preparation - dynamically count reports created on each day of the week
  const getTrendData = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    reports.forEach((r) => {
      try {
        const d = new Date(r.created_at).getDay();
        counts[d]++;
      } catch (err) {}
    });

    // Provide realistic baselines + active reports added by users
    return [
      { name: "Mon", Issues: counts[1] + 8 },
      { name: "Tue", Issues: counts[2] + 12 },
      { name: "Wed", Issues: counts[3] + 15 },
      { name: "Thu", Issues: counts[4] + 10 },
      { name: "Fri", Issues: counts[5] + 14 },
      { name: "Sat", Issues: counts[6] + 6 },
      { name: "Sun", Issues: counts[0] + 4 },
    ];
  };

  const trendData = getTrendData();

  // Distribute by department count
  const deptData = [
    { name: "Public Works", value: reports.filter(r => r.department.includes("Public Works")).length },
    { name: "Water & Sanitation", value: reports.filter(r => r.department.includes("Water")).length },
    { name: "Waste Management", value: reports.filter(r => r.department.includes("Waste")).length },
    { name: "Traffic Operations", value: reports.filter(r => r.department.includes("Traffic")).length },
  ].filter(d => d.value > 0);

  const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="government" />

      {/* Main command layout */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
        <header className="hidden md:flex h-16 border-b border-border bg-card items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Government Command Center</h1>
            <p className="text-xs text-muted-foreground font-medium">Real-time smart-city municipal operational dashboard</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
            Node: SF-DOWNTOWN-1
          </span>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1">
          {/* Top Row: General Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Active Issues</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">{stats.active}</span>
                <span className="text-xs text-amber-500 font-semibold flex items-center gap-0.5">
                  <Clock className="w-3.5 h-3.5" /> pending fix
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Resolved Issues</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">{stats.resolved}</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> verified resolved
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Critical Failures</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">{stats.critical}</span>
                <span className="text-xs text-red-600 font-semibold flex items-center gap-0.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> severity ≥ 8
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Avg Resolution Speed</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">{stats.avgHrs}h</span>
                <span className="text-xs text-muted-foreground font-semibold">dispatch to fix</span>
              </div>
            </div>
          </div>

          {/* AI Insights & Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts (2 cols) */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Infrastructure Analytics</h2>
              
              {mounted ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:h-[240px]">
                  {/* Chart 1: Issue trends */}
                  <div className="flex flex-col justify-between">
                    <span className="text-xs font-bold text-foreground">Weekly Incident Rate (Issues Reported)</span>
                    <div className="h-[200px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip />
                          <Line type="monotone" dataKey="Issues" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Distribution by department */}
                  <div className="flex flex-col justify-between">
                    <span className="text-xs font-bold text-foreground">Department Allocation Share</span>
                    <div className="h-[200px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deptData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.split(" ")[0]} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]}>
                            {deptData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
                  Initialising analytics panels...
                </div>
              )}
            </div>

            {/* AI Insights (1 col) */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">AI Operations Insights</h2>
              </div>
              <div className="space-y-3.5">
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg text-xs space-y-1">
                  <strong className="text-blue-950 dark:text-blue-300 font-bold block">Water Leakage Incline</strong>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Water leakage reports increased by <span className="text-blue-700 dark:text-blue-400 font-black">34%</span> this week. Concentrated near Mission Block pipeline lines.
                  </p>
                </div>

                <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg text-xs space-y-1">
                  <strong className="text-red-950 dark:text-red-300 font-bold block">Failure Density hotspots</strong>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Ward 8 contains <span className="text-red-700 dark:text-red-400 font-black">22%</span> of all active critical infrastructure failures. Paved lane works recommended.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-lg text-xs space-y-1">
                  <strong className="text-amber-950 dark:text-amber-300 font-bold block">Street Lighting clusters</strong>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Street lighting failures are concentrated near educational institutions in the secondary residential zones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Queue (AI Sorted Table) */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Priority Dispatch Queue</h2>
              <span className="text-[10px] text-muted-foreground font-semibold">Sorted by Severity Score & Community Upvotes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/20 border-b border-border text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Issue Details</th>
                    <th className="px-6 py-3">Responsible Department</th>
                    <th className="px-6 py-3">Severity</th>
                    <th className="px-6 py-3 text-center">Votes</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Time Open</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium text-slate-700 dark:text-slate-300">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/10">
                      {/* Image + Title */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0 border border-border">
                          <img 
                            src={report.image_url} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800";
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{report.title}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> {report.location_name.split(",")[0]}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">{report.department.split(" ")[0] || "Public Works"}</td>

                      {/* Severity */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-bold ${getSeverityBadgeColor(report.severity)}`}>
                          {report.severity}/10
                        </span>
                      </td>

                      {/* Community votes */}
                      <td className="px-6 py-4 text-center font-bold text-foreground">{report.votes}</td>

                      {/* Status select dropdown */}
                      <td className="px-6 py-4">
                        <select 
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value as any)}
                          className="text-[11px] font-bold bg-card border border-border rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      {/* Days open */}
                      <td className="px-6 py-4">{calculateDaysOpen(report.created_at)}</td>

                      {/* Verification button action */}
                      <td className="px-6 py-4 text-right">
                        {report.status !== "Resolved" ? (
                          <button
                            onClick={() => setSelectedVerifyReport(report)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary border border-primary/20 hover:border-primary px-2.5 py-1 rounded bg-primary/5 hover:bg-primary/10 transition-all"
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                            <span>Verify Fix</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resolution Verification Modal */}
        {selectedVerifyReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="h-14 border-b border-border px-5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/10 flex-shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Resolution Verification Inspection</span>
                <button 
                  onClick={() => {
                    setSelectedVerifyReport(null);
                    setVerifyFile(null);
                    setVerifyPreview(null);
                    setVerificationResult(null);
                  }} 
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Image */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Before Photo (Citizen Upload)</span>
                    <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden border border-border">
                      <img src={selectedVerifyReport.image_url} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* After Image upload */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">After Photo (Fix Work Completed)</span>
                    {verifyPreview ? (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-slate-100 relative group">
                        <img src={verifyPreview} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => {
                            setVerifyFile(null);
                            setVerifyPreview(null);
                            setVerificationResult(null);
                          }}
                          className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full p-1.5 transition-colors"
                          title="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => document.getElementById("after-upload-input")?.click()}
                        className="aspect-video w-full rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all"
                      >
                        <input 
                          type="file" 
                          id="after-upload-input" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleVerifyFileChange}
                        />
                        <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                        <span className="text-[10px] font-bold text-foreground">Upload After-Repair Photo</span>
                        <span className="text-[9px] text-muted-foreground font-semibold">Checks repair quality automatically</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Processing and Verification output block */}
                {isVerifying && (
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex items-center justify-center gap-3">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-xs text-primary font-bold">AI comparing before/after matrices...</span>
                  </div>
                )}

                {verificationResult && (
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">AI Output:</span>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                          verificationResult.status === "Resolved" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        }`}>
                          {verificationResult.status}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                        Confidence: {verificationResult.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {verificationResult.details}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="bg-slate-50 dark:bg-slate-800/10 border-t border-border px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  onClick={() => {
                    setSelectedVerifyReport(null);
                    setVerifyFile(null);
                    setVerifyPreview(null);
                    setVerificationResult(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyResolution}
                  disabled={!verificationResult || verificationResult.status !== "Resolved"}
                  className="text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve & Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

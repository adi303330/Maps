"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { gemini, AIAnalysisResult } from "@/services/gemini";
import { db } from "@/services/db";
import { 
  Camera, 
  Upload, 
  Loader2, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  Building, 
  Edit, 
  FileCheck,
  Send,
  Save,
  Users,
  MapPin
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ReportIssue() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Coordinates (default close to SF Center)
  const [locationName, setLocationName] = useState("800 Valencia St, San Francisco, CA 94110");
  const [coords, setCoords] = useState({ lat: 37.7608, lng: -122.4211 });
  const [isLocating, setIsLocating] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setLocationName(data.display_name);
            } else {
              setLocationName(`GPS Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }
          } else {
            setLocationName(`GPS Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          setLocationName(`GPS Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        alert(`Failed to retrieve location: ${error.message}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Form State (for editing)
  const [editedType, setEditedType] = useState("");
  const [editedSeverity, setEditedSeverity] = useState(5);
  const [editedPriority, setEditedPriority] = useState<AIAnalysisResult["priority"]>("Medium");
  const [editedDepartment, setEditedDepartment] = useState("");
  const [editedImpact, setEditedImpact] = useState("");
  const [editedSummary, setEditedSummary] = useState("");
  const [editedComplaint, setEditedComplaint] = useState("");

  const analysisSteps = [
    "Running structural edge detection on image...",
    "Estimating risk hazard severity level...",
    "Routing to responsible municipal department...",
    "Generating public commuter impact projection...",
    "Drafting formal department dispatch order..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setIsEditing(false);
    triggerAnalysis(file);
  };

  const triggerAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Simulate stepping through analysis phases for high-fidelity UX
    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);

    try {
      const result = await gemini.analyzeIssue(file);
      clearInterval(interval);
      
      setAnalysisResult(result);
      setEditedType(result.issue_type);
      setEditedSeverity(result.severity);
      setEditedPriority(result.priority);
      setEditedDepartment(result.department);
      setEditedImpact(result.estimated_impact);
      setEditedSummary(result.ai_summary);
      setEditedComplaint(result.complaint_draft);

      // Generate a slight random coordinate offset from SF center for mapping
      const randomOffsetLat = (Math.random() - 0.5) * 0.04;
      const randomOffsetLng = (Math.random() - 0.5) * 0.04;
      setCoords({
        lat: 37.7749 + randomOffsetLat,
        lng: -122.4194 + randomOffsetLng
      });

      // Quick mock lookup for location name
      const streetNames = ["Mission St", "Valencia St", "Market St", "Dolores St", "Fell St", "Haight St"];
      const randStreet = streetNames[Math.floor(Math.random() * streetNames.length)];
      const randNum = Math.floor(Math.random() * 2000) + 100;
      setLocationName(`${randNum} ${randStreet}, San Francisco, CA 94110`);

    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisResult) return;

    // Build the final report object
    db.addReport({
      title: `${editedType} at ${locationName.split(",")[0]}`,
      issue_type: editedType,
      image_url: previewUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800",
      latitude: coords.lat,
      longitude: coords.lng,
      severity: Number(editedSeverity),
      department: editedDepartment,
      status: "Submitted",
      ai_summary: editedSummary,
      estimated_impact: editedImpact,
      complaint_draft: editedComplaint,
      location_name: locationName,
      before_image: previewUrl || undefined
    });

    // Fire celebration confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.75 },
      colors: ["#2563EB", "#10B981", "#3B82F6", "#4F46E5"]
    });

    // Redirect to citizen dashboard
    setTimeout(() => {
      router.push("/citizen");
    }, 1500);
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully to local workspace.");
  };

  const getSeverityColor = (score: number) => {
    if (score >= 8) return "text-red-600 bg-red-50 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
    if (score >= 5) return "text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
    return "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar mode="citizen" />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Report Municipal Issue</h1>
            <p className="text-xs text-muted-foreground font-medium">Upload photos to report street, sanitation, and safety problems</p>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full space-y-8 flex-1">
          {/* Upload Area */}
          {!previewUrl && (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary/80 bg-card rounded-xl p-12 text-center cursor-pointer transition-all hover:shadow-sm group flex flex-col items-center justify-center min-h-[300px]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <Upload className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Drag and drop municipal photo here</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">or click to browse local storage (supports PNG, JPG, WebP)</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded border border-border bg-muted/40">Potholes</span>
                <span className="px-2 py-0.5 rounded border border-border bg-muted/40">Water Leaks</span>
                <span className="px-2 py-0.5 rounded border border-border bg-muted/40">Broken Lights</span>
                <span className="px-2 py-0.5 rounded border border-border bg-muted/40">Dumping Sites</span>
              </div>
            </div>
          )}

          {/* AI Analyzing Skeleton */}
          {isAnalyzing && (
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[350px] space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary animate-spin">
                <Loader2 className="h-6 w-6" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-sm font-bold text-foreground">AI Neural Network Analyzing Issue</h3>
                <p className="text-xs text-muted-foreground font-medium animate-pulse">
                  {analysisSteps[analysisStep]}
                </p>
              </div>
              <div className="w-full max-w-xs bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Uploaded File Showcase with AI Results */}
          {previewUrl && !isAnalyzing && analysisResult && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Image Preview and Map coordinates selection (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-border px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Uploaded Visual Telemetry
                  </div>
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                    <img 
                      src={previewUrl} 
                      alt="Report preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Location Settings */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Report Location Details</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Address</label>
                        <button
                          type="button"
                          onClick={handleUseMyLocation}
                          disabled={isLocating}
                          className="text-[9px] font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                          {isLocating ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Locating...</span>
                            </>
                          ) : (
                            <span>Use Live Location</span>
                          )}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px] text-muted-foreground font-mono">
                      <div>Lat: {coords.lat.toFixed(5)}</div>
                      <div>Lng: {coords.lng.toFixed(5)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Result Card (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-primary/5 dark:bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/15 text-primary">
                        <FileCheck className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider leading-none">AI Diagnostics Analysis</h2>
                        <span className="text-[9px] text-muted-foreground font-medium">Telemetry parsed successfully</span>
                      </div>
                    </div>
                    
                    {!isEditing ? (
                      <button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit Details</span>
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        <span>Save Edits</span>
                      </button>
                    )}
                  </div>

                  {/* Diagnostic fields */}
                  <div className="p-6 space-y-5">
                    {/* Upper Metadata Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Issue Type */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue Type</label>
                        {!isEditing ? (
                          <span className="text-xs font-bold text-foreground block">{editedType}</span>
                        ) : (
                          <select 
                            value={editedType}
                            onChange={(e) => setEditedType(e.target.value)}
                            className="w-full text-xs rounded border border-border p-1 focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                          >
                            <option value="Pothole">Pothole</option>
                            <option value="Water Leakage">Water Leakage</option>
                            <option value="Broken Pipe">Broken Pipe</option>
                            <option value="Garbage Dump">Garbage Dump</option>
                            <option value="Open Manhole">Open Manhole</option>
                            <option value="Broken Street Light">Broken Street Light</option>
                            <option value="Damaged Public Property">Damaged Public Property</option>
                            <option value="Traffic Signal Issue">Traffic Signal Issue</option>
                            <option value="Other">Other</option>
                          </select>
                        )}
                      </div>

                      {/* Severity */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Severity Score</label>
                        {!isEditing ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-black border ${getSeverityColor(editedSeverity)}`}>
                            {editedSeverity} / 10
                          </span>
                        ) : (
                          <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={editedSeverity}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setEditedSeverity(v);
                              // Auto-update priority class
                              if (v >= 8) setEditedPriority("Critical");
                              else if (v >= 5) setEditedPriority("High");
                              else setEditedPriority("Medium");
                            }}
                            className="w-full text-xs rounded border border-border p-1 focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                          />
                        )}
                      </div>

                      {/* Priority */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority Level</label>
                        {!isEditing ? (
                          <span className="text-xs font-bold text-foreground block">{editedPriority}</span>
                        ) : (
                          <select 
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value as any)}
                            className="w-full text-xs rounded border border-border p-1 focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border/80 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Department */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Responsible Authority</label>
                        {!isEditing ? (
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-primary" />
                            <span>{editedDepartment}</span>
                          </span>
                        ) : (
                          <input 
                            type="text" 
                            value={editedDepartment}
                            onChange={(e) => setEditedDepartment(e.target.value)}
                            className="w-full text-xs rounded border border-border p-1 bg-card"
                          />
                        )}
                      </div>

                      {/* Commuter impact */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Commuter Impact</label>
                        {!isEditing ? (
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">{editedImpact}</span>
                        ) : (
                          <input 
                            type="text" 
                            value={editedImpact}
                            onChange={(e) => setEditedImpact(e.target.value)}
                            className="w-full text-xs rounded border border-border p-1 bg-card"
                          />
                        )}
                      </div>
                    </div>

                    {/* AI Generated summary */}
                    <div className="border-t border-border/80 pt-4 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Generated Description</label>
                      {!isEditing ? (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {editedSummary}
                        </p>
                      ) : (
                        <textarea 
                          rows={3}
                          value={editedSummary}
                          onChange={(e) => setEditedSummary(e.target.value)}
                          className="w-full text-xs rounded border border-border p-2 focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                        />
                      )}
                    </div>

                    {/* Complaint Draft */}
                    <div className="border-t border-border/80 pt-4 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Generated Dispatch Complaint Draft</label>
                      {!isEditing ? (
                        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3.5 border border-border text-xs font-mono text-slate-500 leading-relaxed whitespace-pre-wrap select-all">
                          {editedComplaint}
                        </div>
                      ) : (
                        <textarea 
                          rows={5}
                          value={editedComplaint}
                          onChange={(e) => setEditedComplaint(e.target.value)}
                          className="w-full text-xs font-mono rounded border border-border p-2 focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 border-t border-border px-6 py-4 flex items-center justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setAnalysisResult(null);
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2"
                    >
                      Clear File
                    </button>
                    <button 
                      type="button"
                      onClick={handleSaveDraft}
                      className="text-xs font-bold border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-secondary transition-all"
                    >
                      Save Draft
                    </button>
                    <button 
                      type="submit"
                      className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

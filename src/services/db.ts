export interface Report {
  id: string;
  title: string;
  issue_type: string;
  image_url: string;
  latitude: number;
  longitude: number;
  severity: number; // 1-10
  department: string;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
  ai_summary: string;
  estimated_impact: string;
  complaint_draft: string;
  created_at: string;
  votes: number;
  comments_count: number;
  before_image?: string;
  after_image?: string;
  verification_status?: 'Resolved' | 'Partially Resolved' | 'Not Resolved';
  verification_confidence?: number;
  location_name: string;
}

export interface Comment {
  id: string;
  report_id: string;
  author: string;
  text: string;
  created_at: string;
}

// Center of our smart city map (San Francisco, CA)
export const MAP_CENTER: [number, number] = [37.7749, -122.4194];

const DEFAULT_REPORTS: Report[] = [
  {
    id: "rep-1",
    title: "Major Pothole on Market Street Lane 2",
    issue_type: "Pothole",
    image_url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60",
    latitude: 37.7833,
    longitude: -122.4088,
    severity: 8,
    department: "Public Works Department",
    status: "Assigned",
    location_name: "825 Market St, San Francisco, CA 94103",
    ai_summary: "Deep asphalt puncture measuring approximately 1.2m wide and 15cm deep. Poses severe hazard to cyclists and transit vehicles in the secondary lane.",
    estimated_impact: "Affects approximately 1,200 commuters daily, including municipal bus route 5.",
    complaint_draft: "TO: Director of Public Works\nSUBJECT: Emergency Road Repair - Market St\n\nI am writing to report a critical road failure at 825 Market St. A deep pothole (~1.2m x 15cm) has developed, disrupting traffic flow and creating unsafe conditions for cyclists. Action is requested to dispatch a hot-mix asphalt crew for immediate patching.",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    votes: 42,
    comments_count: 5,
    before_image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "rep-2",
    title: "Water Main Leakage with Minor Flooding",
    issue_type: "Water Leakage",
    image_url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60",
    latitude: 37.7699,
    longitude: -122.4468,
    severity: 6,
    department: "Water & Sanitation Department",
    status: "In Progress",
    location_name: "1420 Haight St, San Francisco, CA 94117",
    ai_summary: "Steady pressurized water flow escaping from joint in sub-surface pipe, surfacing near street curb. Minor pooling occurring in pedestrian crossing.",
    estimated_impact: "Affects pedestrian accessibility and wastes approx. 120 gallons of potable water per hour.",
    complaint_draft: "TO: Department of Water & Sanitation\nSUBJECT: Active Water Main Joint Leak at 1420 Haight St\n\nPlease find attached AI-analyzed telemetry regarding a pressurized sub-surface water leakage. Water is currently surfacing on the sidewalk/curb interface. Rapid isolation and valve replacement is required to mitigate roadway erosion.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    votes: 18,
    comments_count: 2,
    before_image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "rep-3",
    title: "Illegal Garbage Dumping behind Community Park",
    issue_type: "Garbage Dump",
    image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=60",
    latitude: 37.7599,
    longitude: -122.4148,
    severity: 7,
    department: "Waste Management Department",
    status: "Submitted",
    location_name: "2825 Harrison St, San Francisco, CA 94110",
    ai_summary: "Bulk accumulation of household garbage, discarded mattress, and plastics blocking the secondary park access gate. Potential vector hazard detected.",
    estimated_impact: "Restricts community green space access and impacts sanitation standards for Ward 8 families.",
    complaint_draft: "TO: Director of Environmental Services / Waste Management\nSUBJECT: Bulk Trash Dumping Report - Harrison St Park\n\nReporting illegal dumping of bulk items (furniture, plastics, organic waste) at the rear entrance of Harrison Community Park. Requesting dispatch of a heavy refuse vehicle for clearing and installation of surveillance notifications.",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    votes: 9,
    comments_count: 0,
    before_image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "rep-4",
    title: "Damaged and Flickering Street Light Grid",
    issue_type: "Broken Street Light",
    image_url: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=800&auto=format&fit=crop&q=60",
    latitude: 37.7715,
    longitude: -122.4205,
    severity: 4,
    department: "Public Works Department",
    status: "Resolved",
    location_name: "300 Valencia St, San Francisco, CA 94103",
    ai_summary: "Photocell failure on utility pole 14-B. Light remains dark during night hours or flashes intermittently, compromising street safety.",
    estimated_impact: "Diminishes illumination for pedestrians walking near night transit terminals.",
    complaint_draft: "TO: Street Lighting Division\nSUBJECT: Luminaire Failure - Pole 14-B Valencia St\n\nStreet luminaire at 300 Valencia St is non-operational. Requesting replacement of the standard high-pressure sodium bulb or photocell assembly to restore neighborhood safety corridors.",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    votes: 28,
    comments_count: 4,
    before_image: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=800&auto=format&fit=crop&q=60",
    after_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60",
    verification_status: "Resolved",
    verification_confidence: 98
  },
  {
    id: "rep-5",
    title: "Cracked Main Pipeline surfacing in Parking Zone",
    issue_type: "Broken Pipe",
    image_url: "https://images.unsplash.com/photo-1542013936693-8848e574047a?w=800&auto=format&fit=crop&q=60",
    latitude: 37.7512,
    longitude: -122.4312,
    severity: 9,
    department: "Water & Sanitation Department",
    status: "Resolved",
    location_name: "4100 24th St, San Francisco, CA 94114",
    ai_summary: "Ruptured supply line causing steady water discharge and bubbling under concrete. High severity due to sub-grade soil saturation risks.",
    estimated_impact: "Impacting commercial parking spaces and risks asphalt collapse if unsupported.",
    complaint_draft: "TO: Water Operations Command\nSUBJECT: Critical Sub-Surface Pipeline Rupture - 24th St\n\nWater supply main rupture detected. Heavy pooling and sub-surface bubbling observed. Requesting emergency shut-off, excavation, and structural sleeve installation.",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    votes: 56,
    comments_count: 8,
    before_image: "https://images.unsplash.com/photo-1542013936693-8848e574047a?w=800&auto=format&fit=crop&q=60",
    after_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60", // Repaired street
    verification_status: "Resolved",
    verification_confidence: 95
  },
  {
    id: "rep-6",
    title: "Damaged Public Bus Shelter Glass Pane",
    issue_type: "Damaged Public Property",
    image_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=60",
    latitude: 37.7942,
    longitude: -122.4019,
    severity: 5,
    department: "Public Works Department",
    status: "Submitted",
    location_name: "Financial District Transit Hub, San Francisco, CA 94111",
    ai_summary: "Tempered safety glass panel shattered on the west side of the transit shelter. Glass chunks accumulated inside the seating area.",
    estimated_impact: "Presents laceration risk for waiting transit passengers and exposes seating to environmental elements.",
    complaint_draft: "TO: Transit Maintenance Operations\nSUBJECT: Shattered Bus Shelter Glass - Financial District\n\nWest-facing tempered safety pane at Financial District bus shelter has been fully shattered. Refuse collection is required immediately, followed by standard framing and panel replacement.",
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
    votes: 2,
    comments_count: 0,
    before_image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=60"
  }
];

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: "com-1",
    report_id: "rep-1",
    author: "Jane Doe (Citizen)",
    text: "Nearly lost my front tire hitting this yesterday evening. Glad it's finally posted here.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "com-2",
    report_id: "rep-1",
    author: "Mark S. (Commuter)",
    text: "Can confirm, it's very hard to see in the rain. Stay safe everyone.",
    created_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "com-3",
    report_id: "rep-1",
    author: "DPW Dispatcher (Government)",
    text: "Assigned to Maintenance Division Crew 4. Work order #92842 has been generated.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "com-4",
    report_id: "rep-2",
    author: "Concerned Resident",
    text: "It has been running down Haight St all morning. Smells like fresh chlorine water.",
    created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "com-5",
    report_id: "rep-2",
    author: "Water Dept Inspector (Government)",
    text: "Main shut-off crew is on route. Expect minor flow reductions in the 1400 block of Haight St.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to interact with LocalStorage safely (prevent server-side crashes)
const getStoredData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Failed to read from localStorage", error);
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write to localStorage", error);
  }
};

export const db = {
  getReports(): Report[] {
    const reports = getStoredData<Report[]>("cl_reports", DEFAULT_REPORTS);
    return reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getReportById(id: string): Report | undefined {
    return this.getReports().find(r => r.id === id);
  },

  addReport(newReport: Omit<Report, "id" | "created_at" | "votes" | "comments_count">): Report {
    const reports = this.getReports();
    const createdReport: Report = {
      ...newReport,
      id: `rep-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      votes: 1,
      comments_count: 0
    };
    reports.push(createdReport);
    setStoredData("cl_reports", reports);
    
    // Add an initial notification
    this.addNotification({
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      report_id: createdReport.id,
      title: "Issue Submitted",
      message: `Your report "${createdReport.title}" has been successfully logged.`,
      status: "unread",
      created_at: new Date().toISOString()
    });

    return createdReport;
  },

  upvoteReport(id: string): number {
    const reports = this.getReports();
    const reportIndex = reports.findIndex(r => r.id === id);
    let updatedVotes = 0;
    if (reportIndex !== -1) {
      reports[reportIndex].votes += 1;
      updatedVotes = reports[reportIndex].votes;
      setStoredData("cl_reports", reports);
    }
    return updatedVotes;
  },

  getComments(reportId: string): Comment[] {
    const comments = getStoredData<Comment[]>("cl_comments", DEFAULT_COMMENTS);
    return comments
      .filter(c => c.report_id === reportId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  addComment(reportId: string, author: string, text: string): Comment {
    const comments = getStoredData<Comment[]>("cl_comments", DEFAULT_COMMENTS);
    const newComment: Comment = {
      id: `com-${Math.random().toString(36).substr(2, 9)}`,
      report_id: reportId,
      author,
      text,
      created_at: new Date().toISOString()
    };
    comments.push(newComment);
    setStoredData("cl_comments", comments);

    // Update comment count on report
    const reports = this.getReports();
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      reports[reportIndex].comments_count += 1;
      setStoredData("cl_reports", reports);
    }

    return newComment;
  },

  updateReportStatus(
    id: string,
    status: Report["status"],
    afterImage?: string,
    verificationStatus?: Report["verification_status"],
    confidence?: number
  ): void {
    const reports = this.getReports();
    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex !== -1) {
      const oldStatus = reports[reportIndex].status;
      reports[reportIndex].status = status;
      if (afterImage) reports[reportIndex].after_image = afterImage;
      if (verificationStatus) reports[reportIndex].verification_status = verificationStatus;
      if (confidence !== undefined) reports[reportIndex].verification_confidence = confidence;
      
      setStoredData("cl_reports", reports);

      // Add a status change notification
      let notifTitle = "Issue Updated";
      let notifMsg = `The issue "${reports[reportIndex].title}" has changed status to ${status}.`;

      if (status === "Assigned") {
        notifTitle = "Issue Assigned";
        notifMsg = `Your report "${reports[reportIndex].title}" has been assigned to the ${reports[reportIndex].department}.`;
      } else if (status === "In Progress") {
        notifTitle = "Issue In Progress";
        notifMsg = `Work has begun on your report "${reports[reportIndex].title}".`;
      } else if (status === "Resolved") {
        notifTitle = "Issue Resolved";
        notifMsg = `Work completed! "${reports[reportIndex].title}" has been successfully resolved.`;
      }

      this.addNotification({
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        report_id: id,
        title: notifTitle,
        message: notifMsg,
        status: "unread",
        created_at: new Date().toISOString()
      });

      if (verificationStatus) {
        this.addNotification({
          id: `notif-${Math.random().toString(36).substr(2, 9)}`,
          report_id: id,
          title: "Verification Completed",
          message: `AI compared before/after images: Verification ${verificationStatus} with ${confidence}% confidence.`,
          status: "unread",
          created_at: new Date().toISOString()
        });
      }
    }
  },

  // Notification management
  getNotifications() {
    return getStoredData<any[]>("cl_notifications", [
      {
        id: "notif-init-1",
        report_id: "rep-4",
        title: "Issue Resolved",
        message: "Work completed! 'Damaged and Flickering Street Light Grid' has been successfully resolved.",
        status: "read",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "notif-init-2",
        report_id: "rep-4",
        title: "Verification Completed",
        message: "AI compared before/after images: Verification Resolved with 98% confidence.",
        status: "read",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  },

  addNotification(notif: any) {
    const notifications = this.getNotifications();
    notifications.unshift(notif);
    setStoredData("cl_notifications", notifications);
  },

  markNotificationsRead() {
    const notifications = this.getNotifications();
    notifications.forEach(n => n.status = "read");
    setStoredData("cl_notifications", notifications);
  },

  getStats() {
    const reports = this.getReports();
    const active = reports.filter(r => r.status !== "Resolved").length;
    const resolved = reports.filter(r => r.status === "Resolved").length;
    const critical = reports.filter(r => r.severity >= 8 && r.status !== "Resolved").length;

    // Average resolution time calculation simulation (based on pre-populated mock details)
    const avgResolutionHours = 34.5; 

    return {
      active,
      resolved,
      critical,
      avgResolutionHours
    };
  }
};

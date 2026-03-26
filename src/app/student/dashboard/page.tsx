"use client";

import React, { useState } from "react";
import Link from "next/link";
import StudentSidebar from "../../components/StudentSidebar";
import { mockAssignments } from "../../data/mockData";

// ─── Static mock data ─────────────────────────────────────────────────────────

const mockStudent = {
  first_name: "Priya",
  last_name: "Sharma",
  grade_level: 10,
  section: "A",
  school_name: "EduFlow Academy",
};

const mockStats = {
  avgScore: 84.5,
  totalPublishedChapters: 12,
  quizAttempts: 8,
};

export default function StudentDashboard() {
  const [contentFilter, setContentFilter] = useState("All");
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);
  const [viewingMaterial, setViewingMaterial] = useState<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSubmit = (id: number, title: string) => {
    setSubmittedIds(prev => [...prev, id]);
    showToast(`Assignment "${title}" submitted successfully! 🚀`);
  };

  return (
    <>
      <StudentSidebar activePage="dashboard" />

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#059669", color: "white", padding: "14px 22px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(5,150,105,0.35)", display: "flex", alignItems: "center", gap: 10 }} className="animate-in slide-in-from-bottom-5">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          {toast}
        </div>
      )}

      {/* Material View Modal */}
      {viewingMaterial && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingMaterial(null)} />
          <div className="relative w-full max-w-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">📄 {viewingMaterial.title}</h3>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all" onClick={() => setViewingMaterial(null)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 text-[14px] leading-relaxed italic">
                &quot;This is a preview of the learning material. In a real environment, this would display the full PDF or digital content.&quot;
              </div>
              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100" onClick={() => setViewingMaterial(null)}>Understood</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATION SIDEBAR ─────────────────────────────── */}
      <div className={`notif-sidebar ${showNotifications ? "open" : ""}`}>
        <div className="notif-header">
          <div className="notif-title">Notifications</div>
          <button className="icon-btn" onClick={() => setShowNotifications(false)}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="notif-list">
          <div className="notif-item unread">
            <div className="notif-item-header">
              <span className="notif-category">EXAM</span>
              <span className="notif-time">10m ago</span>
            </div>
            <div className="notif-text">Final Term Mathematics schedule has been released.</div>
          </div>
          <div className="notif-item unread">
            <div className="notif-item-header">
              <span className="notif-category">ASSIGNMENT</span>
              <span className="notif-time">2h ago</span>
            </div>
            <div className="notif-text">Mrs. Gupta uploaded new practical notes for Physics Lab.</div>
          </div>
          <div className="notif-item">
            <div className="notif-item-header">
              <span className="notif-category">SYSTEM</span>
              <span className="notif-time">Yesterday</span>
            </div>
            <div className="notif-text">Your leave request for May 4th has been approved.</div>
          </div>
        </div>
      </div>

      {/* ── MAIN ──────────────────────────────────────────────── */}
      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Welcome back, {mockStudent.first_name} 👋</div>
            <h1>Student Dashboard</h1>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" onClick={() => setShowNotifications(true)}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <div className="notif-dot" style={{ background: "#059669" }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="stat-value">{mockStats.avgScore.toFixed(1)}%</div>
            <div className="stat-label">Average Score</div>
            <span className="stat-badge green">Quiz Performance</span>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div className="stat-value">{mockStats.totalPublishedChapters}</div>
            <div className="stat-label">Published Chapters</div>
            <div className="progress-bar mt-2">
              <div className="progress-fill fill-blue" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div className="stat-value">{mockStats.quizAttempts}</div>
            <div className="stat-label">Quiz Attempts</div>
            <span className="stat-badge orange">Total Completed</span>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div className="stat-value">Grade {mockStudent.grade_level}</div>
            <div className="stat-label">Current Class</div>
            <span className="stat-badge purple">Section {mockStudent.section}</span>
          </div>
        </div>

        {/* Middle row: Schedule */}
        <div className="bottom-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Schedule</div>
                <div className="card-subtitle">Upcoming classes</div>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time"><div className="sch-time-value">9:00</div><div className="sch-time-ampm">AM</div></div>
              <div className="sch-dot-col"><div className="sch-dot filled" style={{ borderColor: "#059669", background: "#059669" }} /><div className="sch-line" /></div>
              <div className="sch-body"><div className="sch-title">Mathematics</div><div className="sch-detail">Mr. Sharma</div><span className="tag ongoing" style={{ color: "#059669", background: "#D1FAE5" }}>NOW</span></div>
            </div>
            <div className="schedule-item">
              <div className="sch-time"><div className="sch-time-value">10:30</div><div className="sch-time-ampm">AM</div></div>
              <div className="sch-dot-col"><div className="sch-dot outline" /><div className="sch-line" /></div>
              <div className="sch-body"><div className="sch-title">Physics Lab</div><div className="sch-detail">Mrs. Gupta</div><span className="tag upcoming">UPCOMING</span></div>
            </div>
            <div className="schedule-item">
              <div className="sch-time"><div className="sch-time-value">1:00</div><div className="sch-time-ampm">PM</div></div>
              <div className="sch-dot-col"><div className="sch-dot outline" /><div className="sch-line" /></div>
              <div className="sch-body"><div className="sch-title">English Literature</div><div className="sch-detail">Ms. Davis</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Requests & Status</div>
                <div className="card-subtitle">Activity and approval tracker</div>
              </div>
              <button className="btn-primary" style={{ padding: "6px 12px", fontSize: "11px" }}>+ New</button>
            </div>
            <div style={{ padding: "8px 0" }}>
              <div className="class-row" style={{ border: "none", padding: "12px 20px" }}>
                <div className="stat-icon gray" style={{ width: "32px", height: "32px", background: "var(--amber-light)", color: "var(--amber)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>Coding Club Join Request</div>
                  <div style={{ fontSize: "11px", color: "var(--text-meta)", marginTop: "2px" }}>Submitted on March 18</div>
                </div>
                <span style={{ fontSize: "10px", background: "var(--amber-light)", color: "var(--amber)", padding: "4px 8px", borderRadius: "12px", fontWeight: 700 }}>PENDING</span>
              </div>
              <div className="class-row" style={{ borderTop: "1px solid var(--border)", padding: "12px 20px" }}>
                <div className="stat-icon green" style={{ width: "32px", height: "32px", background: "var(--green-light)", color: "var(--green-dark)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>Leave of Absence (May 4)</div>
                  <div style={{ fontSize: "11px", color: "var(--text-meta)", marginTop: "2px" }}>Approved by Principal</div>
                </div>
                <span style={{ fontSize: "10px", background: "var(--green-light)", color: "var(--green-dark)", padding: "4px 8px", borderRadius: "12px", fontWeight: 700 }}>APPROVED</span>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
              <Link href="#" style={{ fontSize: "12px", fontWeight: 600, color: "var(--blue)", textDecoration: "none" }}>View All Requests</Link>
            </div>
          </div>
        </div>

        {/* Lower row */}
        <div className="lower-grid">
          {/* Learning Materials — with assignment descriptions */}
          <div className="card w-full max-w-[1200px] mx-auto" style={{ gridColumn: "span 2" }}>
            <div className="card-header px-6 sm:px-8">
              <div>
                <div className="card-title">Learning Materials</div>
                <div className="card-subtitle">Assignments & published content</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["All", "Notes", "Assignments"].map(f => (
                  <button key={f} onClick={() => setContentFilter(f)} style={{
                    padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    border: "1.5px solid", borderColor: contentFilter === f ? "#059669" : "#E5E7EB",
                    background: contentFilter === f ? "#D1FAE5" : "white",
                    color: contentFilter === f ? "#059669" : "#6B7280", transition: "all 0.2s",
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {(contentFilter === "All" || contentFilter === "Notes") && (
              <div className="class-row px-6 sm:px-8" style={{ padding: "16px 32px", borderBottom: "1px solid #F3F4F6" }}>
                <div className="stat-icon blue" style={{ width: "40px", height: "40px" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </div>
                <div className="class-info">
                  <div className="class-name" style={{ fontSize: "14px" }}>Newton&apos;s Laws Slides</div>
                  <div className="class-meta">Chapter 6 · PDF Notes · Physics</div>
                </div>
                <button 
                  className="btn-outline" 
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => setViewingMaterial({ title: "Newton's Laws Slides" })}
                >
                  View
                </button>
              </div>
            )}

            {(contentFilter === "All" || contentFilter === "Assignments") && mockAssignments.map(a => (
              <div key={a.id} className="class-row px-6 sm:px-8" style={{ padding: "16px 32px", borderBottom: "1px solid #F3F4F6" }}>
                <div className="stat-icon orange" style={{ width: "40px", height: "40px" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                </div>
                <div className="class-info" style={{ flex: 1 }}>
                  <div className="class-name" style={{ fontSize: "14px" }}>{a.title}</div>
                  <div className="class-meta">{a.subject} · Due {a.dueDate}</div>
                  {a.description && (
                    <div style={{ fontSize: "12px", color: "var(--text-meta)", marginTop: "4px", fontStyle: "italic" }}>
                      {a.description}
                    </div>
                  )}
                </div>
                {submittedIds.includes(a.id) ? (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669", background: "#D1FAE5", padding: "6px 12px", borderRadius: "12px" }}>✓ Submitted</span>
                ) : (
                  <button 
                    className="btn-primary" 
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                    onClick={() => handleSubmit(a.id, a.title)}
                  >
                    Submit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

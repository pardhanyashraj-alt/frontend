"use client";

import { useState } from "react";
import Link from "next/link";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";

const recentSchools = [
  { name: "EduFlow Academy, Noida", admin: "Dr. Rajendra Kumar", date: "Mar 18, 2026", plan: "Pro", status: "Active" },
  { name: "Greenfield Public School, Lucknow", admin: "Mrs. Kavita Nair", date: "Mar 15, 2026", plan: "Basic", status: "Active" },
  { name: "St. Mary's Convent, Dehradun", admin: "Fr. Thomas", date: "Mar 10, 2026", plan: "Enterprise", status: "Active" },
];

const recentUploads = [
  { book: "NCERT Mathematics Class 10", chapter: "Ch 8: Trigonometry", date: "Mar 19, 2026", status: "Processed" },
  { book: "NCERT Science Class 9", chapter: "Ch 5: The Fundamental Unit of Life", date: "Mar 17, 2026", status: "Processed" },
  { book: "NCERT English Class 10", chapter: "Ch 2: Nelson Mandela", date: "Mar 16, 2026", status: "Processing" },
];

export default function SuperAdminDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <SuperAdminSidebar activePage="dashboard" />

      {/* Notification Sidebar */}
      <div className={`notif-sidebar ${showNotifications ? 'open' : ''}`}>
        <div className="notif-header">
          <div className="notif-title">System Alerts</div>
          <button className="icon-btn" onClick={() => setShowNotifications(false)}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="notif-list">
          <div className="notif-item unread">
            <div className="notif-item-header"><span className="notif-category">REVENUE</span><span className="notif-time">2h ago</span></div>
            <div className="notif-text">Monthly recurring revenue crossed ₹1.2L milestone.</div>
          </div>
          <div className="notif-item unread">
            <div className="notif-item-header"><span className="notif-category">SCHOOL</span><span className="notif-time">5h ago</span></div>
            <div className="notif-text">Greenfield Public School subscription upgraded to Pro plan.</div>
          </div>
          <div className="notif-item">
            <div className="notif-item-header"><span className="notif-category">CONTENT</span><span className="notif-time">1d ago</span></div>
            <div className="notif-text">AI processing completed for 3 NCERT chapters.</div>
          </div>
          <div className="notif-item">
            <div className="notif-item-header"><span className="notif-category">SYSTEM</span><span className="notif-time">2d ago</span></div>
            <div className="notif-text">Platform uptime: 99.97% this month. No incidents.</div>
          </div>
        </div>
      </div>

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Welcome back, Platform Owner 🛡️</div>
            <h1>Super Admin Console</h1>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" onClick={() => setShowNotifications(true)}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <div className="notif-dot" style={{ background: '#1E40AF' }}></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/><path d="M9 21V12h6v9"/></svg>
            </div>
            <div className="stat-value">12</div>
            <div className="stat-label">Registered Schools</div>
            <span className="stat-badge green">↑ 3 THIS MONTH</span>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-label">Active Admins</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <div className="stat-value">₹1.2L</div>
            <div className="stat-label">Monthly Revenue</div>
            <span className="stat-badge green">↑ 18% MoM</span>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            </div>
            <div className="stat-value">47</div>
            <div className="stat-label">Chapters Processed</div>
            <span className="stat-badge green">AI CONTENT</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Register School', href: '/superadmin/schools', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/><path d="M9 21V12h6v9"/></svg>, color: '#1E40AF' },
            { label: 'Upload Content', href: '/superadmin/content', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, color: '#059669' },
            { label: 'Manage Admins', href: '/superadmin/admins', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>, color: '#7C3AED' },
          ].map((action, i) => (
            <Link key={i} href={action.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '14px', background: 'var(--card-bg)', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-primary)', transition: 'all 0.2s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${action.color}15`, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{action.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{action.label}</div>
            </Link>
          ))}
        </div>

        {/* Tables */}
        <div className="bottom-grid">
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Recent Schools</div><div className="card-subtitle">Latest registered institutions</div></div>
              <Link href="/superadmin/schools" className="btn-outline" style={{ textDecoration:'none', fontSize:'12px' }}>View All</Link>
            </div>
            {recentSchools.map((school, i) => (
              <div className="class-row" key={i}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1E40AF" strokeWidth="2"><path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/></svg>
                </div>
                <div className="class-info">
                  <div className="class-name" style={{ fontSize: '13px' }}>{school.name}</div>
                  <div className="class-meta">{school.admin} · {school.plan} · {school.date}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green-dark)', background: 'var(--green-light)', padding: '4px 8px', borderRadius: '6px' }}>{school.status}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <div><div className="card-title">AI Content Pipeline</div><div className="card-subtitle">Recent chapter uploads</div></div>
              <Link href="/superadmin/content" className="btn-outline" style={{ textDecoration:'none', fontSize:'12px' }}>View All</Link>
            </div>
            {recentUploads.map((up, i) => (
              <div className="class-row" key={i}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: up.status === 'Processed' ? 'var(--green-light)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {up.status === 'Processed' ?
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--green-dark)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> :
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  }
                </div>
                <div className="class-info">
                  <div className="class-name" style={{ fontSize: '13px' }}>{up.chapter}</div>
                  <div className="class-meta">{up.book} · {up.date}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: up.status === 'Processed' ? 'var(--green-dark)' : '#D97706', background: up.status === 'Processed' ? 'var(--green-light)' : '#FEF3C7', padding: '4px 8px', borderRadius: '6px' }}>{up.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

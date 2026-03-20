"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "../../components/AdminSidebar";

const pendingApprovals = [
  { id: 1, type: "Class Test", from: "Ms. Rita Sharma", subject: "Mathematics — Grade 10", date: "Mar 19, 2026", priority: "Medium" },
  { id: 2, type: "Purchase", from: "Mr. Khanna (Admin Staff)", subject: "Lab Equipment — ₹45,000", date: "Mar 18, 2026", priority: "High" },
  { id: 3, type: "Leave", from: "Mrs. Sunita Gupta", subject: "Personal Leave — Mar 25-27", date: "Mar 17, 2026", priority: "Low" },
  { id: 4, type: "Class Test", from: "Mr. David Wilson", subject: "English Lit — Grade 11", date: "Mar 17, 2026", priority: "Medium" },
];

const recentActivity = [
  { icon: "👩‍🏫", text: "Ms. Priya Mehta joined as History teacher", time: "2h ago", color: "var(--purple)" },
  { icon: "🎓", text: "12 new students enrolled in Grade 9", time: "5h ago", color: "var(--green)" },
  { icon: "📋", text: "Final Term exam schedule published", time: "1d ago", color: "var(--blue)" },
  { icon: "💰", text: "March salary processed for 24 teachers", time: "2d ago", color: "var(--orange)" },
  { icon: "⚠️", text: "New complaint from Rohan Mehta (Student)", time: "2d ago", color: "var(--red)" },
];

export default function AdminDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <AdminSidebar activePage="dashboard" />

      {/* Notification Sidebar */}
      <div className={`notif-sidebar ${showNotifications ? 'open' : ''}`}>
        <div className="notif-header">
          <div className="notif-title">Notifications</div>
          <button className="icon-btn" onClick={() => setShowNotifications(false)}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="notif-list">
          <div className="notif-item unread">
            <div className="notif-item-header">
              <span className="notif-category">APPROVAL</span>
              <span className="notif-time">5m ago</span>
            </div>
            <div className="notif-text">Ms. Rita Sharma requested approval for Grade 10 Mathematics class test.</div>
          </div>
          <div className="notif-item unread">
            <div className="notif-item-header">
              <span className="notif-category">FINANCE</span>
              <span className="notif-time">1h ago</span>
            </div>
            <div className="notif-text">Fee collection for March is 78% complete. 264 payments pending.</div>
          </div>
          <div className="notif-item">
            <div className="notif-item-header">
              <span className="notif-category">COMPLAINT</span>
              <span className="notif-time">Yesterday</span>
            </div>
            <div className="notif-text">New complaint filed by Mrs. Gupta regarding lab equipment shortage.</div>
          </div>
          <div className="notif-item">
            <div className="notif-item-header">
              <span className="notif-category">SYSTEM</span>
              <span className="notif-time">2 days ago</span>
            </div>
            <div className="notif-text">Your subscription renews on April 1, 2026. Current plan: Pro.</div>
          </div>
        </div>
      </div>

      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Good morning, Administrator 👋</div>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" onClick={() => setShowNotifications(true)}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <div className="notif-dot" style={{ background: 'var(--purple)' }}></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="stat-value">1,247</div>
            <div className="stat-label">Total Students</div>
            <span className="stat-badge green">↑ 42 THIS MONTH</span>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-label">Total Teachers</div>
            <span className="stat-badge green">↑ 2 NEW HIRES</span>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div className="stat-value">₹8.4L</div>
            <div className="stat-label">Revenue This Month</div>
            <span className="stat-badge green">↑ 12% VS LAST</span>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-value">7</div>
            <div className="stat-label">Pending Approvals</div>
            <span className="stat-badge orange">NEEDS ACTION</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Add Teacher', href: '/admin/teachers', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>, color: 'var(--purple)' },
            { label: 'Add Student', href: '/admin/students', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, color: 'var(--blue)' },
            { label: 'Create Exam', href: '/admin/exams', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, color: 'var(--green-dark)' },
            { label: 'View Finance', href: '/admin/finance', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, color: 'var(--orange)' },
          ].map((action, i) => (
            <Link key={i} href={action.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px 20px', borderRadius: '14px',
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              textDecoration: 'none', color: 'var(--text-primary)',
              transition: 'all 0.2s', cursor: 'pointer',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${action.color}15`, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {action.icon}
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{action.label}</div>
            </Link>
          ))}
        </div>

        {/* Approvals + Activity */}
        <div className="bottom-grid">
          {/* Pending Approvals */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Pending Approvals</div>
                <div className="card-subtitle">Requests awaiting your action</div>
              </div>
              <Link href="/admin/approvals" className="btn-outline" style={{ textDecoration: 'none', fontSize: '12px' }}>View All</Link>
            </div>
            {pendingApprovals.map(item => (
              <div className="class-row" key={item.id}>
                <div className="stat-icon" style={{
                  width: '36px', height: '36px',
                  background: item.type === 'Class Test' ? 'var(--blue-light)' : item.type === 'Purchase' ? 'var(--orange-light)' : 'var(--green-light)',
                  color: item.type === 'Class Test' ? 'var(--blue)' : item.type === 'Purchase' ? 'var(--orange)' : 'var(--green-dark)',
                }}>
                  {item.type === 'Class Test' && <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  {item.type === 'Purchase' && <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
                  {item.type === 'Leave' && <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>}
                </div>
                <div className="class-info">
                  <div className="class-name" style={{ fontSize: '13px' }}>{item.subject}</div>
                  <div className="class-meta">{item.from} · {item.date}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '11px', background: 'var(--green-dark)', boxShadow: 'none' }}>Approve</button>
                  <button className="btn-outline" style={{ padding: '5px 10px', fontSize: '11px', color: 'var(--red)', borderColor: 'var(--red)' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Recent Activity</div>
                <div className="card-subtitle">Latest institution events</div>
              </div>
            </div>
            {recentActivity.map((item, i) => (
              <div className="class-row" key={i}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div className="class-info">
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.text}</div>
                  <div className="class-meta">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import StudentSidebar from '../../components/StudentSidebar';

export default function StudentDashboard() {
  const [contentFilter, setContentFilter] = useState('All');

  return (
    <>
      <StudentSidebar activePage="dashboard" />

      {/* ── MAIN ──────────────────────────────────────────────── */}
      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Welcome back, Aryan 👋</div>
            <h1>Student Dashboard</h1>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search courses, materials…" />
            </div>
            <div className="icon-btn">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <div className="notif-dot" style={{ background: '#059669' }}></div>
            </div>
          </div>
        </div>

        {/* 1. Academic Overview (Stats) */}
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stat-value">A-</div>
            <div className="stat-label">Overall Average</div>
            <span className="stat-badge green">Top 15%</span>
          </div>
          
          {/* 7. My Attendance */}
          <div className="stat-card blue">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="stat-value">92%</div>
            <div className="stat-label">Attendance Rate</div>
            <div className="progress-bar mt-2">
               <div className="progress-fill fill-blue" style={{ width: "92%" }}></div>
            </div>
          </div>

          {/* 2. Pending Requests Panel (Summary) */}
          <div className="stat-card orange">
            <div className="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-value">2</div>
            <div className="stat-label">Pending Assignments</div>
            <span className="stat-badge orange">Due this week</span>
          </div>
          
          <div className="stat-card purple">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-value">12h</div>
            <div className="stat-label">Study Hours</div>
            <span className="stat-badge purple">This week</span>
          </div>
        </div>

        {/* Middle row */}
        <div className="bottom-grid">
          {/* 1. Enrolled Classes */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Enrolled Classes</div>
                <div className="card-subtitle">Your active courses</div>
              </div>
              <button className="btn-outline">All Classes</button>
            </div>

            <div className="class-row">
              <div className="class-icon avatar ma">MA</div>
              <div className="class-info">
                <div className="class-name">Mathematics</div>
                <div className="class-meta">Mr. Sharma · Module 4/10</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="progress-section" style={{ minWidth: '100px' }}>
                  <div className="progress-label">PROGRESS <span className="progress-pct">40%</span></div>
                  <div className="progress-bar">
                    <div className="progress-fill fill-blue" style={{ width: "40%" }}></div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Open</button>
              </div>
            </div>

            <div className="class-row">
              <div className="class-icon avatar sc">SC</div>
              <div className="class-info">
                <div className="class-name">Science</div>
                <div className="class-meta">Mrs. Gupta · Module 6/8</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="progress-section" style={{ minWidth: '100px' }}>
                  <div className="progress-label">PROGRESS <span className="progress-pct">75%</span></div>
                  <div className="progress-bar">
                    <div className="progress-fill fill-orange" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Open</button>
              </div>
            </div>

            <div className="class-row">
              <div className="class-icon avatar en">EN</div>
              <div className="class-info">
                <div className="class-name">English Lit</div>
                <div className="class-meta">Ms. Davis · Module 2/5</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="progress-section" style={{ minWidth: '100px' }}>
                  <div className="progress-label">PROGRESS <span className="progress-pct">40%</span></div>
                  <div className="progress-bar">
                    <div className="progress-fill fill-green" style={{ width: "40%" }}></div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Open</button>
              </div>
            </div>
          </div>

          {/* 8. Class Schedule */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Schedule</div>
                <div className="card-subtitle">Upcoming classes</div>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">
                <div className="sch-time-value">9:00</div>
                <div className="sch-time-ampm">AM</div>
              </div>
              <div className="sch-dot-col">
                <div className="sch-dot filled" style={{ borderColor: '#059669', background: '#059669' }}></div>
                <div className="sch-line"></div>
              </div>
              <div className="sch-body">
                <div className="sch-title">Mathematics</div>
                <div className="sch-detail">Room 204 · Mr. Sharma</div>
                <span className="tag ongoing" style={{ color: '#059669', background: '#D1FAE5' }}>NOW</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">
                <div className="sch-time-value">10:30</div>
                <div className="sch-time-ampm">AM</div>
              </div>
              <div className="sch-dot-col">
                <div className="sch-dot outline"></div>
                <div className="sch-line"></div>
              </div>
              <div className="sch-body">
                <div className="sch-title">Physics Lab</div>
                <div className="sch-detail">Lab 3 · Mrs. Gupta</div>
                <span className="tag upcoming">UPCOMING</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">
                <div className="sch-time-value">1:00</div>
                <div className="sch-time-ampm">PM</div>
              </div>
              <div className="sch-dot-col">
                <div className="sch-dot outline"></div>
                <div className="sch-line"></div>
              </div>
              <div className="sch-body">
                <div className="sch-title">English Literature</div>
                <div className="sch-detail">Room 108 · Ms. Davis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower row */}
        <div className="lower-grid">
          
          {/* 3. Chapter List Viewer & 4. Content Hub w/ Filter & 5. New Badges */}
          <div className="card w-full max-w-[1200px] mx-auto" style={{ gridColumn: 'span 2' }}>
            <div className="card-header px-6 sm:px-8">
              <div>
                <div className="card-title">Learning Materials</div>
                <div className="card-subtitle">Recent uploads and chapters</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Notes', 'Assignments'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setContentFilter(f)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1.5px solid',
                      borderColor: contentFilter === f ? '#059669' : '#E5E7EB',
                      background: contentFilter === f ? '#D1FAE5' : 'white',
                      color: contentFilter === f ? '#059669' : '#6B7280',
                      transition: 'all 0.2s',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            


            {(contentFilter === 'All' || contentFilter === 'Notes') && (
              <div className="class-row px-6 sm:px-8" style={{ padding: '16px 32px', borderBottom: '1px solid #F3F4F6' }}>
                <div className="stat-icon blue" style={{ width: '40px', height: '40px' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </div>
                <div className="class-info">
                  <div className="class-name" style={{ fontSize: '14px' }}>Newton&apos;s Laws Slides</div>
                  <div className="class-meta">Chapter 6 · PDF Notes</div>
                </div>
                <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>View</button>
              </div>
            )}

            {(contentFilter === 'All' || contentFilter === 'Assignments') && (
              <div className="class-row px-6 sm:px-8" style={{ padding: '16px 32px' }}>
                <div className="stat-icon orange" style={{ width: '40px', height: '40px' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                </div>
                <div className="class-info">
                  <div className="class-name" style={{ fontSize: '14px' }}>Literature Essay Draft</div>
                  <div className="class-meta">Chapter 2 · Assignment · Due in 2 days</div>
                </div>
                <button className="btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>Submit</button>
              </div>
            )}
          </div>

          {/* 2. Pending Requests & 6. History */}
          <div className="card">
            <div className="card-header assign-header">
              <div>
                <div className="card-title">My Requests & Status</div>
                <div className="card-subtitle">Updates on your activity</div>
              </div>
            </div>
            
            <div className="assign-row" style={{ padding: '12px 0' }}>
              <div className="stat-icon gray" style={{ width: '36px', height: '36px', background: '#F3F4F6' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div style={{ flexGrow: 1 }}>
                <div className="assign-title">Coding Club Join Request</div>
                <div className="assign-sub" style={{ marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '20px', fontWeight: 600 }}>PENDING</span>
                </div>
              </div>
            </div>

            <div className="assign-row" style={{ padding: '12px 0' }}>
              <div className="stat-icon green" style={{ width: '36px', height: '36px', background: '#D1FAE5' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div style={{ flexGrow: 1 }}>
                <div className="assign-title">Leave of Absence (May 4)</div>
                <div className="assign-sub" style={{ marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', background: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '20px', fontWeight: 600 }}>APPROVED</span>
                </div>
              </div>
            </div>

            <div className="assign-row" style={{ padding: '12px 0' }}>
              <div style={{ flexGrow: 1 }}>
                <div className="assign-title">Previous Term: Fall 2025</div>
                <div className="assign-sub">GPA: 3.8 · 5 Courses Completed</div>
              </div>
              <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 10px' }}>Record</button>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

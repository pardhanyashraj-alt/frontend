"use client";

import Sidebar from "../../components/Sidebar";

export default function Home() {
  return (
    <>
      <Sidebar activePage="dashboard" />

      {/* ── MAIN ──────────────────────────────────────────────── */}
      <main className="main">

        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Good morning, Rita 👋</div>
            <h1>Teacher Dashboard</h1>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search students, classes…" />
            </div>
            <div className="icon-btn">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <div className="notif-dot"></div>
            </div>
            <button className="btn-primary">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Class
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className="stat-value">142</div>
            <div className="stat-label">Total Students</div>
            <span className="stat-badge green">↑ 8 THIS WEEK</span>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </div>
            <div className="stat-value">6</div>
            <div className="stat-label">Active Classes</div>
            <span className="stat-badge green">↑ 1 NEW CLASS</span>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stat-value">87%</div>
            <div className="stat-label">Avg. Attendance</div>
            <span className="stat-badge green">↑ 3% VS LAST MONTH</span>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-label">Pending Grades</div>
            <span className="stat-badge orange">↑ 5 NEW SUBMISSIONS</span>
          </div>
        </div>

        {/* Classes + Schedule */}
        <div className="bottom-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Classes</div>
                <div className="card-subtitle">Curriculum progress this term</div>
              </div>
              <button className="btn-outline">View All</button>
            </div>
            <div className="class-row">
              <div className="class-icon avatar ma">MA</div>
              <div className="class-info">
                <div className="class-name">Mathematics — Grade 10</div>
                <div className="class-meta">38 students · Mon, Wed, Fri · Room 204</div>
              </div>
              <div className="progress-section">
                <div className="progress-label">PROGRESS <span className="progress-pct">72%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill fill-blue" style={{ width: "72%" }}></div>
                </div>
              </div>
            </div>
            <div className="class-row">
              <div className="class-icon avatar sc">SC</div>
              <div className="class-info">
                <div className="class-name">Science — Grade 9</div>
                <div className="class-meta">34 students · Tue, Thu · Lab B</div>
              </div>
              <div className="progress-section">
                <div className="progress-label">PROGRESS <span className="progress-pct">58%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill fill-orange" style={{ width: "58%" }}></div>
                </div>
              </div>
            </div>
            <div className="class-row">
              <div className="class-icon avatar en">EN</div>
              <div className="class-info">
                <div className="class-name">English Lit — Grade 11</div>
                <div className="class-meta">30 students · Mon, Thu · Room 108</div>
              </div>
              <div className="progress-section">
                <div className="progress-label">PROGRESS <span className="progress-pct">84%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill fill-green" style={{ width: "84%" }}></div>
                </div>
              </div>
            </div>
            <div className="class-row">
              <div className="class-icon avatar hi">HI</div>
              <div className="class-info">
                <div className="class-name">History — Grade 8</div>
                <div className="class-meta">40 students · Wed, Fri · Room 301</div>
              </div>
              <div className="progress-section">
                <div className="progress-label">PROGRESS <span className="progress-pct">45%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill fill-purple" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Today&apos;s Schedule</div>
                <div className="card-subtitle">Monday, March 2</div>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">
                <div className="sch-time-value">8:30</div>
                <div className="sch-time-ampm">AM</div>
              </div>
              <div className="sch-dot-col">
                <div className="sch-dot filled"></div>
                <div className="sch-line"></div>
              </div>
              <div className="sch-body">
                <div className="sch-title">Mathematics — Grade 10</div>
                <div className="sch-detail">Room 204 · 45 min</div>
                <span className="tag ongoing">ONGOING</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">
                <div className="sch-time-value">10:00</div>
                <div className="sch-time-ampm">AM</div>
              </div>
              <div className="sch-dot-col">
                <div className="sch-dot outline"></div>
                <div className="sch-line"></div>
              </div>
              <div className="sch-body">
                <div className="sch-title">Staff Meeting</div>
                <div className="sch-detail">Conference Room · 1hr</div>
                <span className="tag meeting">MEETING</span>
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
                <div className="sch-title">English Lit — Grade 11</div>
                <div className="sch-detail">Room 108 · 45 min</div>
                <span className="tag upcoming">UPCOMING</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">
                <div className="sch-time-value">3:15</div>
                <div className="sch-time-ampm">PM</div>
              </div>
              <div className="sch-dot-col">
                <div className="sch-dot outline"></div>
              </div>
              <div className="sch-body">
                <div className="sch-title">Parent-Teacher Call</div>
                <div className="sch-detail">Regarding Aryan S.</div>
                <span className="tag alert">ALERT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower row */}
        <div className="lower-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Top Students</div>
                <div className="card-subtitle">By overall score this term</div>
              </div>
            </div>
            <div className="student-row">
              <div className="avatar ak">AK</div>
              <div className="student-name">Anjali Kapoor</div>
              <div className="student-score">97%</div>
            </div>
            <div className="student-row">
              <div className="avatar rm">RM</div>
              <div className="student-name">Rohan Mehta</div>
              <div className="student-score">94%</div>
            </div>
            <div className="student-row">
              <div className="avatar sm" style={{ background: "var(--purple)" }}>SM</div>
              <div className="student-name">Shreya Mishra</div>
              <div className="student-score">92%</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Weekly Attendance</div>
                <div className="card-subtitle">Students present per day</div>
              </div>
            </div>
            <div className="chart-area">
              <div className="chart-bars">
                <div className="bar-col">
                  <div className="bar normal" style={{ height: "78px" }}></div>
                  <div className="bar-label">MON</div>
                </div>
                <div className="bar-col">
                  <div className="bar normal" style={{ height: "65px" }}></div>
                  <div className="bar-label">TUE</div>
                </div>
                <div className="bar-col">
                  <div className="bar normal" style={{ height: "72px" }}></div>
                  <div className="bar-label">WED</div>
                </div>
                <div className="bar-col">
                  <div className="bar highlight" style={{ height: "90px" }}></div>
                  <div className="bar-label">THU</div>
                </div>
                <div className="bar-col">
                  <div className="bar normal" style={{ height: "55px" }}></div>
                  <div className="bar-label">FRI</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header assign-header">
              <div>
                <div className="card-title">Assignments</div>
                <div className="card-subtitle">Due this week</div>
              </div>
              <span className="pending-badge">5 pending</span>
            </div>
            <div className="assign-row">
              <div className="checkbox checked">
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="assign-title done">Algebra Chapter 5 Quiz</div>
                <div className="assign-sub">Grade 10 · Submitted</div>
              </div>
            </div>
            <div className="assign-row">
              <div className="checkbox"></div>
              <div>
                <div className="assign-title">Poetry Analysis Essay</div>
                <div className="assign-sub due">Due Tomorrow · Grade 11</div>
              </div>
            </div>
            <div className="assign-row">
              <div className="checkbox"></div>
              <div>
                <div className="assign-title">History Chapter 7 Test</div>
                <div className="assign-sub">Due Friday · Grade 8</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

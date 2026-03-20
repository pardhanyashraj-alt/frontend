"use client";

import Link from "next/link";
import StudentSidebar from "../../components/StudentSidebar";


const studentClasses = [
  {
    id: 1,
    name: "Mathematics",
    teacher: "Mr. Sharma",
    initials: "MA",
    color: "var(--blue)",
    schedule: "Mon, Wed, Fri · Room 204",
    progress: 72,
    module: "Module 6: Calculus Basics",
    students: 38
  },
  {
    id: 2,
    name: "Science",
    teacher: "Mrs. Gupta",
    initials: "SC",
    color: "var(--orange)",
    schedule: "Tue, Thu · Lab B",
    progress: 58,
    module: "Module 4: Chemical Bonding",
    students: 34
  },
  {
    id: 3,
    name: "English Lit",
    teacher: "Ms. Davis",
    initials: "EN",
    color: "var(--green)",
    schedule: "Mon, Thu · Room 108",
    progress: 84,
    module: "Module 8: Shakespearean Tragedy",
    students: 30
  },
  {
    id: 4,
    name: "History",
    teacher: "Mr. Verma",
    initials: "HI",
    color: "var(--purple)",
    schedule: "Wed, Fri · Room 301",
    progress: 45,
    module: "Module 3: The Indian Renaissance",
    students: 40
  }
];

export default function MyClasses() {
  return (
    <>
      <StudentSidebar activePage="classes" />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Study hard, Aryan 👋</div>
            <h1>My Classes</h1>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search courses…" />
            </div>
            <button className="btn-primary" style={{ background: '#059669' }}>
               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Join New Class
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Enrolled Courses</div>
              <div className="card-subtitle">Manage your active learning modules</div>
            </div>
          </div>
          
          {studentClasses.map((cls) => (
            <div className="class-row" key={cls.id}>
              <div className="class-icon avatar" style={{ background: cls.color }}>{cls.initials}</div>
              <div className="class-info">
                <div className="class-name">{cls.name}</div>
                <div className="class-meta">{cls.teacher} · {cls.schedule}</div>
              </div>
              <div className="class-info" style={{ flex: 1.5 }}>
                <div className="class-meta" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Current Module</div>
                <div className="class-meta">{cls.module}</div>
              </div>
              <div className="progress-section">
                <div className="progress-label">PROGRESS <span className="progress-pct">{cls.progress}%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${cls.progress}%`, background: cls.color }}></div>
                </div>
              </div>
              <Link href={`/student/classes/${cls.id}`} className="btn-outline" style={{ marginLeft: '20px', textDecoration: 'none' }}>Enter Class</Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

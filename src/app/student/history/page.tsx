"use client";

import StudentSidebar from "../../components/StudentSidebar";
import AIChatBox from "../../components/AIChatBox";

const history = [
  { term: "Spring 2026", gpa: "3.9", status: "Current", courses: 6 },
  { term: "Fall 2025", gpa: "3.8", status: "Completed", courses: 5 },
  { term: "Spring 2025", gpa: "3.75", status: "Completed", courses: 5 },
];

const courseGrades = [
  { course: "Advanced Mathematics", score: "96", grade: "A+", credits: "4.0", status: "Excellent" },
  { course: "Applied Physics", score: "89", grade: "A", credits: "4.0", status: "Very Good" },
  { course: "English Composition", score: "92", grade: "A+", credits: "3.0", status: "Excellent" },
  { course: "Modern World History", score: "85", grade: "B+", credits: "3.0", status: "Good" },
  { course: "Computer Science I", score: "98", grade: "A+", credits: "4.0", status: "Top Performer" },
];

export default function StudentHistory() {
  return (
    <>
      <StudentSidebar activePage="history" />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Your achievements, Aryan 👋</div>
            <h1>Academic History</h1>
          </div>
          <div className="topbar-right">
             <button className="btn-primary" style={{ background: '#059669' }}>Download Transcript</button>
          </div>
        </div>

        <div className="stats-grid">
           <div className="stat-card green">
             <div className="stat-icon green">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             </div>
             <div className="stat-value">3.85</div>
             <div className="stat-label">Cumulative GPA</div>
             <span className="stat-badge green">Top 10% of Batch</span>
           </div>
           {history.map((h, i) => (
             <div className="stat-card" key={i} style={{ borderTopColor: i === 0 ? '#059669' : 'var(--border)' }}>
               <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '8px' }}>{h.term}</div>
               <div className="stat-value" style={{ fontSize: '24px' }}>{h.gpa}</div>
               <div className="stat-label">{h.courses} Courses · {h.status}</div>
             </div>
           ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
                <div className="card-title">Detailed Course Records</div>
                <div className="card-subtitle">Performance breakdown for Fall 2025</div>
            </div>
            <div className="table-count">5 COURSES RECORDED</div>
          </div>

          <div className="table-header-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
            <div>COURSE NAME</div>
            <div>SCORE</div>
            <div>GRADE</div>
            <div>CREDITS</div>
            <div>STATUS</div>
          </div>

          {courseGrades.map((cg, i) => (
            <div className="table-row" key={i} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
               <div className="td-name" style={{ fontWeight: 600 }}>{cg.course}</div>
               <div className="td-class" style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>{cg.score}%</div>
               <div>
                  <span className="tag ongoing" style={{ background: '#EFF6FF', color: 'var(--blue)', fontWeight: 800 }}>{cg.grade}</span>
               </div>
               <div className="td-class">{cg.credits}</div>
               <div>
                  <span className={`stat-badge ${cg.status === 'Excellent' || cg.status === 'Top Performer' ? 'green' : 'orange'}`}>
                    {cg.status}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </main>
      <AIChatBox />
    </>
  );
}

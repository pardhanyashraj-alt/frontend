"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import StudentSidebar from "../../../components/StudentSidebar";

const classData = {
  1: { name: "Mathematics", teacher: "Mr. Sharma", progress: 72, color: "var(--blue)" },
  2: { name: "Science", teacher: "Mrs. Gupta", progress: 58, color: "var(--orange)" },
  3: { name: "English Lit", teacher: "Ms. Davis", progress: 84, color: "var(--green)" },
  4: { name: "History", teacher: "Mr. Verma", progress: 45, color: "var(--purple)" },
};

const chapters = [
  {
    id: "ch-6",
    title: "Chapter 6: Calculus Basics",
    summary: "An introduction to the fundamental principles of calculus, focusing on limits and derivatives. We explore how small changes in one variable affect another.",
    ppt: "/materials/calculus-basics.pptx",
    status: "ongoing",
  },
  {
    id: "ch-5",
    title: "Chapter 5: Trigonometry Functions",
    summary: "Detailed study of sine, cosine, and tangent functions, their graphs, and real-world applications in periodic motion.",
    qna: [
      { q: "What is the period of a sine function?", a: "The period is 2π for a standard sine function y = sin(x)." },
      { q: "How do you find the amplitude?", a: "The amplitude is the absolute value of the coefficient 'a' in y = a sin(bx)." }
    ],
    quiz: { score: "18/20", status: "Attempted", date: "March 10, 2026" },
    ppt: "/materials/trig-functions.pptx",
    status: "past",
  },
  {
    id: "ch-4",
    title: "Chapter 4: Algebraic Identities",
    summary: "Mastering common algebraic identities and their use in simplifying complex equations and solving for variables.",
    qna: [
      { q: "What is (a+b)²?", a: "a² + 2ab + b²" }
    ],
    quiz: { score: "20/20", status: "Attempted", date: "March 2, 2026" },
    ppt: "/materials/algebraic-identities.pptx",
    status: "past",
  }
];

export default function ClassDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activePastChapter, setActivePastChapter] = useState<string | null>(null);
  const currentClass = classData[Number(id) as keyof typeof classData] || classData[1];
  
  const ongoingChapter = chapters.find(ch => ch.status === 'ongoing');
  const pastChapters = chapters.filter(ch => ch.status === 'past');

  return (
    <>
      <StudentSidebar activePage="classes" />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <Link href="/student/classes" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-meta)', textDecoration: 'none', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Classes
            </Link>
            <h1>{currentClass.name}</h1>
          </div>
          <div className="topbar-right">
             <div className="progress-section" style={{ minWidth: '150px' }}>
                <div className="progress-label">COURSE PROGRESS <span className="progress-pct">{currentClass.progress}%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${currentClass.progress}%`, background: currentClass.color }}></div>
                </div>
              </div>
          </div>
        </div>

        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          
          <div className="left-col">
            {/* Ongoing Chapter */}
            <div className="card" style={{ borderLeft: `4px solid ${currentClass.color}` }}>
              <div className="card-header">
                <div>
                  <span className="tag ongoing" style={{ background: '#D1FAE5', color: '#059669', marginBottom: '8px' }}>ONGOING CHAPTER</span>
                  <div className="card-title" style={{ fontSize: '20px' }}>{ongoingChapter?.title}</div>
                </div>
                <button className="btn-primary" style={{ background: currentClass.color }}>View Chapter</button>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: "1.6", fontSize: '15px' }}>
                  {ongoingChapter?.summary}
                </p>
                <div className="ppt-card" style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="stat-icon orange" style={{ width: '40px', height: '40px' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M4 11a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
                        <path d="M10 7a1 1 0 011-1h1a1 1 0 011 1v7a1 1 0 01-1 1h-1a1 1 0 01-1-1V7z" />
                        <path d="M16 15a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Chapter Presentation</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>PowerPoint · 4.2 MB</div>
                    </div>
                  </div>
                  <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>Download PPT</button>
                </div>
              </div>
            </div>

            {/* Past Chapters */}
            <h2 style={{ fontSize: '18px', margin: '32px 0 16px', color: 'var(--text-primary)' }}>Past Chapters</h2>
            <div className="past-chapters-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pastChapters.map((ch) => (
                <div key={ch.id} className="card" style={{ margin: 0 }}>
                  <div 
                    onClick={() => setActivePastChapter(activePastChapter === ch.id ? null : ch.id)}
                    style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="stat-icon gray" style={{ width: '30px', height: '30px', background: '#F3F4F6' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ch.title}</div>
                    </div>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-meta)" strokeWidth="2" style={{ transform: activePastChapter === ch.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  
                  {activePastChapter === ch.id && (
                    <div className="chapter-detail-content animate-in" style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-meta)', textTransform: 'uppercase', marginBottom: '8px' }}>Summary</div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{ch.summary}</p>
                      </div>

                      <div style={{ marginTop: '20px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-meta)', textTransform: 'uppercase', marginBottom: '12px' }}>Q&A Section</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {ch.qna?.map((q, i) => (
                            <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                              <div style={{ fontWeight: 600, fontSize: '13px', color: currentClass.color, marginBottom: '4px' }}>Q: {q.q}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>A: {q.a}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                        <div style={{ padding: '16px', background: 'rgba(5, 150, 105, 0.05)', borderRadius: '12px', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>QUIZ STATUS</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: '18px', color: '#059669' }}>{ch.quiz?.score}</div>
                            <span style={{ fontSize: '10px', background: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '12px', fontWeight: 700 }}>ATTEMPTED</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-meta)', marginTop: '4px' }}>Taken on {ch.quiz?.date}</div>
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>PPT ACCESS</div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px' }}>Chapter Slides</div>
                          <button className="btn-outline" style={{ fontSize: '11px', padding: '4px 8px', width: '100%' }}>View Presentation</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="right-col">
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ fontSize: '16px' }}>Class Info</div>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>INSTRUCTOR</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>JS</div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{currentClass.teacher}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>SCHEDULE</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Mon, Wed, Fri · 09:00 AM</div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>LOCATION</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Virtual Classroom 204</div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
                <button className="btn-primary" style={{ width: '100%', background: '#059669' }}>Join Live Lecture</button>
              </div>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <div className="card-header">
                <div className="card-title" style={{ fontSize: '16px' }}>Quick Stats</div>
              </div>
              <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Attendance</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#059669' }}>94%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Avg. Quiz Score</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--blue)' }}>88%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Assignments</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#D97706' }}>5 Submitted</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        .animate-in {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .progress-fill {
           transition: width 1s ease-in-out;
        }
      `}</style>
    </>
  );
}

"use client";

import { useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";

const dailySchedule = [
  { time: "9:00", ampm: "AM", title: "Mathematics", detail: "Room 204 · Mr. Sharma", type: "class", status: "now" },
  { time: "10:30", ampm: "AM", title: "Physics Lab", detail: "Lab 3 · Mrs. Gupta", type: "class", status: "upcoming" },
  { time: "11:45", ampm: "AM", title: "Lunch Break", detail: "Cafeteria", type: "break", status: "upcoming" },
  { time: "1:00", ampm: "PM", title: "English Literature", detail: "Room 108 · Ms. Davis", type: "class", status: "upcoming" },
  { time: "2:30", ampm: "PM", title: "Student Council", detail: "Room 12 · Activity", type: "activity", status: "upcoming" },
];

const weeklySchedule = [
  {
    day: "Monday",
    date: "March 15",
    classes: [
      { time: "09:00", subject: "Math", color: "var(--blue)" },
      { time: "10:30", subject: "Physics", color: "var(--orange)" },
      { time: "13:00", subject: "English", color: "var(--green)" }
    ]
  },
  {
    day: "Tuesday",
    date: "March 16",
    classes: [
      { time: "09:00", subject: "Biology", color: "var(--green-dark)" },
      { time: "11:00", subject: "History", color: "var(--purple)" },
      { time: "14:00", subject: "Gym", color: "var(--orange-light)" }
    ]
  },
  {
    day: "Wednesday",
    date: "March 17",
    classes: [
      { time: "09:30", subject: "Chemistry", color: "var(--orange)" },
      { time: "11:30", subject: "Math", color: "var(--blue)" },
      { time: "13:30", subject: "Art", color: "var(--purple-light)" }
    ]
  },
  {
    day: "Thursday",
    date: "March 18",
    classes: [
      { time: "09:00", subject: "English", color: "var(--green)" },
      { time: "10:30", subject: "Physics", color: "var(--orange)" },
      { time: "12:00", subject: "History", color: "var(--purple)" }
    ]
  },
  {
    day: "Friday",
    date: "March 19",
    classes: [
      { time: "08:30", subject: "Math", color: "var(--blue)" },
      { time: "10:00", subject: "Biology", color: "var(--green-dark)" },
      { time: "11:30", subject: "Seminar", color: "var(--text-meta)" }
    ]
  },
  {
    day: "Saturday",
    date: "March 20",
    classes: [
      { time: "10:00", subject: "Coding", color: "var(--blue-light)" },
      { time: "12:00", subject: "Project", color: "var(--orange)" }
    ]
  }
];

export default function StudentSchedule() {
  const [view, setView] = useState<"daily" | "weekly">("daily");

  return (
    <>
      <StudentSidebar activePage="schedule" />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Don&apos;t be late, Aryan 👋</div>
            <h1>{view === "daily" ? "Daily Schedule" : "Weekly Overview"}</h1>
          </div>
          <div className="topbar-right">
            <div className="card-subtitle" >
              {view === "daily" ? "Monday, March 15" : "Term 1 · 2026"}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{view === "daily" ? "Today's Timeline" : "Your Week at a Glance"}</div>
              <div className="card-subtitle">{view === "daily" ? "Your synchronized academic calendar" : "Planned classes and activities for the current week"}</div>
            </div>
            <button
              className={view === "weekly" ? "btn-primary" : "btn-outline"}
              onClick={() => setView(view === "daily" ? "weekly" : "daily")}
              style={{ background: view === "weekly" ? '#059669' : '' }}
            >
              {view === "daily" ? "Weekly View" : "Daily View"}
            </button>
          </div>

          <div className="schedule-content">
            {view === "daily" ? (
              <div className="daily-view animate-in">
                {dailySchedule.map((item, idx) => (
                  <div className="schedule-item" key={idx} style={{ padding: '20px 30px' }}>
                    <div className="sch-time" style={{ minWidth: '70px' }}>
                      <div className="sch-time-value" style={{ color: item.status === 'now' ? '#059669' : '' }}>{item.time}</div>
                      <div className="sch-time-ampm">{item.ampm}</div>
                    </div>
                    <div className="sch-dot-col">
                      <div className="sch-dot filled"
                        style={{
                          background: item.status === 'now' ? '#059669' : 'var(--border)',
                          borderColor: item.status === 'now' ? '#059669' : ''
                        }}></div>
                      {idx !== dailySchedule.length - 1 && <div className="sch-line"></div>}
                    </div>
                    <div className="sch-body">
                      <div className="sch-title" style={{ fontSize: '16px' }}>{item.title}</div>
                      <div className="sch-detail">{item.detail}</div>
                      {item.status === 'now' ? (
                        <span className="tag ongoing" style={{ background: '#D1FAE5', color: '#059669' }}>NOW</span>
                      ) : item.type === 'break' ? (
                        <span className="tag meeting" style={{ background: '#F3F4F6', color: '#6B7280' }}>BREAK</span>
                      ) : (
                        <span className="tag upcoming">UPCOMING</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="weekly-view animate-in" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {weeklySchedule.map((dayData, idx) => (
                  <div key={idx} className="card" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{dayData.day}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-meta)', fontWeight: 600 }}>{dayData.date}</div>
                    </div>
                    <div style={{ padding: '15px' }}>
                      {dayData.classes.map((cls, cIdx) => (
                        <div key={cIdx} style={{ display: 'flex', gap: '12px', marginBottom: cIdx === dayData.classes.length - 1 ? 0 : '12px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, minWidth: '45px', color: 'var(--text-secondary)' }}>{cls.time}</div>
                          <div style={{
                            flex: 1,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            background: `${cls.color}15`,
                            color: cls.color,
                            borderLeft: `3px solid ${cls.color}`
                          }}>
                            {cls.subject}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

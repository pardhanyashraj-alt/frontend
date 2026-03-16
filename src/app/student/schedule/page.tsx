"use client";

import StudentSidebar from "../../components/StudentSidebar";


const schedule = [
  { time: "9:00", ampm: "AM", title: "Mathematics", detail: "Room 204 · Mr. Sharma", type: "class", status: "now" },
  { time: "10:30", ampm: "AM", title: "Physics Lab", detail: "Lab 3 · Mrs. Gupta", type: "class", status: "upcoming" },
  { time: "11:45", ampm: "AM", title: "Lunch Break", detail: "Cafeteria", type: "break", status: "upcoming" },
  { time: "1:00", ampm: "PM", title: "English Literature", detail: "Room 108 · Ms. Davis", type: "class", status: "upcoming" },
  { time: "2:30", ampm: "PM", title: "Student Council", detail: "Room 12 · Activity", type: "activity", status: "upcoming" },
];

export default function StudentSchedule() {
  return (
    <>
      <StudentSidebar activePage="schedule" />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Don&apos;t be late, Aryan 👋</div>
            <h1>Daily Schedule</h1>
          </div>
          <div className="topbar-right">
             <div className="card-subtitle" style={{ fontWeight: 600 }}>Monday, March 15</div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Today&apos;s Timeline</div>
              <div className="card-subtitle">Your synchronized academic calendar</div>
            </div>
            <button className="btn-outline">Weekly View</button>
          </div>

          {schedule.map((item, idx) => (
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
                {idx !== schedule.length - 1 && <div className="sch-line"></div>}
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
      </main>
    </>
  );
}

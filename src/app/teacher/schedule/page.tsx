"use client";

import Sidebar from "../../components/Sidebar";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface ScheduleEvent {
  time: string;
  ampm: string;
  title: string;
  detail: string;
  tag: string;
  tagClass: string;
  dotClass: string;
}

const scheduleByDay: Record<string, ScheduleEvent[]> = {
  Monday: [
    { time: "8:30", ampm: "AM", title: "Mathematics — Grade 10", detail: "Room 204 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "filled" },
    { time: "10:00", ampm: "AM", title: "Computer Science — Grade 10", detail: "Computer Lab · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "11:30", ampm: "AM", title: "Department Meeting", detail: "Staff Room · 30 min", tag: "MEETING", tagClass: "meeting", dotClass: "outline" },
    { time: "1:00", ampm: "PM", title: "English Lit — Grade 11", detail: "Room 108 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "3:00", ampm: "PM", title: "Math Olympiad Prep", detail: "Room 204 · 1hr", tag: "EXTRA", tagClass: "upcoming", dotClass: "outline" },
  ],
  Tuesday: [
    { time: "9:30", ampm: "AM", title: "Science — Grade 9", detail: "Lab B · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "filled" },
    { time: "11:00", ampm: "AM", title: "Physics — Grade 11", detail: "Lab A · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "1:00", ampm: "PM", title: "Curriculum Review", detail: "Conference Room · 1hr", tag: "MEETING", tagClass: "meeting", dotClass: "outline" },
    { time: "3:15", ampm: "PM", title: "Parent-Teacher Call", detail: "Regarding Aryan S.", tag: "ALERT", tagClass: "alert", dotClass: "outline" },
  ],
  Wednesday: [
    { time: "8:30", ampm: "AM", title: "Mathematics — Grade 10", detail: "Room 204 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "filled" },
    { time: "10:00", ampm: "AM", title: "Computer Science — Grade 10", detail: "Computer Lab · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "11:00", ampm: "AM", title: "History — Grade 8", detail: "Room 301 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "2:00", ampm: "PM", title: "Grade Review Meeting", detail: "Principal Office · 30 min", tag: "MEETING", tagClass: "meeting", dotClass: "outline" },
  ],
  Thursday: [
    { time: "9:30", ampm: "AM", title: "Science — Grade 9", detail: "Lab B · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "filled" },
    { time: "11:00", ampm: "AM", title: "English Lit — Grade 11", detail: "Room 108 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "2:00", ampm: "PM", title: "Physics — Grade 11", detail: "Lab A · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "3:30", ampm: "PM", title: "Science Fair Planning", detail: "Staff Room · 45 min", tag: "MEETING", tagClass: "meeting", dotClass: "outline" },
  ],
  Friday: [
    { time: "8:30", ampm: "AM", title: "Mathematics — Grade 10", detail: "Room 204 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "filled" },
    { time: "10:00", ampm: "AM", title: "History — Grade 8", detail: "Room 301 · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
    { time: "11:30", ampm: "AM", title: "Staff Weekly Standup", detail: "Conference Room · 30 min", tag: "MEETING", tagClass: "meeting", dotClass: "outline" },
    { time: "2:00", ampm: "PM", title: "Physics — Grade 11", detail: "Lab A · 45 min", tag: "CLASS", tagClass: "ongoing", dotClass: "outline" },
  ],
};

const totalClasses = Object.values(scheduleByDay).flat().filter(e => e.tag === "CLASS").length;
const totalMeetings = Object.values(scheduleByDay).flat().filter(e => e.tag === "MEETING").length;

export default function SchedulePage() {
  return (
    <>
      <Sidebar activePage="schedule" />
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Your weekly overview</div>
            <h1>Schedule</h1>
          </div>
          <div className="topbar-right">
            <button className="btn-primary">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Event
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-value">{totalClasses}</div>
            <div className="stat-label">Classes This Week</div>
            <span className="stat-badge green">ON TRACK</span>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="stat-value">{totalMeetings}</div>
            <div className="stat-label">Meetings</div>
            <span className="stat-badge orange">{totalMeetings} THIS WEEK</span>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-value">8:30</div>
            <div className="stat-label">First Class</div>
            <span className="stat-badge green">AM · MATHEMATICS</span>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="stat-value">1</div>
            <div className="stat-label">Alerts</div>
            <span className="stat-badge orange">PARENT CALL</span>
          </div>
        </div>

        {/* Week Grid */}
        <div className="week-grid">
          {weekDays.map(day => (
            <div className="card" key={day}>
              <div className="card-header">
                <div>
                  <div className="card-title">{day}</div>
                  <div className="card-subtitle">{scheduleByDay[day].length} events</div>
                </div>
              </div>
              {scheduleByDay[day].map((event, idx) => (
                <div className="schedule-item" key={idx}>
                  <div className="sch-time">
                    <div className="sch-time-value">{event.time}</div>
                    <div className="sch-time-ampm">{event.ampm}</div>
                  </div>
                  <div className="sch-dot-col">
                    <div className={`sch-dot ${event.dotClass}`}></div>
                    {idx < scheduleByDay[day].length - 1 && <div className="sch-line"></div>}
                  </div>
                  <div className="sch-body">
                    <div className="sch-title">{event.title}</div>
                    <div className="sch-detail">{event.detail}</div>
                    <span className={`tag ${event.tagClass}`}>{event.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

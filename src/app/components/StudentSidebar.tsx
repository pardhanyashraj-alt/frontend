"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StudentSidebarProps {
  activePage: "dashboard" | "classes" | "assignments" | "schedule" | "history" | "messages" | "complaints";
}

export default function StudentSidebar({ activePage }: StudentSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      } else {
        const saved = localStorage.getItem("sidebarCollapsed");
        setCollapsed(saved === "true");
      }
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (collapsed) {
        if (!isMobile) {
          document.body.classList.add("sidebar-collapsed");
          localStorage.setItem("sidebarCollapsed", "true");
        }
      } else {
        if (!isMobile) {
          document.body.classList.remove("sidebar-collapsed");
          localStorage.setItem("sidebarCollapsed", "false");
        }
      }
    }
  }, [collapsed, isMobile]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (isMobile) setCollapsed(true);
  };

  return (
    <>
      <div 
        className={`sidebar-backdrop${isMobile && !collapsed ? " visible" : ""}`} 
        onClick={closeMobileSidebar}
      />
      
      <nav className={`sidebar${collapsed ? " collapsed" : ""}${isMobile && !collapsed ? " mobile-open" : ""}`}>
        <div className="logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="logo-name">EduFlow</span>
        </div>

        <div className="nav-group">
          <div className="nav-section-label">Learning Hub</div>
          <Link href="/student/dashboard" className={`nav-item${activePage === "dashboard" ? " active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </Link>
          <Link href="/student/classes" className={`nav-item${activePage === "classes" ? " active student-active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
            My Classes
          </Link>
          <Link href="/student/assignments" className={`nav-item${activePage === "assignments" ? " active student-active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Assignments
            <span className="nav-badge" style={{ background: '#059669' }}>2</span>
          </Link>
          <Link href="/student/schedule" className={`nav-item${activePage === "schedule" ? " active student-active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Schedule
          </Link>
          <Link href="/student/messages" className={`nav-item${activePage === "messages" ? " active student-active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Messages
          </Link>
        </div>

        <div className="nav-group">
          <div className="nav-section-label">Records</div>
          <Link href="/student/history" className={`nav-item${activePage === "history" ? " active student-active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Academic History
          </Link>
          <Link href="/student/complaints" className={`nav-item${activePage === "complaints" ? " active student-active" : ""}`} onClick={closeMobileSidebar}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Complaints & Feedback
          </Link>
        </div>

        <div className="sidebar-user">
          <div className="avatar ak" style={{ background: '#059669' }}>AK</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>Aryan Kumar</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Grade 10 Student</div>
          </div>
        </div>
      </nav>

      <button
        className={`sidebar-toggle${collapsed ? " collapsed-state" : ""}${isMobile && !collapsed ? " mobile-toggle-open" : ""}`}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <style jsx global>{`
        .nav-item.student-active {
          background: #D1FAE5 !important;
          color: #059669 !important;
        }
      `}</style>
    </>
  );
}

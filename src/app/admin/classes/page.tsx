"use client";

import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

interface SchoolClass {
  class_id: string;
  grade_level: number;
  section: string;
  student_count: number;
  teachers: { name: string; subject: string; is_classroom_teacher: boolean }[];
}

const mockClasses: SchoolClass[] = [
  {
    class_id: "cls-1", grade_level: 8, section: "C", student_count: 40,
    teachers: [
      { name: "Mrs. Rita Sharma", subject: "History", is_classroom_teacher: true },
      { name: "Mr. Ramesh Gupta", subject: "Mathematics", is_classroom_teacher: false },
    ]
  },
  {
    class_id: "cls-2", grade_level: 9, section: "B", student_count: 34,
    teachers: [
      { name: "Mr. Ramesh Gupta", subject: "Science", is_classroom_teacher: true },
      { name: "Ms. Anita Verma", subject: "English", is_classroom_teacher: false },
    ]
  },
  {
    class_id: "cls-3", grade_level: 10, section: "A", student_count: 38,
    teachers: [
      { name: "Mrs. Rita Sharma", subject: "Mathematics", is_classroom_teacher: true },
    ]
  },
  {
    class_id: "cls-4", grade_level: 10, section: "B", student_count: 36,
    teachers: [
      { name: "Ms. Anita Verma", subject: "English Literature", is_classroom_teacher: true },
    ]
  },
  {
    class_id: "cls-5", grade_level: 11, section: "A", student_count: 30,
    teachers: [
      { name: "Mr. Ramesh Gupta", subject: "Physics", is_classroom_teacher: true },
      { name: "Mrs. Rita Sharma", subject: "Chemistry", is_classroom_teacher: false },
    ]
  },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>(mockClasses);
  const [detail, setDetail] = useState<SchoolClass | null>(null);
  const [detailTab, setDetailTab] = useState<"teachers" | "students">("teachers");

  // Create Class Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classNumber, setClassNumber] = useState("");
  const [section, setSection] = useState("");

  // Promote Modal State
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const toast = (msg: string) => { setSuccessToast(msg); setTimeout(() => setSuccessToast(""), 3000); };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNumber || !section) return;
    const newClass: SchoolClass = {
      class_id: `cls-${Date.now()}`,
      grade_level: parseInt(classNumber),
      section: section,
      student_count: 0,
      teachers: []
    };
    setClasses([...classes, newClass]);
    setShowCreateModal(false);
    setClassNumber("");
    setSection("");
    toast(`Class ${classNumber}${section} created successfully!`);
  };

  const handlePromote = () => {
    const updated = classes.map(c => {
      if (c.grade_level >= 12) {
        return { ...c, grade_level: 0 }; // 0 represents Graduated
      }
      return { ...c, grade_level: c.grade_level + 1 };
    });
    setClasses(updated);
    setShowPromoteModal(false);
    toast("All students promoted to the next grade!");
  };

  const classGroups = classes.reduce((acc, c) => {
    const key = c.grade_level === 0 ? "Graduated" : `Grade ${c.grade_level}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {} as Record<string, SchoolClass[]>);

  const mockDetailStudents = [
    { name: "Anjali Kapoor", email: "anjali@school.edu", is_active: true },
    { name: "Rohan Mehta", email: "rohan@school.edu", is_active: true },
    { name: "Shreya Mishra", email: "shreya@school.edu", is_active: true },
    { name: "Vikram Singh", email: "vikram@school.edu", is_active: false },
  ];

  return (
    <>
      <AdminSidebar activePage="classes" />

      {/* ── CLASS DETAIL MODAL ── */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-content" style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="card-title">Grade {detail.grade_level} — Section {detail.section}</div>
                <div style={{ fontSize: 12, color: "var(--text-meta)", marginTop: 2 }}>{detail.student_count} students</div>
              </div>
              <button className="icon-btn" onClick={() => setDetail(null)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Tabs */}
            <div style={{ padding: "0 24px", display: "flex", gap: 4, borderBottom: "1px solid var(--border)" }}>
              {(["teachers", "students"] as const).map(t => (
                <button key={t} onClick={() => setDetailTab(t)} style={{
                  padding: "12px 16px", border: "none", background: "none", fontSize: 13, fontWeight: 600,
                  color: detailTab === t ? "var(--purple)" : "var(--text-meta)", cursor: "pointer",
                  borderBottom: `2px solid ${detailTab === t ? "var(--purple)" : "transparent"}`, transition: "all 0.2s",
                }}>
                  {t === "teachers" ? `👩‍🏫 Teachers (${detail.teachers.length})` : `🎓 Students (${detail.student_count})`}
                </button>
              ))}
            </div>

            <div className="modal-body">
              {detailTab === "teachers" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {detail.teachers.map((t, i) => (
                    <div key={i} style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: 12, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, background: "var(--purple-light)", color: "var(--purple-dark)", flexShrink: 0 }}>
                          {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-meta)" }}>{t.subject}</div>
                        </div>
                      </div>
                      {t.is_classroom_teacher && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--purple-dark)", background: "var(--purple-light)", padding: "2px 8px", borderRadius: 6 }}>Class Teacher</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {detailTab === "students" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mockDetailStudents.map((s, i) => (
                    <div key={i} style={{ padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: "var(--blue-light)", color: "var(--blue)", flexShrink: 0 }}>
                          {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-meta)" }}>{s.email}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.is_active ? "var(--green-dark)" : "var(--red)", background: s.is_active ? "var(--green-light)" : "#FEE2E2", padding: "2px 8px", borderRadius: 6 }}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">View and manage school classes</div>
            <h1>Classes</h1>
          </div>
          <div className="topbar-right" style={{ display: "flex", gap: 10 }}>
            <button className="btn-outline" style={{ padding: "10px 20px" }} onClick={() => setShowPromoteModal(true)}>
              🎓 Promote Students
            </button>
            <button className="btn-primary" style={{ padding: "10px 20px" }} onClick={() => setShowCreateModal(true)}>
              + Create Class
            </button>
          </div>
        </div>

        {/* Toast */}
        {successToast && (
          <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#059669", color: "white", padding: "14px 22px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(5,150,105,0.35)", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            {successToast}
          </div>
        )}

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="card-title">Create New Class</div>
                <button className="icon-btn" onClick={() => setShowCreateModal(false)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleCreateClass}>
                <div className="modal-body">
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Class Number</label>
                    <select className="form-input" value={classNumber} onChange={e => setClassNumber(e.target.value)} required>
                      <option value="">Select Class</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <select className="form-input" value={section} onChange={e => setSection(e.target.value)} required>
                      <option value="">Select Section</option>
                      {["A", "B", "C"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Class</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Promote Students Modal */}
        {showPromoteModal && (
          <div className="modal-overlay" onClick={() => setShowPromoteModal(false)}>
            <div className="modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="card-title">Promote All Students</div>
                <button className="icon-btn" onClick={() => setShowPromoteModal(false)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.6 }}>
                  Are you sure you want to promote ALL students in ALL classes to the next grade? This action will:
                  <br /><br />
                  • Move Class 1 → Class 2
                  <br />
                  • Move Class 2 → Class 3
                  <br />
                  • ... and so on.
                  <br />
                  • Class 12 students will be marked as <b>Graduated</b>.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn-outline" onClick={() => setShowPromoteModal(false)}>Cancel</button>
                <button className="btn-primary" style={{ background: "var(--purple)" }} onClick={handlePromote}>Yes, Promote All</button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card green"><div className="stat-value">{classes.length}</div><div className="stat-label">Total Classes</div></div>
          <div className="stat-card blue"><div className="stat-value">{Array.from(new Set(classes.map(c => c.grade_level))).length}</div><div className="stat-label">Grade Levels</div></div>
          <div className="stat-card purple"><div className="stat-value">{classes.reduce((a, c) => a + c.student_count, 0)}</div><div className="stat-label">Total Students</div></div>
        </div>

        {/* Classes grouped by grade */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {Object.entries(classGroups).sort(([a], [b]) => {
            if (a === "Graduated") return 1;
            if (b === "Graduated") return -1;
            return parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]);
          }).map(([grade, gradeClasses]) => (
            <div key={grade}>
              <div style={{ fontWeight: 700, fontSize: 14, color: grade === "Graduated" ? "var(--text-meta)" : "var(--text-meta)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>{grade}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                {gradeClasses.sort((a, b) => a.section.localeCompare(b.section)).map(c => (
                  <div key={c.class_id} className="card" style={{ padding: "20px", cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => { setDetail(c); setDetailTab("teachers"); }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: grade === "Graduated" ? "#F1F5F9" : "var(--green-light)", color: grade === "Graduated" ? "var(--text-meta)" : "var(--green-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>
                        {c.section}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Section {c.section}</div>
                    <div style={{ fontSize: 12, color: "var(--text-meta)", marginTop: 4 }}>{c.student_count} students</div>
                    <div style={{ fontSize: 12, color: "var(--text-meta)", marginTop: 2 }}>{c.teachers.length} teacher{c.teachers.length !== 1 ? "s" : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
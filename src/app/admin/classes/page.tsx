"use client";

import { useMemo, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useAdminContext, type ClassRecord } from "../../../context/AdminContext";
import Link from "next/link";

const classOptions = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sectionOptions = ["A", "B", "C", "D", "E"];

export default function ClassesManagement() {
  const {
    classes,
    students,
    teachers,
    teacherAssignments,
    currentAcademicYear,
    addClass,
    updateClass,
    deleteClass,
    promoteStudents,
    assignmentsForClass,
  } = useAdminContext();
  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<ClassRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<ClassRecord | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [nextYear, setNextYear] = useState("2025-26");

  const [newClass, setNewClass] = useState<Partial<ClassRecord>>({
    className: "",
    section: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const currentClasses = classes.filter((c) => c.academicYear === currentAcademicYear);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return currentClasses;
    return currentClasses.filter((c) => {
      if (c.className.toLowerCase().includes(q)) return true;
      if (c.section.toLowerCase().includes(q)) return true;
      if (c.subjects.some((s) => s.toLowerCase().includes(q))) return true;
      const assigns = assignmentsForClass(c.id, c.section, c.academicYear);
      return assigns.some((a) => {
        const name = teachers.find((t) => String(t.id) === a.teacher_id)?.name ?? "";
        return name.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q);
      });
    });
  }, [currentClasses, search, assignmentsForClass, teachers]);

  /** Students whose enrollment matches selected class, section, and current academic year */
  const enrolledMatchingStudents = useMemo(() => {
    const cn = newClass.className?.trim();
    const sec = newClass.section?.trim();
    if (!cn || !sec) return [];
    return students.filter(
      (s) =>
        s.class === cn &&
        s.section === sec &&
        s.academicYear === currentAcademicYear &&
        s.status !== "graduated"
    );
  }, [students, newClass.className, newClass.section, currentAcademicYear]);

  const enrolledStudentIds = useMemo(
    () => enrolledMatchingStudents.map((s) => s.id),
    [enrolledMatchingStudents]
  );

  const handleCreate = () => {
    if (!newClass.className?.trim() || !newClass.section?.trim()) return;

    if (isEditing && editingId) {
      updateClass(editingId, {
        className: newClass.className || "",
        section: newClass.section || "",
        students: enrolledStudentIds,
      });
    } else {
      const colors = ["var(--blue)", "var(--orange)", "var(--green)", "var(--purple)", "var(--blue-mid)"];
      addClass({
        className: newClass.className || "",
        section: newClass.section || "",
        subjects: [],
        students: enrolledStudentIds,
        academicYear: currentAcademicYear,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    closeCreateModal();
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setIsEditing(false);
    setEditingId(null);
    setNewClass({ className: "", section: "" });
  };

  const handleEditClick = (c: ClassRecord) => {
    setNewClass({
      className: c.className,
      section: c.section,
    });
    setEditingId(c.id);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleDelete = () => {
    if (showDeleteModal) {
      deleteClass(showDeleteModal.id);
      setShowDeleteModal(null);
    }
  };

  const handlePromote = () => {
    if (!nextYear) return;
    promoteStudents(currentAcademicYear, nextYear);
    setShowPromoteModal(false);
  };

  return (
    <>
      <AdminSidebar activePage="classes" />

      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">{isEditing ? "Edit Class" : "Create Class"}</div>
              <button type="button" className="icon-btn" onClick={closeCreateModal}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="card-subtitle" style={{ marginBottom: 16 }}>
                Roster is built from students enrolled with this class, section, and academic year ({currentAcademicYear}). Teachers:{" "}
                <Link href="/admin/teacher-assignment" style={{ color: "var(--purple)", fontWeight: 600 }}>
                  Teacher Assignment
                </Link>
                .
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Class *</label>
                  <select
                    className="form-input"
                    value={newClass.className}
                    onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    {classOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Section *</label>
                  <select
                    className="form-input"
                    value={newClass.section}
                    onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                  >
                    <option value="" disabled>
                      Select Section
                    </option>
                    {sectionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-meta)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 10,
                  }}
                >
                  Students from enrollment ({enrolledMatchingStudents.length})
                </div>
                {!newClass.className || !newClass.section ? (
                  <p className="card-subtitle" style={{ fontSize: 13, margin: 0 }}>
                    Choose class and section to list students whose records match this class, section, and {currentAcademicYear}.
                  </p>
                ) : enrolledMatchingStudents.length === 0 ? (
                  <p className="card-subtitle" style={{ fontSize: 13, margin: 0 }}>
                    No students enrolled for {newClass.className} · Section {newClass.section} in {currentAcademicYear} (excluding graduated). Add or update students under Students so their class, section, and year match.
                  </p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18, maxHeight: 200, overflowY: "auto" }}>
                    {enrolledMatchingStudents.map((s) => (
                      <li key={s.id} style={{ fontSize: 14, color: "var(--text-primary)", marginBottom: 6 }}>
                        {s.name}
                        <span className="card-subtitle" style={{ fontSize: 12, marginLeft: 8 }}>
                          Roll {s.rollNo}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={closeCreateModal}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ background: "var(--purple)" }}
                onClick={handleCreate}
                disabled={!newClass.className?.trim() || !newClass.section?.trim()}
              >
                {isEditing ? "Save Changes" : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Class Details</div>
              <button type="button" className="icon-btn" onClick={() => setShowDetailsModal(null)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 24,
                  marginBottom: 24,
                }}
              >
                <div
                  className="avatar"
                  style={{
                    background: showDetailsModal.color,
                    width: 64,
                    height: 64,
                    fontSize: 24,
                  }}
                >
                  {showDetailsModal.className.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                    {showDetailsModal.className}
                  </h2>
                  <div style={{ fontSize: 14, color: "var(--text-meta)" }}>
                    Section: {showDetailsModal.section || "-"} · Year: {showDetailsModal.academicYear}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-meta)",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Subjects (curriculum)
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {showDetailsModal.subjects.length ? (
                    showDetailsModal.subjects.map((s) => (
                      <span key={s} className="status-tag good" style={{ fontSize: 12 }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="card-subtitle">None listed</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-meta)",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Assigned teachers
                  </h3>
                  <Link
                    href="/admin/teacher-assignment"
                    className="btn-outline"
                    style={{ padding: "4px 10px", fontSize: 12 }}
                  >
                    Manage
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {assignmentsForClass(
                    showDetailsModal.id,
                    showDetailsModal.section,
                    showDetailsModal.academicYear
                  ).length === 0 ? (
                    <div className="card-subtitle" style={{ fontSize: 13 }}>
                      No teacher assignments yet.
                    </div>
                  ) : (
                    assignmentsForClass(
                      showDetailsModal.id,
                      showDetailsModal.section,
                      showDetailsModal.academicYear
                    ).map((a) => {
                      const teacherName =
                        teachers.find((t) => String(t.id) === a.teacher_id)?.name ?? "Unknown";
                      return (
                        <div
                          key={a.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "var(--bg)",
                            padding: 12,
                            borderRadius: 12,
                            border: "1px solid var(--border)",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                              {a.subject}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-meta)" }}>{teacherName}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-meta)",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Students ({showDetailsModal.students.length})
                </h3>
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, maxHeight: 200, overflowY: "auto" }}>
                  {showDetailsModal.students.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {showDetailsModal.students.map((studentId, i) => (
                          <tr
                            key={studentId}
                            style={{
                              borderBottom:
                                i < showDetailsModal.students.length - 1 ? "1px solid var(--border)" : "none",
                            }}
                          >
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                                Student #{studentId}
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-meta)", textAlign: "right" }}>
                              ID: #{studentId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: 24, textAlign: "center", color: "var(--text-meta)", fontSize: 14 }}>
                      No students enrolled.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-primary" onClick={() => setShowDetailsModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="modal-content" style={{ maxWidth: 400, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "#FEE2E2",
                color: "var(--red)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>Delete Class?</h2>
            <p style={{ fontSize: 14, color: "var(--text-meta)", margin: "0 0 24px 0", lineHeight: 1.5 }}>
              This removes the class and all linked teacher assignments for this class.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button type="button" className="btn-outline" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ background: "var(--red)", boxShadow: "none" }}
                onClick={handleDelete}
              >
                Delete Class
              </button>
            </div>
          </div>
        </div>
      )}

      {showPromoteModal && (
        <div className="modal-overlay" onClick={() => setShowPromoteModal(false)}>
          <div className="modal-content" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Yearly Class Promotion</div>
              <button type="button" className="icon-btn" onClick={() => setShowPromoteModal(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="card-subtitle" style={{ marginBottom: 16, lineHeight: 1.5 }}>
                New year classes copy subjects only. Re-assign teachers under Teacher Assignment for the new year.
              </p>
              <div className="form-group">
                <label className="form-label">Current Academic Year</label>
                <input className="form-input" value={currentAcademicYear} disabled style={{ opacity: 0.85 }} />
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Next Academic Year</label>
                <input
                  className="form-input"
                  placeholder="e.g. 2025-26"
                  value={nextYear}
                  onChange={(e) => setNextYear(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: 24 }}>
              <button type="button" className="btn-outline" onClick={() => setShowPromoteModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ background: "var(--orange)", border: "none" }}
                onClick={handlePromote}
                disabled={!nextYear}
              >
                Promote All
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Academic Year: {currentAcademicYear}</div>
            <h1>Classes Management</h1>
          </div>
          <div className="topbar-right" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/admin/teacher-assignment" className="btn-outline">
              Teacher Assignment
            </Link>
            <button
              type="button"
              className="btn-outline"
              style={{
                background: "#FFF7ED",
                color: "var(--orange)",
                border: "1px solid rgba(249, 115, 22, 0.2)",
              }}
              onClick={() => setShowPromoteModal(true)}
            >
              Promote Students
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ background: "var(--purple)", boxShadow: "0 4px 12px rgba(124,58,237,0.2)" }}
              onClick={() => setShowCreateModal(true)}
            >
              Create Class
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="table-filters">
              <div className="search-box">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search class, subject, or teacher…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-count">{filtered.length} classes</div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg)", textAlign: "left" }}>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Class
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Section
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Subjects
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Teachers assigned
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Students
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const assigns = assignmentsForClass(c.id, c.section, c.academicYear);
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div className="avatar" style={{ background: c.color, width: 34, height: 34, fontSize: 12 }}>
                            {c.className.substring(0, 2).toUpperCase()}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{c.className}</div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 500 }}>{c.section || "-"}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {c.subjects.length ? (
                            <>
                              {c.subjects.slice(0, 3).map((sub) => (
                                <span
                                  key={sub}
                                  style={{
                                    fontSize: 11,
                                    color: "var(--blue)",
                                    background: "var(--blue-light)",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                  }}
                                >
                                  {sub}
                                </span>
                              ))}
                              {c.subjects.length > 3 && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text-meta)",
                                    background: "var(--bg)",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                  }}
                                >
                                  +{c.subjects.length - 3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: "var(--text-meta)" }}>—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {assigns.length === 0 ? (
                          <span style={{ color: "var(--text-meta)" }}>None</span>
                        ) : (
                          <span style={{ fontWeight: 600 }}>{assigns.length}</span>
                        )}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>{c.students.length}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: "5px 8px", fontSize: 11 }}
                            onClick={() => setShowDetailsModal(c)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: "5px 8px", fontSize: 11 }}
                            onClick={() => handleEditClick(c)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: "5px 8px", fontSize: 11, color: "var(--red)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                            onClick={() => setShowDeleteModal(c)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-meta)" }}>
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

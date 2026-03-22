"use client";

import { useMemo, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  useAdminContext,
  type TeacherClassAssignmentRecord,
} from "../../../context/AdminContext";

const emptyForm: Omit<TeacherClassAssignmentRecord, "id"> = {
  class_id: "",
  section: "",
  subject: "",
  teacher_id: "",
  academic_year: "",
};

export default function TeacherAssignmentPage() {
  const {
    classes,
    teachers,
    teacherAssignments,
    currentAcademicYear,
    addTeacherAssignment,
    updateTeacherAssignment,
    deleteTeacherAssignment,
  } = useAdminContext();

  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);

  const classOptions = useMemo(
    () => [...classes].sort((a, b) => a.className.localeCompare(b.className)),
    [classes]
  );

  const selectedClass = useMemo(() => {
    if (!form.class_id) return null;
    return classes.find((c) => String(c.id) === form.class_id) ?? null;
  }, [form.class_id, classes]);

  const subjectOptions = useMemo(() => {
    if (!selectedClass) return [] as string[];
    return selectedClass.subjects;
  }, [selectedClass]);

  const filteredTeachers = useMemo(() => {
    const q = teacherFilter.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => t.name.toLowerCase().includes(q));
  }, [teachers, teacherFilter]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...teacherAssignments].sort((a, b) => {
      const ca = classes.find((c) => String(c.id) === a.class_id)?.className ?? "";
      const cb = classes.find((c) => String(c.id) === b.class_id)?.className ?? "";
      return ca.localeCompare(cb) || a.section.localeCompare(b.section);
    });
    if (!q) return list;
    return list.filter((r) => {
      const cname = classes.find((c) => String(c.id) === r.class_id)?.className ?? "";
      const tname = teachers.find((t) => String(t.id) === r.teacher_id)?.name ?? "";
      return (
        cname.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        tname.toLowerCase().includes(q) ||
        r.academic_year.includes(q)
      );
    });
  }, [teacherAssignments, search, classes, teachers]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      academic_year: currentAcademicYear,
    });
    setTeacherFilter("");
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (row: TeacherClassAssignmentRecord) => {
    setEditingId(row.id);
    setForm({
      class_id: row.class_id,
      section: row.section,
      subject: row.subject,
      teacher_id: row.teacher_id,
      academic_year: row.academic_year,
    });
    const tn = teachers.find((t) => String(t.id) === row.teacher_id)?.name ?? "";
    setTeacherFilter(tn);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setTeacherSearchOpen(false);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const year = form.academic_year.trim() || currentAcademicYear;
    const payload: Omit<TeacherClassAssignmentRecord, "id"> = {
      ...form,
      subject: form.subject.trim(),
      academic_year: year,
    };
    if (!payload.class_id || !payload.section) {
      setFormError("Select a class.");
      return;
    }
    if (!payload.subject) {
      setFormError("Subject is required.");
      return;
    }
    if (!payload.teacher_id) {
      setFormError("Select a teacher.");
      return;
    }
    const res = editingId
      ? updateTeacherAssignment(editingId, payload)
      : addTeacherAssignment(payload);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    closeModal();
  };

  const pickTeacher = (id: number) => {
    setForm({ ...form, teacher_id: String(id) });
    setTeacherFilter(teachers.find((t) => t.id === id)?.name ?? "");
    setTeacherSearchOpen(false);
  };

  return (
    <>
      <AdminSidebar activePage="teacher-assignment" />
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Academic staffing</div>
            <h1>Teacher Assignment</h1>
          </div>
          <div className="topbar-right">
            <button type="button" className="btn-primary" style={{ background: "var(--purple)" }} onClick={openCreate}>
              Assign teacher
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
                  placeholder="Search class, section, subject, teacher, year…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-count">{rows.length} assignments</div>
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
                    Subject
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Teacher
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Year
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const cn = classes.find((c) => String(c.id) === r.class_id)?.className ?? r.class_id;
                  const tn = teachers.find((t) => String(t.id) === r.teacher_id)?.name ?? r.teacher_id;
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 600 }}>{cn}</td>
                      <td style={{ padding: "14px 20px" }}>{r.section}</td>
                      <td style={{ padding: "14px 20px" }}>{r.subject}</td>
                      <td style={{ padding: "14px 20px" }}>{tn}</td>
                      <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: 13 }}>{r.academic_year}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button type="button" className="btn-outline" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => openEdit(r)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: "5px 10px", fontSize: 11, color: "var(--red)", borderColor: "rgba(239,68,68,0.35)" }}
                            onClick={() => deleteTeacherAssignment(r.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-meta)" }}>
                      No assignments yet. Use &quot;Assign teacher&quot; to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">{editingId ? "Edit assignment" : "Assign teacher"}</div>
              <button type="button" className="icon-btn" aria-label="Close" onClick={closeModal}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submitForm}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Class *</label>
                  <select
                    className="form-input filter-select"
                    required
                    value={form.class_id}
                    onChange={(e) => {
                      const cl = classes.find((c) => String(c.id) === e.target.value);
                      setForm({
                        ...form,
                        class_id: e.target.value,
                        section: cl?.section ?? "",
                        subject: "",
                      });
                    }}
                  >
                    <option value="">Select class</option>
                    {classOptions.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.className} — Section {c.section} ({c.academicYear})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Section</label>
                  <input className="form-input" readOnly value={selectedClass?.section ?? "—"} style={{ opacity: 0.9 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  {subjectOptions.length > 0 ? (
                    <select
                      className="form-input filter-select"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select subject</option>
                      {subjectOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      {form.subject && !subjectOptions.includes(form.subject) && (
                        <option value={form.subject}>{form.subject} (assigned)</option>
                      )}
                    </select>
                  ) : (
                    <input
                      className="form-input"
                      required
                      placeholder="Enter subject name"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  )}
                  {selectedClass && subjectOptions.length === 0 && (
                    <p className="card-subtitle" style={{ marginTop: 8, fontSize: 12 }}>
                      This class has no curriculum subjects listed. Add subjects on the class or type a subject above.
                    </p>
                  )}
                </div>
                <div className="form-group" style={{ position: "relative" }}>
                  <label className="form-label">Teacher *</label>
                  <input
                    className="form-input"
                    autoComplete="off"
                    placeholder="Search teacher by name…"
                    value={teacherFilter}
                    onChange={(e) => {
                      setTeacherFilter(e.target.value);
                      setTeacherSearchOpen(true);
                      setForm({ ...form, teacher_id: "" });
                    }}
                    onFocus={() => setTeacherSearchOpen(true)}
                  />
                  {teacherSearchOpen && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "100%",
                        marginTop: 4,
                        maxHeight: 200,
                        overflowY: "auto",
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        zIndex: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      }}
                    >
                      {filteredTeachers.length === 0 ? (
                        <div style={{ padding: 12, fontSize: 13, color: "var(--text-meta)" }}>No match</div>
                      ) : (
                        filteredTeachers.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => pickTeacher(t.id)}
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "10px 14px",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: 14,
                              color: "var(--text-primary)",
                              fontFamily: "inherit",
                            }}
                            className="teacher-assign-pick"
                          >
                            {t.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Academic year (optional)</label>
                  <input
                    className="form-input"
                    placeholder={currentAcademicYear}
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                  />
                  <p className="card-subtitle" style={{ marginTop: 6, fontSize: 12 }}>
                    Leave blank to use current year ({currentAcademicYear}).
                  </p>
                </div>
                {formError && (
                  <p style={{ color: "var(--red)", fontSize: 13, fontWeight: 600 }}>{formError}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ background: "var(--purple)" }}>
                  {editingId ? "Save" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .teacher-assign-pick:hover {
          background: var(--nav-hover) !important;
        }
      `}</style>
    </>
  );
}

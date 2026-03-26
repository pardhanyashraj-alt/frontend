"use client";

import { useState, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_password_changed: boolean;
  created_at: string;
  enrollment?: {
    grade_level: number;
    section: string;
    admission_number: number;
    parent_name: string;
    parent_phone: string;
    fee_status: "pending" | "paid" | "overdue";
    enrollment_date: string;
  };
}

const mockStudents: Student[] = [
  { student_id: "s1", first_name: "Anjali", last_name: "Kapoor", email: "anjali@school.edu", is_active: true, is_password_changed: true, created_at: "2025-06-01", enrollment: { grade_level: 10, section: "A", admission_number: 1001, parent_name: "Ramesh Kapoor", parent_phone: "+91 98765 43210", fee_status: "paid", enrollment_date: "2025-06-01" } },
  { student_id: "s2", first_name: "Rohan", last_name: "Mehta", email: "rohan@school.edu", is_active: true, is_password_changed: true, created_at: "2025-06-01", enrollment: { grade_level: 10, section: "A", admission_number: 1002, parent_name: "Suresh Mehta", parent_phone: "+91 98765 43211", fee_status: "pending", enrollment_date: "2025-06-01" } },
  { student_id: "s3", first_name: "Shreya", last_name: "Mishra", email: "shreya@school.edu", is_active: true, is_password_changed: false, created_at: "2025-06-02", enrollment: { grade_level: 11, section: "A", admission_number: 1003, parent_name: "Anil Mishra", parent_phone: "+91 98765 43212", fee_status: "paid", enrollment_date: "2025-06-02" } },
  { student_id: "s4", first_name: "Vikram", last_name: "Singh", email: "vikram@school.edu", is_active: true, is_password_changed: true, created_at: "2025-06-03", enrollment: { grade_level: 8, section: "C", admission_number: 1004, parent_name: "Balraj Singh", parent_phone: "+91 98765 43213", fee_status: "overdue", enrollment_date: "2025-06-03" } },
  { student_id: "s5", first_name: "Priya", last_name: "Patel", email: "priya@school.edu", is_active: true, is_password_changed: true, created_at: "2025-06-04", enrollment: { grade_level: 10, section: "B", admission_number: 1005, parent_name: "Kiran Patel", parent_phone: "+91 98765 43214", fee_status: "paid", enrollment_date: "2025-06-04" } },
];

const FEE_COLORS: Record<string, string> = {
  paid: "var(--green-dark)",
  pending: "var(--orange)",
  overdue: "var(--red)",
};

export default function StudentsPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<"All" | number>("All");
  const [feeFilter, setFeeFilter] = useState<"All" | "paid" | "pending" | "overdue">("All");
  const [detail, setDetail] = useState<Student | null>(null);
  const [successToast, setSuccessToast] = useState("");
  
  // Registration States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [bulkStudents, setBulkStudents] = useState<any[]>([]);
  const [manualStudent, setManualStudent] = useState({
    first_name: "", last_name: "", email: "", grade_level: 1, section: "A", admission_number: "", parent_name: "", parent_phone: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = (msg: string) => { setSuccessToast(msg); setTimeout(() => setSuccessToast(""), 3500); };

  const uniqueGrades = Array.from(new Set(students.map(s => s.enrollment?.grade_level).filter(Boolean))).sort() as number[];

  const filtered = students.filter(s => {
    const name = `${s.first_name} ${s.last_name} ${s.email} ${s.enrollment?.admission_number ?? ""}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchGrade = gradeFilter === "All" || s.enrollment?.grade_level === gradeFilter;
    const matchFee = feeFilter === "All" || s.enrollment?.fee_status === feeFilter;
    return matchSearch && matchGrade && matchFee;
  });

  const fullName = (s: Student) => `${s.first_name} ${s.last_name}`;
  const initials = (s: Student) => `${s.first_name[0]}${s.last_name[0]}`.toUpperCase();

  // ─── BULK METHODS ────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n").filter(row => row.trim() !== "");
      // Skip header if it exists
      const startIdx = rows[0].toLowerCase().includes("name") ? 1 : 0;
      
      const parsed = rows.slice(startIdx).map(row => {
        const cols = row.split(",").map(c => c.trim());
        return {
          first_name: cols[0] || "",
          last_name: cols[1] || "",
          email: cols[2] || "",
          grade_level: parseInt(cols[3]) || 1,
          section: cols[4] || "A",
          admission_number: cols[5] || ""
        };
      });
      setBulkStudents(parsed);
      toast(`Parsed ${parsed.length} students from CSV! Check and edit if needed.`);
    };
    reader.readAsText(file);
  };

  const addBulkRow = () => {
    setBulkStudents([...bulkStudents, { first_name: "", last_name: "", email: "", grade_level: 1, section: "A", admission_number: "" }]);
  };

  const updateBulkStudent = (index: number, field: string, value: any) => {
    const updated = [...bulkStudents];
    updated[index] = { ...updated[index], [field]: value };
    setBulkStudents(updated);
  };

  const removeBulkRow = (index: number) => {
    setBulkStudents(bulkStudents.filter((_, i) => i !== index));
  };

  const handleBulkSubmit = () => {
    if (bulkStudents.length === 0) return toast("No students to register!");
    toast(`Successfully registered ${bulkStudents.length} students bulkily!`);
    setIsBulkModalOpen(false);
    setBulkStudents([]);
  };

  // ─── MANUAL METHODS ──────────────────────────────────────────────────────
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`Successfully registered ${manualStudent.first_name} ${manualStudent.last_name}!`);
    setIsManualModalOpen(false);
    setManualStudent({ first_name: "", last_name: "", email: "", grade_level: 1, section: "A", admission_number: "", parent_name: "", parent_phone: "" });
  };

  return (
    <>
      <AdminSidebar activePage="students" />

      {/* Toast */}
      {successToast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#059669", color: "white", padding: "14px 22px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(5,150,105,0.35)", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          {successToast}
        </div>
      )}

      {/* ── BULK REGISTRATION MODAL ── */}
      {isBulkModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBulkModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 880, width: "95%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Bulk Student Registration</div>
              <button className="icon-btn" onClick={() => setIsBulkModalOpen(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: "var(--blue-light)05", border: "1px dashed var(--blue)", padding: 24, borderRadius: 14, textAlign: "center", marginBottom: 24 }}>
                <input type="file" accept=".csv" ref={fileInputRef} hidden onChange={handleFileUpload} />
                <div style={{ fontSize: 13, color: "var(--text-meta)", marginBottom: 16 }}>
                  Upload a CSV file with columns: <b>First Name, Last Name, Email, Class, Section, Admission No.</b>
                </div>
                <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                  📁 Upload CSV File
                </button>
              </div>

              {bulkStudents.length > 0 && (
                <div style={{ maxHeight: "360px", overflowY: "auto", marginBottom: 20 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ position: "sticky", top: 0, background: "#F8FAFC", zIndex: 10 }}>
                      <tr style={{ textAlign: "left" }}>
                        {["First Name", "Last Name", "Email", "Class", "Section", "Adm. No.", ""].map(h => (
                          <th key={h} style={{ padding: "12px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bulkStudents.map((bs, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px" }}><input type="text" className="filter-select" style={{ width: "100%" }} value={bs.first_name} onChange={e => updateBulkStudent(idx, "first_name", e.target.value)} /></td>
                          <td style={{ padding: "8px" }}><input type="text" className="filter-select" style={{ width: "100%" }} value={bs.last_name} onChange={e => updateBulkStudent(idx, "last_name", e.target.value)} /></td>
                          <td style={{ padding: "8px" }}><input type="email" className="filter-select" style={{ width: "100%" }} value={bs.email} onChange={e => updateBulkStudent(idx, "email", e.target.value)} /></td>
                          <td style={{ padding: "8px" }}>
                            <select className="filter-select" value={bs.grade_level} onChange={e => updateBulkStudent(idx, "grade_level", Number(e.target.value))}>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: "8px" }}><input type="text" className="filter-select" style={{ width: "100%" }} value={bs.section} onChange={e => updateBulkStudent(idx, "section", e.target.value)} /></td>
                          <td style={{ padding: "8px" }}><input type="text" className="filter-select" style={{ width: "100%" }} value={bs.admission_number || ""} placeholder="No." onChange={e => updateBulkStudent(idx, "admission_number", e.target.value)} /></td>
                          <td style={{ padding: "8px" }}>
                            <button className="icon-btn" onClick={() => removeBulkRow(idx)} style={{ color: "var(--red)" }}>
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <button className="btn-outline" onClick={addBulkRow} style={{ width: "100%", borderStyle: "dashed", marginBottom: 12 }}>
                + Add Row Manually
              </button>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setIsBulkModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleBulkSubmit}>Complete Registration</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MANUAL REGISTRATION MODAL ── */}
      {isManualModalOpen && (
        <div className="modal-overlay" onClick={() => setIsManualModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 520, width: "95%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Manual Student Registration</div>
              <button className="icon-btn" onClick={() => setIsManualModalOpen(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>First Name</label>
                    <input type="text" className="filter-select" style={{ width: "100%" }} required value={manualStudent.first_name} onChange={e => setManualStudent({...manualStudent, first_name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Last Name</label>
                    <input type="text" className="filter-select" style={{ width: "100%" }} required value={manualStudent.last_name} onChange={e => setManualStudent({...manualStudent, last_name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Admission Number</label>
                    <input type="text" className="filter-select" style={{ width: "100%" }} required value={manualStudent.admission_number} onChange={e => setManualStudent({...manualStudent, admission_number: e.target.value})} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email Address</label>
                  <input type="email" className="filter-select" style={{ width: "100%" }} required value={manualStudent.email} onChange={e => setManualStudent({...manualStudent, email: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Class Level</label>
                    <select className="filter-select" style={{ width: "100%" }} value={manualStudent.grade_level} onChange={e => setManualStudent({...manualStudent, grade_level: Number(e.target.value)})}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Class {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Section</label>
                    <select className="filter-select" style={{ width: "100%" }} value={manualStudent.section} onChange={e => setManualStudent({...manualStudent, section: e.target.value})}>
                      {["A", "B", "C", "D"].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 12, border: "1px solid #F1F5F9" }}>
                   <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", marginBottom: 12 }}>PARENTS / GUARDIAN INFO</div>
                   <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-meta)", display: "block", marginBottom: 4 }}>Parent Name</label>
                    <input type="text" className="filter-select" style={{ width: "100%", background: "white" }} value={manualStudent.parent_name} onChange={e => setManualStudent({...manualStudent, parent_name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-meta)", display: "block", marginBottom: 4 }}>Parent Phone</label>
                    <input type="text" className="filter-select" style={{ width: "100%", background: "white" }} value={manualStudent.parent_phone} onChange={e => setManualStudent({...manualStudent, parent_phone: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setIsManualModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Register Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DETAIL MODAL (Left Intact) ── */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-content" style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Student Details</div>
              <button className="icon-btn" onClick={() => setDetail(null)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ padding: 20, background: "#F8FAFC", borderRadius: 14, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div className="avatar" style={{ width: 52, height: 52, fontSize: 18, background: "var(--blue-light)", color: "var(--blue)", flexShrink: 0 }}>
                    {initials(detail)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{fullName(detail)}</div>
                    <div style={{ fontSize: 12, color: "var(--text-meta)" }}>
                      {detail.enrollment ? `Class ${detail.enrollment.grade_level}${detail.enrollment.section} · Adm. #${detail.enrollment.admission_number}` : "No enrollment data"}
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="greeting">Manage enrolled students</div>
            <h1>Students</h1>
          </div>
          <div className="topbar-right" style={{ display: "flex", gap: 12 }}>
            <button className="btn-outline" onClick={() => setIsBulkModalOpen(true)} style={{ padding: "10px 20px" }}>
              Bulk Registration
            </button>
            <button className="btn-primary" onClick={() => setIsManualModalOpen(true)} style={{ padding: "10px 20px" }}>
              + Register Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div className="stat-card blue"><div className="stat-value">{students.length}</div><div className="stat-label">Total Students</div></div>
          <div className="stat-card green"><div className="stat-value">{students.filter(s => s.is_active).length}</div><div className="stat-label">Active</div></div>
          <div className="stat-card orange"><div className="stat-value">{students.filter(s => s.enrollment?.fee_status === "pending").length}</div><div className="stat-label">Fee Pending</div></div>
          <div className="stat-card purple"><div className="stat-value">{students.filter(s => !s.is_password_changed).length}</div><div className="stat-label">Awaiting Login</div></div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={gradeFilter} onChange={e => setGradeFilter(e.target.value === "All" ? "All" : Number(e.target.value))}>
            <option value="All">All Classes</option>
            {uniqueGrades.map(g => <option key={g} value={g}>Class {g}</option>)}
          </select>
          <select className="filter-select" value={feeFilter} onChange={e => setFeeFilter(e.target.value as "All" | "paid" | "pending" | "overdue")}>
            <option value="All">All Fee Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div style={{ fontSize: 13, color: "var(--text-meta)" }}>{filtered.length} students enrolled</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", textAlign: "left" }}>
                  {["Student", "Email", "Class", "Adm. No.", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-meta)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(s => (
                  <tr key={s.student_id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: "var(--blue-light)", color: "var(--blue)", flexShrink: 0 }}>{initials(s)}</div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{fullName(s)}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-meta)" }}>{s.email}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600 }}>{s.enrollment ? `${s.enrollment.grade_level}${s.enrollment.section}` : "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13 }}>{s.enrollment?.admission_number ?? "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <button className="btn-outline" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => setDetail(s)}>Details</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ padding: 60, textAlign: "center", color: "var(--text-meta)" }}>No students found matching your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
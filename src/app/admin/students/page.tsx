"use client";

import { useState } from "react";
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
  { student_id: "s6", first_name: "Arjun", last_name: "Sharma", email: "arjun@school.edu", is_active: false, is_password_changed: true, created_at: "2025-06-05", enrollment: { grade_level: 9, section: "B", admission_number: 1006, parent_name: "Deepak Sharma", parent_phone: "+91 98765 43215", fee_status: "pending", enrollment_date: "2025-06-05" } },
  { student_id: "s7", first_name: "Neha", last_name: "Gupta", email: "neha@school.edu", is_active: true, is_password_changed: false, created_at: "2025-06-06", enrollment: { grade_level: 9, section: "B", admission_number: 1007, parent_name: "Vinod Gupta", parent_phone: "+91 98765 43216", fee_status: "paid", enrollment_date: "2025-06-06" } },
  { student_id: "s8", first_name: "Rahul", last_name: "Verma", email: "rahul@school.edu", is_active: true, is_password_changed: true, created_at: "2025-06-07", enrollment: { grade_level: 11, section: "A", admission_number: 1008, parent_name: "Mohan Verma", parent_phone: "+91 98765 43217", fee_status: "overdue", enrollment_date: "2025-06-07" } },
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

      {/* ── DETAIL MODAL ── */}
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
                      {detail.enrollment ? `Grade ${detail.enrollment.grade_level}${detail.enrollment.section} · Adm. #${detail.enrollment.admission_number}` : "No enrollment data"}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: detail.is_active ? "var(--green-dark)" : "var(--red)", background: detail.is_active ? "var(--green-light)" : "#FEE2E2", padding: "2px 8px", borderRadius: 6 }}>
                        {detail.is_active ? "Active" : "Inactive"}
                      </span>
                      {detail.enrollment?.fee_status && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: FEE_COLORS[detail.enrollment.fee_status], background: `${FEE_COLORS[detail.enrollment.fee_status]}15`, padding: "2px 8px", borderRadius: 6 }}>
                          Fee: {detail.enrollment.fee_status.charAt(0).toUpperCase() + detail.enrollment.fee_status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13, color: "var(--text-meta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Personal Info</div>
              <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
                {([
                  { label: "Email", value: detail.email },
                  { label: "Registered On", value: new Date(detail.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                ] as { label: string; value: string }[]).map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ color: "var(--text-meta)", fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {detail.enrollment && (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13, color: "var(--text-meta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enrollment</div>
                  <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
                    {([
                      { label: "Grade & Section", value: `Grade ${detail.enrollment.grade_level} - ${detail.enrollment.section}` },
                      { label: "Admission No.", value: String(detail.enrollment.admission_number) },
                      { label: "Parent Name", value: detail.enrollment.parent_name || "—" },
                      { label: "Parent Phone", value: detail.enrollment.parent_phone || "—" },
                      { label: "Fee Status", value: detail.enrollment.fee_status.charAt(0).toUpperCase() + detail.enrollment.fee_status.slice(1) },
                    ] as { label: string; value: string }[]).map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ color: "var(--text-meta)", fontWeight: 600 }}>{r.label}</span>
                        <span style={{ fontWeight: 500, color: r.label === "Fee Status" ? FEE_COLORS[detail.enrollment!.fee_status] : undefined }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-outline" style={{ fontSize: 12, color: "var(--blue)", borderColor: "var(--blue)" }}
                onClick={() => { toast("New password sent to student's email."); setDetail(null); }}>
                📧 Resend Password
              </button>
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
          <div className="topbar-right">
            <button className="btn-primary" style={{ padding: "10px 20px" }}>
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
            <option value="All">All Grades</option>
            {uniqueGrades.map(g => <option key={g} value={g}>Grade {g}</option>)}
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
            <div style={{ fontSize: 13, color: "var(--text-meta)" }}>{filtered.length} students</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", textAlign: "left" }}>
                  {["Student", "Email", "Grade", "Adm. No.", "Fee Status", "Status", "Actions"].map(h => (
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
                      {s.enrollment?.fee_status ? (
                        <span style={{ fontSize: 11, fontWeight: 700, color: FEE_COLORS[s.enrollment.fee_status], background: `${FEE_COLORS[s.enrollment.fee_status]}15`, padding: "4px 8px", borderRadius: 6 }}>
                          {s.enrollment.fee_status.charAt(0).toUpperCase() + s.enrollment.fee_status.slice(1)}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.is_active ? "var(--green)" : "var(--red)" }} />
                        <span style={{ fontSize: 13 }}>{s.is_active ? "Active" : "Inactive"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button className="btn-outline" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => setDetail(s)}>Details</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} style={{ padding: 60, textAlign: "center", color: "var(--text-meta)" }}>No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
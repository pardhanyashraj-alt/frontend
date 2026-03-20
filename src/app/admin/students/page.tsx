"use client";

import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

interface Student {
  id: number; name: string; initials: string; class: string; section: string;
  rollNo: number; parentName: string; phone: string; feeStatus: "Paid" | "Pending" | "Overdue";
  status: "active" | "inactive"; color: string;
}

const initialStudents: Student[] = [
  { id: 1, name: "Anjali Kapoor", initials: "AK", class: "Grade 10", section: "A", rollNo: 1, parentName: "Mr. Kapoor", phone: "+91 98765 11111", feeStatus: "Paid", status: "active", color: "var(--blue-mid)" },
  { id: 2, name: "Rohan Mehta", initials: "RM", class: "Grade 10", section: "A", rollNo: 2, parentName: "Mr. Mehta", phone: "+91 98765 22222", feeStatus: "Pending", status: "active", color: "var(--orange)" },
  { id: 3, name: "Shreya Mishra", initials: "SM", class: "Grade 9", section: "B", rollNo: 3, parentName: "Mrs. Mishra", phone: "+91 98765 33333", feeStatus: "Paid", status: "active", color: "var(--purple)" },
  { id: 4, name: "Aryan Sharma", initials: "AS", class: "Grade 11", section: "A", rollNo: 4, parentName: "Mr. Sharma", phone: "+91 98765 44444", feeStatus: "Overdue", status: "active", color: "var(--green)" },
  { id: 5, name: "Priya Patel", initials: "PP", class: "Grade 10", section: "B", rollNo: 5, parentName: "Mr. Patel", phone: "+91 98765 55555", feeStatus: "Paid", status: "active", color: "var(--blue)" },
  { id: 6, name: "Vikram Singh", initials: "VS", class: "Grade 8", section: "A", rollNo: 6, parentName: "Mr. Singh", phone: "+91 98765 66666", feeStatus: "Paid", status: "active", color: "var(--orange)" },
  { id: 7, name: "Neha Gupta", initials: "NG", class: "Grade 9", section: "A", rollNo: 7, parentName: "Mrs. Gupta", phone: "+91 98765 77777", feeStatus: "Pending", status: "active", color: "var(--purple)" },
  { id: 8, name: "Kabir Das", initials: "KD", class: "Grade 11", section: "B", rollNo: 8, parentName: "Mr. Das", phone: "+91 98765 88888", feeStatus: "Overdue", status: "inactive", color: "var(--blue-mid)" },
];

const gradeOptions = ["All", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", class: "Grade 10", section: "A", parentName: "", phone: "" });

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "All" || s.class === gradeFilter;
    return matchSearch && matchGrade;
  });

  const paid = students.filter(s => s.feeStatus === "Paid").length;
  const pending = students.filter(s => s.feeStatus === "Pending").length;
  const overdue = students.filter(s => s.feeStatus === "Overdue").length;

  const feeStatusStyle = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      Paid: { bg: 'var(--green-light)', color: 'var(--green-dark)' },
      Pending: { bg: 'var(--amber-light)', color: 'var(--amber)' },
      Overdue: { bg: '#FEE2E2', color: 'var(--red)' },
    };
    return colors[status] || { bg: '#F3F4F6', color: '#6B7280' };
  };

  const handleAdd = () => {
    const initials = newStudent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colors = ["var(--blue)", "var(--orange)", "var(--green)", "var(--purple)", "var(--blue-mid)"];
    setStudents([...students, {
      id: Date.now(), name: newStudent.name, initials, class: newStudent.class,
      section: newStudent.section, rollNo: students.length + 1, parentName: newStudent.parentName,
      phone: newStudent.phone, feeStatus: "Pending", status: "active",
      color: colors[Math.floor(Math.random() * colors.length)],
    }]);
    setShowAddModal(false);
    setNewStudent({ name: "", class: "Grade 10", section: "A", parentName: "", phone: "" });
  };

  return (
    <>
      <AdminSidebar activePage="students" />

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Enroll New Student</div>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Student Full Name *</label>
                <input className="form-input" placeholder="e.g. Aryan Kumar" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Class *</label>
                  <select className="form-input" value={newStudent.class} onChange={e => setNewStudent({...newStudent, class: e.target.value})}>
                    {gradeOptions.filter(g => g !== "All").map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Section</label>
                  <select className="form-input" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})}>
                    <option>A</option><option>B</option><option>C</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Parent / Guardian Name</label>
                <input className="form-input" placeholder="e.g. Mr. Kumar" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Contact Number</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--purple)' }} onClick={handleAdd} disabled={!newStudent.name}>Enroll Student</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Student records & enrollment</div>
            <h1>Student Management</h1>
          </div>
          <div className="topbar-right">
            <button className="btn-primary" style={{ background: 'var(--purple)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }} onClick={() => setShowAddModal(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Enroll Student
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div className="stat-value">{paid}</div>
            <div className="stat-label">Fees Paid</div>
            <span className="stat-badge green">CLEARED</span>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon orange"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Fees Pending</div>
            <span className="stat-badge orange">DUE SOON</span>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon purple"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div className="stat-value">{overdue}</div>
            <div className="stat-label">Fees Overdue</div>
            <span className="stat-badge orange">NEEDS ACTION</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="table-filters">
              <div className="search-box">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                {gradeOptions.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="table-count">{filtered.length} students</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Student</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Class / Sec</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Roll No</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Parent</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Fee Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const fStyle = feeStatusStyle(s.feeStatus);
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div className="avatar" style={{ background: s.color, width: '34px', height: '34px', fontSize: '12px' }}>{s.initials}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>ID: #{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px' }}>{s.class} — {s.section}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '14px' }}>{s.rollNo}</td>
                      <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <div>{s.parentName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>{s.phone}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: fStyle.color, background: fStyle.bg, padding: '4px 10px', borderRadius: '6px' }}>{s.feeStatus}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px' }}>View</button>
                          <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px' }}>Transfer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

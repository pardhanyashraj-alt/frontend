"use client";

import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

interface Teacher {
  id: number; name: string; initials: string; subject: string; designation: string;
  salary: number; joinDate: string; phone: string; email: string; status: "active" | "inactive";
  color: string;
}

const initialTeachers: Teacher[] = [
  { id: 1, name: "Ms. Rita Sharma", initials: "RS", subject: "Mathematics", designation: "Senior Teacher", salary: 65000, joinDate: "Aug 2018", phone: "+91 98765 43210", email: "rita@eduflow.edu", status: "active", color: "var(--blue)" },
  { id: 2, name: "Mrs. Sunita Gupta", initials: "SG", subject: "Science", designation: "Subject Head", salary: 72000, joinDate: "Jan 2016", phone: "+91 98765 43211", email: "sunita@eduflow.edu", status: "active", color: "var(--orange)" },
  { id: 3, name: "Mr. David Wilson", initials: "DW", subject: "English Lit", designation: "Teacher", salary: 55000, joinDate: "Mar 2020", phone: "+91 98765 43212", email: "david@eduflow.edu", status: "active", color: "var(--green)" },
  { id: 4, name: "Ms. Priya Mehta", initials: "PM", subject: "History", designation: "Teacher", salary: 52000, joinDate: "Jul 2021", phone: "+91 98765 43213", email: "priya@eduflow.edu", status: "active", color: "var(--purple)" },
  { id: 5, name: "Mr. Anil Verma", initials: "AV", subject: "Physics", designation: "Senior Teacher", salary: 68000, joinDate: "May 2017", phone: "+91 98765 43214", email: "anil@eduflow.edu", status: "active", color: "var(--blue-mid)" },
  { id: 6, name: "Mrs. Kavita Nair", initials: "KN", subject: "Computer Science", designation: "HOD", salary: 80000, joinDate: "Sep 2014", phone: "+91 98765 43215", email: "kavita@eduflow.edu", status: "inactive", color: "var(--red)" },
];

const designations = ["Teacher", "Senior Teacher", "Subject Head", "HOD", "Vice Principal"];

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState<Teacher | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState<Teacher | null>(null);
  const [newDesignation, setNewDesignation] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("March 2026");

  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "", designation: "Teacher", salary: "", phone: "", email: "" });

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()));
  const activeCount = teachers.filter(t => t.status === "active").length;
  const totalSalary = teachers.filter(t => t.status === "active").reduce((a, b) => a + b.salary, 0);

  const handleAddTeacher = () => {
    const initials = newTeacher.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colors = ["var(--blue)", "var(--orange)", "var(--green)", "var(--purple)", "var(--blue-mid)"];
    setTeachers([...teachers, {
      id: Date.now(), name: newTeacher.name, initials, subject: newTeacher.subject,
      designation: newTeacher.designation, salary: parseInt(newTeacher.salary) || 0,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      phone: newTeacher.phone, email: newTeacher.email, status: "active",
      color: colors[Math.floor(Math.random() * colors.length)],
    }]);
    setShowAddModal(false);
    setNewTeacher({ name: "", subject: "", designation: "Teacher", salary: "", phone: "", email: "" });
  };

  const handlePromote = () => {
    if (showPromoteModal && newDesignation) {
      setTeachers(teachers.map(t => t.id === showPromoteModal.id ? { ...t, designation: newDesignation } : t));
      setShowPromoteModal(null);
      setNewDesignation("");
    }
  };

  return (
    <>
      <AdminSidebar activePage="teachers" />

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Add New Teacher</div>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="e.g. John Smith" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" placeholder="e.g. Mathematics" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <select className="form-input" value={newTeacher.designation} onChange={e => setNewTeacher({...newTeacher, designation: e.target.value})}>
                    {designations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Monthly Salary (₹)</label>
                  <input className="form-input" type="number" placeholder="e.g. 55000" value={newTeacher.salary} onChange={e => setNewTeacher({...newTeacher, salary: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="+91 XXXXX XXXXX" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="teacher@eduflow.edu" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddTeacher} style={{ background: 'var(--purple)' }} disabled={!newTeacher.name || !newTeacher.subject}>Add Teacher</button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <div className="modal-overlay" onClick={() => setShowSalaryModal(null)}>
          <div className="modal-content" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Issue Salary</div>
              <button className="icon-btn" onClick={() => setShowSalaryModal(null)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '20px' }}>
                <div className="avatar" style={{ background: showSalaryModal.color }}>{showSalaryModal.initials}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{showSalaryModal.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>{showSalaryModal.designation} · {showSalaryModal.subject}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Month</label>
                  <select className="form-input" value={salaryMonth} onChange={e => setSalaryMonth(e.target.value)}>
                    <option>March 2026</option><option>February 2026</option><option>January 2026</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="form-input" type="number" value={showSalaryModal.salary} readOnly style={{ fontWeight: 700 }} />
                </div>
              </div>
              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--green-light)', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '4px' }}>PAY SLIP PREVIEW</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>Basic Salary</span><span style={{ fontWeight: 600 }}>₹{(showSalaryModal.salary * 0.6).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>HRA</span><span style={{ fontWeight: 600 }}>₹{(showSalaryModal.salary * 0.2).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>Allowances</span><span style={{ fontWeight: 600 }}>₹{(showSalaryModal.salary * 0.2).toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--green-dark)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800 }}>
                  <span>Net Pay</span><span>₹{showSalaryModal.salary.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowSalaryModal(null)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--green-dark)' }} onClick={() => setShowSalaryModal(null)}>Process Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Promote/Demote Modal */}
      {showPromoteModal && (
        <div className="modal-overlay" onClick={() => setShowPromoteModal(null)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Change Designation</div>
              <button className="icon-btn" onClick={() => setShowPromoteModal(null)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '20px' }}>
                <div className="avatar" style={{ background: showPromoteModal.color }}>{showPromoteModal.initials}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{showPromoteModal.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>Current: {showPromoteModal.designation}</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Designation</label>
                <select className="form-input" value={newDesignation} onChange={e => setNewDesignation(e.target.value)}>
                  <option value="">Select designation...</option>
                  {designations.filter(d => d !== showPromoteModal.designation).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowPromoteModal(null)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--purple)' }} onClick={handlePromote} disabled={!newDesignation}>Update Designation</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Manage your teaching staff</div>
            <h1>Teacher Management</h1>
          </div>
          <div className="topbar-right">
            <button className="btn-primary" style={{ background: 'var(--purple)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }} onClick={() => setShowAddModal(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Teacher
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-icon purple"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Total Teachers</div>
            <span className="stat-badge green">↑ 2 THIS MONTH</span>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div className="stat-value">{activeCount}</div>
            <div className="stat-label">Active Teachers</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
            <div className="stat-value">₹{(totalSalary / 1000).toFixed(0)}K</div>
            <div className="stat-label">Monthly Payroll</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon orange"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div>
            <div className="stat-value">6</div>
            <div className="stat-label">Subjects Covered</div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="table-filters">
              <div className="search-box">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search teachers…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="table-count">{filtered.length} teachers</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Teacher</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Subject</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Designation</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Salary</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Joined</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="avatar" style={{ background: t.color, width: '34px', height: '34px', fontSize: '12px' }}>{t.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px' }}>{t.subject}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--purple-dark)', background: 'var(--purple-light)', padding: '4px 8px', borderRadius: '6px' }}>{t.designation}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '14px' }}>₹{t.salary.toLocaleString()}</td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-meta)' }}>{t.joinDate}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px', background: 'var(--green-dark)', boxShadow: 'none' }} onClick={() => setShowSalaryModal(t)}>💰 Pay</button>
                        <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px' }} onClick={() => { setShowPromoteModal(t); setNewDesignation(""); }}>↕ Role</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

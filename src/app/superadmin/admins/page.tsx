"use client";

import { useState } from "react";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";

interface Admin {
  id: number; name: string; email: string; phone: string; school: string;
  city: string; lastLogin: string; status: "Active" | "Revoked";
  plan: string; joinedDate: string;
}

const initialAdmins: Admin[] = [
  { id: 1, name: "Dr. Rajendra Kumar", email: "admin@eduflow.edu.in", phone: "+91 98765 00001", school: "EduFlow Academy", city: "Noida", lastLogin: "2h ago", status: "Active", plan: "Pro", joinedDate: "Jan 15, 2026" },
  { id: 2, name: "Mrs. Kavita Nair", email: "admin@greenfield.edu.in", phone: "+91 98765 00002", school: "Greenfield Public School", city: "Lucknow", lastLogin: "1d ago", status: "Active", plan: "Basic", joinedDate: "Feb 8, 2026" },
  { id: 3, name: "Fr. Thomas", email: "admin@stmarys.edu.in", phone: "+91 98765 00003", school: "St. Mary's Convent", city: "Dehradun", lastLogin: "3h ago", status: "Active", plan: "Enterprise", joinedDate: "Feb 20, 2026" },
  { id: 4, name: "Mr. Suresh Yadav", email: "admin@dav.edu.in", phone: "+91 98765 00004", school: "DAV Model School", city: "Chandigarh", lastLogin: "5d ago", status: "Active", plan: "Pro", joinedDate: "Mar 1, 2026" },
  { id: 5, name: "Ms. Priya Shah", email: "admin@ryan.edu.in", phone: "+91 98765 00005", school: "Ryan International", city: "Mumbai", lastLogin: "12h ago", status: "Active", plan: "Enterprise", joinedDate: "Mar 5, 2026" },
  { id: 6, name: "Mr. Arjun Meena", email: "admin@sunshine.edu.in", phone: "+91 98765 00006", school: "Sunshine Academy", city: "Jaipur", lastLogin: "30d ago", status: "Revoked", plan: "Basic", joinedDate: "Mar 10, 2026" },
  { id: 7, name: "Dr. Suman Pandey", email: "admin@vidya.edu.in", phone: "+91 98765 00007", school: "Vidya Niketan", city: "Patna", lastLogin: "6h ago", status: "Active", plan: "Pro", joinedDate: "Mar 12, 2026" },
  { id: 8, name: "Mrs. Fatima Khan", email: "admin@crescent.edu.in", phone: "+91 98765 00008", school: "Crescent School", city: "Hyderabad", lastLogin: "1h ago", status: "Active", plan: "Basic", joinedDate: "Mar 14, 2026" },
];

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Revoked">("All");
  const [showDetailModal, setShowDetailModal] = useState<Admin | null>(null);
  const [showResetModal, setShowResetModal] = useState<Admin | null>(null);

  const filtered = admins.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.school.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleAccess = (id: number) => {
    setAdmins(admins.map(a => a.id === id ? { ...a, status: a.status === "Active" ? "Revoked" : "Active" } : a));
    setShowDetailModal(null);
  };

  return (
    <>
      <SuperAdminSidebar activePage="admins" />

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Admin Details</div>
              <button className="icon-btn" onClick={() => setShowDetailModal(null)}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px', background: '#F8FAFC', borderRadius: '14px', marginBottom: '20px' }}>
                <div className="avatar" style={{ background: showDetailModal.status === 'Active' ? '#1E40AF' : '#94A3B8', width: '48px', height: '48px', fontSize: '16px' }}>
                  {showDetailModal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{showDetailModal.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>{showDetailModal.school}, {showDetailModal.city}</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: showDetailModal.status === 'Active' ? 'var(--green-dark)' : 'var(--red)', background: showDetailModal.status === 'Active' ? 'var(--green-light)' : '#FEE2E2', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>{showDetailModal.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Email', value: showDetailModal.email },
                  { label: 'Phone', value: showDetailModal.phone },
                  { label: 'Plan', value: showDetailModal.plan },
                  { label: 'Joined', value: showDetailModal.joinedDate },
                  { label: 'Last Login', value: showDetailModal.lastLogin },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-meta)', fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => { setShowResetModal(showDetailModal); setShowDetailModal(null); }}>🔑 Reset Password</button>
              <button className="btn-primary" style={{ background: showDetailModal.status === 'Active' ? 'var(--red)' : 'var(--green-dark)' }} onClick={() => toggleAccess(showDetailModal.id)}>
                {showDetailModal.status === 'Active' ? '🚫 Revoke Access' : '✅ Restore Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Reset Password</div>
              <button className="icon-btn" onClick={() => setShowResetModal(null)}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1E40AF" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Reset password for {showResetModal.name}?</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>A new temporary password will be generated and sent to <strong>{showResetModal.email}</strong></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowResetModal(null)}>Cancel</button>
              <button className="btn-primary" style={{ background: '#1E40AF' }} onClick={() => setShowResetModal(null)}>Send Reset Link</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">View and manage all school administrators</div>
            <h1>Admin Management</h1>
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card blue"><div className="stat-value">{admins.length}</div><div className="stat-label">Total Admins</div></div>
          <div className="stat-card green"><div className="stat-value">{admins.filter(a => a.status === "Active").length}</div><div className="stat-label">Active</div></div>
          <div className="stat-card orange"><div className="stat-value">{admins.filter(a => a.status === "Revoked").length}</div><div className="stat-label">Revoked</div></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="table-filters">
              <div className="search-box">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search admins or schools…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(["All", "Active", "Revoked"] as const).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.2s',
                    borderColor: statusFilter === s ? '#1E40AF' : 'var(--border)',
                    background: statusFilter === s ? '#DBEAFE' : 'white',
                    color: statusFilter === s ? '#1E40AF' : 'var(--text-secondary)',
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div className="table-count">{filtered.length} admins</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Admin</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>School</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Plan</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Last Login</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="avatar" style={{ background: a.status === 'Active' ? '#1E40AF' : '#94A3B8', width: '34px', height: '34px', fontSize: '12px' }}>
                          {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{a.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px' }}>{a.school}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>{a.city}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', background: '#DBEAFE', padding: '4px 8px', borderRadius: '6px' }}>{a.plan}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-meta)' }}>{a.lastLogin}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.status === 'Active' ? 'var(--green)' : 'var(--red)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{a.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px' }} onClick={() => setShowDetailModal(a)}>View</button>
                        <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px', color: a.status === 'Active' ? 'var(--red)' : 'var(--green-dark)', borderColor: a.status === 'Active' ? 'var(--red)' : 'var(--green-dark)' }} onClick={() => toggleAccess(a.id)}>
                          {a.status === 'Active' ? 'Revoke' : 'Restore'}
                        </button>
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

"use client";

import { useState } from "react";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";

interface School {
  id: number; name: string; city: string; state: string; board: string;
  adminName: string; adminEmail: string; adminPhone: string;
  plan: "Basic" | "Pro" | "Enterprise"; status: "Active" | "Suspended";
  registeredDate: string; students: number;
}

const initialSchools: School[] = [
  { id: 1, name: "EduFlow Academy", city: "Noida", state: "Uttar Pradesh", board: "CBSE", adminName: "Dr. Rajendra Kumar", adminEmail: "admin@eduflow.edu.in", adminPhone: "+91 98765 00001", plan: "Pro", status: "Active", registeredDate: "Jan 15, 2026", students: 1247 },
  { id: 2, name: "Greenfield Public School", city: "Lucknow", state: "Uttar Pradesh", board: "ICSE", adminName: "Mrs. Kavita Nair", adminEmail: "admin@greenfield.edu.in", adminPhone: "+91 98765 00002", plan: "Basic", status: "Active", registeredDate: "Feb 8, 2026", students: 680 },
  { id: 3, name: "St. Mary's Convent", city: "Dehradun", state: "Uttarakhand", board: "CBSE", adminName: "Fr. Thomas", adminEmail: "admin@stmarys.edu.in", adminPhone: "+91 98765 00003", plan: "Enterprise", status: "Active", registeredDate: "Feb 20, 2026", students: 2100 },
  { id: 4, name: "DAV Model School", city: "Chandigarh", state: "Punjab", board: "CBSE", adminName: "Mr. Suresh Yadav", adminEmail: "admin@dav.edu.in", adminPhone: "+91 98765 00004", plan: "Pro", status: "Active", registeredDate: "Mar 1, 2026", students: 1500 },
  { id: 5, name: "Ryan International", city: "Mumbai", state: "Maharashtra", board: "ICSE", adminName: "Ms. Priya Shah", adminEmail: "admin@ryan.edu.in", adminPhone: "+91 98765 00005", plan: "Enterprise", status: "Active", registeredDate: "Mar 5, 2026", students: 3200 },
  { id: 6, name: "Sunshine Academy", city: "Jaipur", state: "Rajasthan", board: "State Board", adminName: "Mr. Arjun Meena", adminEmail: "admin@sunshine.edu.in", adminPhone: "+91 98765 00006", plan: "Basic", status: "Suspended", registeredDate: "Mar 10, 2026", students: 420 },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<School | null>(null);
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", city: "", state: "", board: "CBSE", adminName: "", adminEmail: "", adminPhone: "", plan: "Pro" as School["plan"] });

  const filtered = schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()));

  const handleRegister = () => {
    const newSchool: School = {
      id: Date.now(), name: form.name, city: form.city, state: form.state, board: form.board,
      adminName: form.adminName, adminEmail: form.adminEmail, adminPhone: form.adminPhone,
      plan: form.plan, status: "Active",
      registeredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      students: 0,
    };
    setSchools([newSchool, ...schools]);
    setShowRegisterModal(false);
    setStep(1);
    setForm({ name: "", city: "", state: "", board: "CBSE", adminName: "", adminEmail: "", adminPhone: "", plan: "Pro" });
  };

  const toggleStatus = (id: number) => {
    setSchools(schools.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" } : s));
    setShowDetailModal(null);
  };

  return (
    <>
      <SuperAdminSidebar activePage="schools" />

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Register New School</div>
              <button className="icon-btn" onClick={() => { setShowRegisterModal(false); setStep(1); }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Progress */}
            <div style={{ padding: '0 24px', display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? '#1E40AF' : '#E5E7EB', transition: 'background 0.3s' }} />
              ))}
            </div>
            <div style={{ padding: '4px 24px 0', fontSize: '12px', color: 'var(--text-meta)' }}>Step {step} of 3: {step === 1 ? 'School Details' : step === 2 ? 'Admin Appointment' : 'Subscription Plan'}</div>

            <div className="modal-body">
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">School Name *</label>
                    <input className="form-input" placeholder="e.g. Delhi Public School" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">State</label><input className="form-input" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} /></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Board Affiliation</label>
                    <select className="form-input" value={form.board} onChange={e => setForm({...form, board: e.target.value})}>
                      <option>CBSE</option><option>ICSE</option><option>State Board</option><option>IB</option><option>Cambridge</option>
                    </select>
                  </div>
                  {/* Documents */}
                  <div>
                    <label className="form-label">Upload School Documents</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                      {['Registration Certificate', 'NOC / Affiliation'].map(doc => (
                        <div key={doc} style={{ padding: '20px', border: '2px dashed #D1D5DB', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" style={{ margin: '0 auto 8px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>{doc}</div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>PDF, JPG (Max 5MB)</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#DBEAFE', borderRadius: '12px', fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
                    👤 Appoint a school administrator who will manage the institution on your platform.
                  </div>
                  <div className="form-group"><label className="form-label">Admin Full Name *</label><input className="form-input" placeholder="e.g. Dr. Rajendra Kumar" value={form.adminName} onChange={e => setForm({...form, adminName: e.target.value})} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group"><label className="form-label">Admin Email *</label><input className="form-input" type="email" placeholder="admin@school.edu.in" value={form.adminEmail} onChange={e => setForm({...form, adminEmail: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">Admin Phone</label><input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.adminPhone} onChange={e => setForm({...form, adminPhone: e.target.value})} /></div>
                  </div>
                  <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-meta)' }}>
                    <strong>Temporary credentials</strong> will be auto-generated and sent to the admin's email upon registration.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {([
                      { name: "Basic", price: "₹4,999/mo", feat: ["500 students", "Basic Reports"], color: "#3B82F6", popular: false },
                      { name: "Pro", price: "₹9,999/mo", feat: ["2000 students", "Analytics", "Finance"], color: "#1E40AF", popular: true },
                      { name: "Enterprise", price: "₹19,999/mo", feat: ["Unlimited", "Custom", "API"], color: "#059669", popular: false },
                    ]).map(p => (
                      <div key={p.name} onClick={() => setForm({...form, plan: p.name as School["plan"]})} style={{
                        padding: '16px', borderRadius: '14px', border: `2px solid ${form.plan === p.name ? p.color : '#E5E7EB'}`,
                        background: form.plan === p.name ? `${p.color}08` : 'white', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', textAlign: 'center',
                      }}>
                        {p.popular && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: p.color, color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>POPULAR</div>}
                        <div style={{ fontSize: '15px', fontWeight: 700, color: p.color }}>{p.name}</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0' }}>{p.price}</div>
                        {p.feat.map(f => (
                          <div key={f} style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>✓ {f}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {step > 1 && <button className="btn-outline" onClick={() => setStep(step - 1)}>← Back</button>}
              {step < 3 ? (
                <button className="btn-primary" style={{ background: '#1E40AF', marginLeft: 'auto' }} onClick={() => setStep(step + 1)} disabled={step === 1 && !form.name}>Continue →</button>
              ) : (
                <button className="btn-primary" style={{ background: '#1E40AF', marginLeft: 'auto' }} onClick={handleRegister}>Register School</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(null)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">School Details</div>
              <button className="icon-btn" onClick={() => setShowDetailModal(null)}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{showDetailModal.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>{showDetailModal.city}, {showDetailModal.state} · {showDetailModal.board}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: '#1E40AF' }}>{showDetailModal.students.toLocaleString()}</div><div style={{ fontSize: '11px', color: 'var(--text-meta)', fontWeight: 600 }}>STUDENTS</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED' }}>{showDetailModal.plan}</div><div style={{ fontSize: '11px', color: 'var(--text-meta)', fontWeight: 600 }}>PLAN</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: showDetailModal.status === 'Active' ? 'var(--green-dark)' : 'var(--red)' }}>{showDetailModal.status}</div><div style={{ fontSize: '11px', color: 'var(--text-meta)', fontWeight: 600 }}>STATUS</div></div>
                </div>
              </div>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>Appointed Admin</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Name', value: showDetailModal.adminName },
                  { label: 'Email', value: showDetailModal.adminEmail },
                  { label: 'Phone', value: showDetailModal.adminPhone },
                  { label: 'Registered', value: showDetailModal.registeredDate },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-meta)', fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" style={{ color: showDetailModal.status === 'Active' ? 'var(--red)' : 'var(--green-dark)', borderColor: showDetailModal.status === 'Active' ? 'var(--red)' : 'var(--green-dark)' }} onClick={() => toggleStatus(showDetailModal.id)}>
                {showDetailModal.status === 'Active' ? '⏸ Suspend School' : '▶ Reactivate School'}
              </button>
              <button className="btn-outline" onClick={() => setShowDetailModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Register & manage client schools</div>
            <h1>School Management</h1>
          </div>
          <div className="topbar-right">
            <button className="btn-primary" style={{ background: '#1E40AF', boxShadow: '0 4px 12px rgba(30,64,175,0.2)' }} onClick={() => setShowRegisterModal(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Register School
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card blue"><div className="stat-value">{schools.length}</div><div className="stat-label">Total Schools</div></div>
          <div className="stat-card green"><div className="stat-value">{schools.filter(s => s.status === 'Active').length}</div><div className="stat-label">Active</div></div>
          <div className="stat-card orange"><div className="stat-value">{schools.filter(s => s.status === 'Suspended').length}</div><div className="stat-label">Suspended</div></div>
          <div className="stat-card purple"><div className="stat-value">{schools.reduce((a, b) => a + b.students, 0).toLocaleString()}</div><div className="stat-label">Total Students</div></div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="table-filters">
              <div className="search-box">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search schools…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="table-count">{filtered.length} schools</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>School</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Admin</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Plan</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Students</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>{s.city}, {s.state} · {s.board}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px' }}>{s.adminName}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', background: '#DBEAFE', padding: '4px 8px', borderRadius: '6px' }}>{s.plan}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700 }}>{s.students.toLocaleString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.status === 'Active' ? 'var(--green)' : 'var(--red)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{s.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button className="btn-outline" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => setShowDetailModal(s)}>Details</button>
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

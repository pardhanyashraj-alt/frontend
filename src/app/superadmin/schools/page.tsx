"use client";

import { useState, useRef, useMemo } from "react";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";
import { State, City } from "country-state-city";

interface School {
  id: number; name: string; city: string; state: string; board: string;
  adminName: string; adminEmail: string; adminPhone: string;
  plan: "Basic" | "Pro" | "Enterprise" | "Trial" | "Paid";
  status: "Active" | "Suspended";
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

const emptyForm = {
  school_name: "",
  admin_email: "",
  city: "",
  state: "",
  board: "CBSE",
  affiliation_number: "",
  school_address: "",
  school_phone: "",
  registration_certificate: null as File | null,
  noc_affiliation: null as File | null,
  admin_first_name: "",
  admin_last_name: "",
  admin_phone: "",
  admin_date_of_birth: "",
  plan: "Trial" as School["plan"],
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<School | null>(null);
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState(false);
  const certRef = useRef<HTMLInputElement>(null);
  const nocRef = useRef<HTMLInputElement>(null);

  const statesList = useMemo(() => State.getStatesOfCountry("IN"), []);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // When editing or if state is already set (not common for register, but good practice)
  const handleStateChange = (stateCode: string) => {
    setForm(prev => ({ ...prev, state: stateCode, city: "" }));
    setCitiesList(City.getCitiesOfState("IN", stateCode));
    if (errors.state) setErrors(prev => { const n = { ...prev }; delete n.state; return n; });
    if (errors.city) setErrors(prev => { const n = { ...prev }; delete n.city; return n; });
  };

  const filtered = schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()));

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => !phone || /^[0-9+\-\s()]{7,15}$/.test(phone);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.school_name.trim()) e.school_name = "School name is required";
    if (!form.admin_email.trim()) e.admin_email = "Admin email is required";
    else if (!isValidEmail(form.admin_email)) e.admin_email = "Enter a valid email";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.board) e.board = "Board is required";
    if (!form.affiliation_number.trim()) e.affiliation_number = "Affiliation number is required";
    if (form.school_phone && !isValidPhone(form.school_phone)) e.school_phone = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.admin_first_name.trim()) e.admin_first_name = "First name is required";
    if (!form.admin_email.trim()) e.admin_email = "Admin email is required";
    else if (!isValidEmail(form.admin_email)) e.admin_email = "Enter a valid email";
    if (form.admin_phone && !isValidPhone(form.admin_phone)) e.admin_phone = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (key: 'registration_certificate' | 'noc_affiliation', file: File | null) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    const fieldE: Record<string, string> = { ...errors };
    if (!allowed.includes(file.type)) {
      fieldE[key] = 'Only PDF, JPG, PNG allowed';
      setErrors(fieldE);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      fieldE[key] = 'File must be under 5MB';
      setErrors(fieldE);
      return;
    }
    delete fieldE[key];
    setErrors(fieldE);
    setForm({ ...form, [key]: file });
  };

  const handleContinue = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep(step + 1);
  };

  const handleRegister = () => {
    console.log('📋 Register School Form Data:', form);
    const newSchool: School = {
      id: Date.now(),
      name: form.school_name,
      city: form.city,
      state: form.state,
      board: form.board,
      adminName: `${form.admin_first_name} ${form.admin_last_name}`.trim(),
      adminEmail: form.admin_email,
      adminPhone: form.admin_phone,
      plan: form.plan,
      status: "Active",
      registeredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      students: 0,
    };
    setSchools([newSchool, ...schools]);
    setShowRegisterModal(false);
    setStep(1);
    setForm({ ...emptyForm });
    setErrors({});
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  const closeModal = () => { setShowRegisterModal(false); setStep(1); setForm({ ...emptyForm }); setErrors({}); };

  const toggleStatus = (id: number) => {
    setSchools(schools.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" } : s));
    setShowDetailModal(null);
  };

  return (
    <>
      <SuperAdminSidebar activePage="schools" />

      {/* Success Toast */}
      {successToast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, background: '#059669', color: 'white', padding: '14px 22px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 30px rgba(5,150,105,0.35)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          School registered successfully! 🎉
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Register New School</div>
              <button className="icon-btn" onClick={closeModal}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Progress Stepper */}
            <div style={{ padding: '0 24px', display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? '#1E40AF' : '#E5E7EB', transition: 'background 0.3s' }} />
              ))}
            </div>
            <div style={{ padding: '4px 24px 0', fontSize: '12px', color: 'var(--text-meta)' }}>Step {step} of 3: {step === 1 ? 'School Details' : step === 2 ? 'Admin Appointment' : 'Subscription Plan'}</div>

            <div className="modal-body">

              {/* ── STEP 1: SCHOOL DETAILS ── */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Required */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required Information</div>

                  <div className="form-group">
                    <label className="form-label">School Name *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Delhi Public School"
                      value={form.school_name}
                      onChange={e => setForm({ ...form, school_name: e.target.value })}
                      style={{ borderColor: errors.school_name ? '#EF4444' : '' }}
                    />
                    {errors.school_name && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.school_name}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admin Email *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="admin@school.edu.in"
                      value={form.admin_email}
                      onChange={e => setForm({ ...form, admin_email: e.target.value })}
                      style={{ borderColor: errors.admin_email ? '#EF4444' : '' }}
                    />
                    {errors.admin_email && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.admin_email}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <select
                        className="form-input"
                        value={form.state}
                        onChange={e => handleStateChange(e.target.value)}
                        style={{ borderColor: errors.state ? '#EF4444' : '' }}
                      >
                        <option value="">Select State</option>
                        {statesList.map(s => (
                          <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                        ))}
                      </select>
                      {errors.state && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.state}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <select
                        className="form-input"
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        disabled={!form.state}
                        style={{ borderColor: errors.city ? '#EF4444' : '', opacity: !form.state ? 0.6 : 1, cursor: !form.state ? 'not-allowed' : 'pointer' }}
                      >
                        <option value="">Select City</option>
                        {citiesList.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      {errors.city && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.city}</div>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Board *</label>
                      <select
                        className="form-input"
                        value={form.board}
                        onChange={e => setForm({ ...form, board: e.target.value })}
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Affiliation Number *</label>
                      <input
                        className="form-input"
                        placeholder="e.g. 1234567"
                        value={form.affiliation_number}
                        onChange={e => setForm({ ...form, affiliation_number: e.target.value })}
                        style={{ borderColor: errors.affiliation_number ? '#EF4444' : '' }}
                      />
                      {errors.affiliation_number && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.affiliation_number}</div>}
                    </div>
                  </div>

                  {/* Optional */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Optional Information</div>

                  <div className="form-group">
                    <label className="form-label">School Address</label>
                    <input
                      className="form-input"
                      placeholder="Full address"
                      value={form.school_address}
                      onChange={e => setForm({ ...form, school_address: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">School Phone</label>
                    <input
                      className="form-input"
                      placeholder="10-digit number"
                      value={form.school_phone}
                      onChange={e => setForm({ ...form, school_phone: e.target.value.replace(/[^0-9+\-\s()]/g, '') })}
                      style={{ borderColor: errors.school_phone ? '#EF4444' : '' }}
                    />
                    {errors.school_phone && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.school_phone}</div>}
                  </div>

                  {/* File Uploads */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Document Uploads (Optional)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { key: 'registration_certificate' as const, label: 'Registration Certificate', ref: certRef },
                      { key: 'noc_affiliation' as const, label: 'NOC / Affiliation', ref: nocRef },
                    ].map(({ key, label, ref }) => (
                      <div key={key}>
                        <input type="file" ref={ref} style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange(key, e.target.files?.[0] ?? null)} />
                        <div
                          onClick={() => ref.current?.click()}
                          style={{ padding: '16px', border: `2px dashed ${errors[key] ? '#EF4444' : form[key] ? '#1E40AF' : '#D1D5DB'}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: form[key] ? '#EFF6FF' : 'transparent', transition: 'all 0.2s' }}
                        >
                          {form[key] ? (
                            <>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#1E40AF" strokeWidth="2" style={{ margin: '0 auto 4px' }}><polyline points="20 6 9 17 4 12"/></svg>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: '#1E40AF' }}>{(form[key] as File).name.length > 20 ? (form[key] as File).name.substring(0, 18) + '…' : (form[key] as File).name}</div>
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" style={{ margin: '0 auto 6px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>{label}</div>
                              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>PDF, JPG, PNG · Max 5MB</div>
                            </>
                          )}
                        </div>
                        {errors[key] && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors[key]}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 2: ADMIN APPOINTMENT ── */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '14px 16px', background: '#DBEAFE', borderRadius: '12px', fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
                    👤 Appoint a school administrator who will manage the institution on your platform.
                  </div>

                  {/* Required */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required Information</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Rajendra"
                        value={form.admin_first_name}
                        onChange={e => setForm({ ...form, admin_first_name: e.target.value })}
                        style={{ borderColor: errors.admin_first_name ? '#EF4444' : '' }}
                      />
                      {errors.admin_first_name && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.admin_first_name}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Kumar"
                        value={form.admin_last_name}
                        onChange={e => setForm({ ...form, admin_last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admin Email *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="admin@school.edu.in"
                      value={form.admin_email}
                      onChange={e => setForm({ ...form, admin_email: e.target.value })}
                      style={{ borderColor: errors.admin_email ? '#EF4444' : '' }}
                    />
                    {errors.admin_email && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.admin_email}</div>}
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Pre-filled from Step 1 — edit if different</div>
                  </div>

                  {/* Optional */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Optional Information</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Admin Phone</label>
                      <input
                        className="form-input"
                        placeholder="10-digit number"
                        value={form.admin_phone}
                        onChange={e => setForm({ ...form, admin_phone: e.target.value.replace(/[^0-9+\-\s()]/g, '') })}
                        style={{ borderColor: errors.admin_phone ? '#EF4444' : '' }}
                      />
                      {errors.admin_phone && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.admin_phone}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        className="form-input"
                        type="date"
                        value={form.admin_date_of_birth}
                        onChange={e => setForm({ ...form, admin_date_of_birth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-meta)' }}>
                    <strong>Temporary credentials</strong> will be auto-generated and sent to the admin's email upon registration.
                  </div>
                </div>
              )}

              {/* ── STEP 3: SUBSCRIPTION PLAN ── */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {([
                      { name: "Trial", title: "7-Day Free Trial", price: "₹0 for 7 days", feat: ["Full Platform Access", "Up to 500 Students", "No Credit Card Required"], color: "#059669", popular: false },
                      { name: "Paid", title: "Paid Plan", price: "Custom Pricing", feat: ["Unlimited Students", "Advanced Analytics", "Priority Support"], color: "#1E40AF", popular: true },
                    ]).map(p => (
                      <div key={p.name} onClick={() => setForm({ ...form, plan: p.name as School["plan"] })} style={{
                        padding: '20px', borderRadius: '14px', border: `2px solid ${form.plan === p.name ? p.color : '#E5E7EB'}`,
                        background: form.plan === p.name ? `${p.color}08` : 'white', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', textAlign: 'center',
                      }}>
                        {p.popular && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: p.color, color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>RECOMMENDED</div>}
                        <div style={{ fontSize: '18px', fontWeight: 800, color: p.color }}>{p.title}</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0' }}>{p.price}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                          {p.feat.map(f => (
                            <div key={f} style={{ fontSize: '12px', color: '#6B7280' }}>✓ {f}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {step > 1 && <button className="btn-outline" onClick={() => setStep(step - 1)}>← Back</button>}
              {step < 3 ? (
                <button 
                  className="btn-primary" 
                  style={{ background: '#1E40AF', marginLeft: 'auto', opacity: (step === 1 && (!form.school_name || !form.admin_email || !form.state || !form.city || !form.board || !form.affiliation_number)) ? 0.6 : 1 }} 
                  onClick={handleContinue}
                  disabled={step === 1 && (!form.school_name || !form.admin_email || !form.state || !form.city || !form.board || !form.affiliation_number)}
                >
                  Continue →
                </button>
              ) : (
                <button className="btn-primary" style={{ background: '#1E40AF', marginLeft: 'auto' }} onClick={handleRegister} disabled={!form.plan}>Register School</button>
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

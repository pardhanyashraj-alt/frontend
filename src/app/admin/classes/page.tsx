"use client";

import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useAdminContext, ClassRecord } from "../../../context/AdminContext";

const classOptions = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sectionOptions = ["A", "B", "C", "D", "E"];

export default function ClassesManagement() {
  const { classes, teachers, currentAcademicYear, addClass, updateClass, deleteClass, promoteStudents } = useAdminContext();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<ClassRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<ClassRecord | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [nextYear, setNextYear] = useState("2025-26");

  // Form states
  const [newClass, setNewClass] = useState<Partial<ClassRecord>>({
    className: "", section: "", assignments: [], students: []
  });
  const [studentSearch, setStudentSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const currentClasses = classes.filter(c => c.academicYear === currentAcademicYear);
  const filtered = currentClasses.filter(c => 
    c.className.toLowerCase().includes(search.toLowerCase()) || 
    c.assignments.some(a => teachers.find(t => t.id === a.teacherId)?.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = () => {
    if (!newClass.className) return;
    
    if (isEditing && editingId) {
      updateClass(editingId, {
        className: newClass.className || "",
        section: newClass.section || "",
        assignments: newClass.assignments || [],
      });
    } else {
      const colors = ["var(--blue)", "var(--orange)", "var(--green)", "var(--purple)", "var(--blue-mid)"];
      addClass({
        className: newClass.className || "",
        section: newClass.section || "",
        assignments: newClass.assignments || [],
        students: [],
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
    setNewClass({ className: "", section: "", assignments: [], students: [] });
  };

  const handleEditClick = (c: ClassRecord) => {
    setNewClass({
      className: c.className,
      section: c.section,
      assignments: [...c.assignments],
      students: [...c.students],
    });
    setEditingId(c.id);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const addAssignment = () => {
    setNewClass({...newClass, assignments: [...(newClass.assignments || []), { teacherId: 0, subject: "", isClassTeacher: false }]});
  };

  const updateAssignment = (index: number, field: string, value: any) => {
    const updated = [...(newClass.assignments || [])];
    if (field === "isClassTeacher" && value === true) {
      updated.forEach(a => a.isClassTeacher = false);
    }
    updated[index] = { ...updated[index], [field]: value };
    setNewClass({...newClass, assignments: updated});
  };

  const removeAssignment = (index: number) => {
    const updated = [...(newClass.assignments || [])];
    updated.splice(index, 1);
    setNewClass({...newClass, assignments: updated});
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

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">{isEditing ? "Edit Class" : "Create Class"}</div>
              <button className="icon-btn" onClick={closeCreateModal}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Class *</label>
                  <select 
                    className="form-input" 
                    value={newClass.className} 
                    onChange={e => setNewClass({...newClass, className: e.target.value})}
                  >
                    <option value="" disabled>Select Class</option>
                    {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Section</label>
                  <select 
                    className="form-input" 
                    value={newClass.section} 
                    onChange={e => setNewClass({...newClass, section: e.target.value})}
                  >
                    <option value="" disabled>Select Section</option>
                    {sectionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label">Subjects & Teachers</label>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={addAssignment}>+ Add</button>
                </div>
                {(!newClass.assignments || newClass.assignments.length === 0) ? (
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-meta)' }}>No teachers assigned yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {newClass.assignments.map((assignment, index) => (
                      <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(120px, 1fr) auto auto', gap: '8px', alignItems: 'center', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <select 
                          className="form-input" 
                          style={{ padding: '6px' }}
                          value={assignment.teacherId || ""}
                          onChange={e => updateAssignment(index, 'teacherId', parseInt(e.target.value))}
                        >
                          <option value="" disabled>Select Teacher</option>
                          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <input 
                          className="form-input" 
                          style={{ padding: '6px' }}
                          placeholder="Subject (e.g. Math)" 
                          value={assignment.subject} 
                          onChange={e => updateAssignment(index, 'subject', e.target.value)} 
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="classTeacher" 
                            checked={assignment.isClassTeacher} 
                            onChange={() => updateAssignment(index, 'isClassTeacher', true)} 
                          />
                          Class Teacher
                        </label>
                        <button className="icon-btn" style={{ color: 'var(--red)' }} onClick={() => removeAssignment(index)}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={closeCreateModal}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--purple)' }} onClick={handleCreate} disabled={!newClass.className}>
                {isEditing ? "Save Changes" : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {showDetailsModal && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Class Details</div>
              <button className="icon-btn" onClick={() => setShowDetailsModal(null)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
                <div className="avatar" style={{ background: showDetailsModal.color, width: '64px', height: '64px', fontSize: '24px' }}>
                  {showDetailsModal.className.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{showDetailsModal.className}</h2>
                  <div style={{ fontSize: '14px', color: 'var(--text-meta)' }}>Section: {showDetailsModal.section || '-'}</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase', marginBottom: '12px' }}>Teachers & Subjects</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {showDetailsModal.assignments.length > 0 ? showDetailsModal.assignments.map((assignment, i) => {
                      const teacherName = teachers.find(t => t.id === assignment.teacherId)?.name || 'Unknown';
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: assignment.isClassTeacher ? '1px solid var(--purple)' : '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar" style={{ background: assignment.isClassTeacher ? 'var(--purple)' : 'var(--blue-mid)', width: '32px', height: '32px', fontSize: '12px' }}>
                              {teacherName.split(' ').map(n=>n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{teacherName}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>{assignment.subject || 'No Subject'}</div>
                            </div>
                          </div>
                          {assignment.isClassTeacher && (
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--purple)', background: '#F3E8FF', padding: '4px 8px', borderRadius: '4px' }}>CLASS TEACHER</span>
                          )}
                        </div>
                      );
                    }) : <div style={{ fontSize: '13px', color: 'var(--text-meta)' }}>No teachers assigned</div>}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase', margin: 0 }}>Students Enrolled ({showDetailsModal.students.length})</h3>
                </div>
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                  {showDetailsModal.students.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {showDetailsModal.students.map((studentId, i) => (
                           // In a real app we would map this studentId to a full student object. 
                           // For now, we'll just show the ID.
                          <tr key={i} style={{ borderBottom: i < showDetailsModal.students.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Student #{studentId}</div>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-meta)', textAlign: 'right' }}>ID: #{studentId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-meta)', fontSize: '14px' }}>No students enrolled in this class yet.</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowDetailsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '48px', height: '48px', background: '#FEE2E2', color: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>Delete Class?</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-meta)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{showDeleteModal.className}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-outline" onClick={() => setShowDeleteModal(null)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--red)', boxShadow: 'none' }} onClick={handleDelete}>Delete Class</button>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTE CONFIRMATION MODAL */}
      {showPromoteModal && (
        <div className="modal-overlay" onClick={() => setShowPromoteModal(false)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">Yearly Class Promotion</div>
              <button className="icon-btn" onClick={() => setShowPromoteModal(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '14px', color: 'var(--text-meta)', marginBottom: '16px', lineHeight: 1.5 }}>
                Promoting students will generate classes for the next academic year and automatically move active students to the next grade. Grade 12 students will be marked as Graduated.
              </p>
              <div className="form-group">
                <label className="form-label">Current Academic Year</label>
                <input className="form-input" value={currentAcademicYear} disabled style={{ background: '#F8FAFC' }} />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Next Academic Year</label>
                <input className="form-input" placeholder="e.g. 2025-26" value={nextYear} onChange={e => setNextYear(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '24px' }}>
              <button className="btn-outline" onClick={() => setShowPromoteModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--orange)', border: 'none' }} onClick={handlePromote} disabled={!nextYear}>Promote All</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Academic Year: {currentAcademicYear}</div>
            <h1>Classes Management</h1>
          </div>
          <div className="topbar-right" style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" style={{ background: '#FFF7ED', color: 'var(--orange)', border: '1px solid rgba(249, 115, 22, 0.2)' }} onClick={() => setShowPromoteModal(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Promote Students
            </button>
            <button className="btn-primary" style={{ background: 'var(--purple)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }} onClick={() => setShowCreateModal(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Class
            </button>
          </div>
        </div>

        {/* Classes Table */}
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
                  placeholder="Search classes or teachers…" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
            </div>
            <div className="table-count">{filtered.length} classes</div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Class Name</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Section</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Assigned Teacher</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Total Students</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Subjects</th>
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const classTeacherAssign = c.assignments.find(a => a.isClassTeacher);
                  const classTeacherName = classTeacherAssign 
                    ? teachers.find(t => t.id === classTeacherAssign.teacherId)?.name 
                    : "Unassigned";
                  const subjects = c.assignments.map(a => a.subject).filter(Boolean);

                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div className="avatar" style={{ background: c.color, width: '34px', height: '34px', fontSize: '12px' }}>
                            {c.className.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.className}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 500 }}>{c.section || '-'}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                        <div style={{ fontWeight: 500, color: classTeacherName === "Unassigned" ? "var(--text-meta)" : "inherit" }}>
                          {classTeacherName}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px' }}>{c.students.length}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {subjects.length > 0 ? subjects.slice(0, 2).map((sub, i) => (
                            <span key={i} style={{ fontSize: '11px', color: 'var(--blue)', background: 'var(--blue-light)', padding: '2px 6px', borderRadius: '4px' }}>
                              {sub}
                            </span>
                          )) : <span style={{ fontSize: '12px', color: 'var(--text-meta)' }}>None</span>}
                          {subjects.length > 2 && (
                            <span style={{ fontSize: '11px', color: 'var(--text-meta)', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                              +{subjects.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px' }} onClick={() => setShowDetailsModal(c)}>View</button>
                          <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px' }} onClick={() => handleEditClick(c)}>Edit</button>
                          <button className="btn-outline" style={{ padding: '5px 8px', fontSize: '11px', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => setShowDeleteModal(c)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-meta)' }}>
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

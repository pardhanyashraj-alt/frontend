"use client";

import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const classOptions = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sectionOptions = ["A", "B", "C", "D", "E"];

// --- Types ---
interface StudentSelection {
  id: number;
  name: string;
  rollNo?: string;
  enrollmentNo?: string;
}

interface ClassRecord {
  id: number;
  className: string;
  section: string;
  teacherId: number;
  teacherName: string;
  students: StudentSelection[];
  subjects: string[];
  color: string;
}

// --- Mock Data ---
const mockTeachers = [
  { id: 1, name: "Ms. Rita Sharma" },
  { id: 2, name: "Mrs. Sunita Gupta" },
  { id: 3, name: "Mr. David Wilson" },
  { id: 4, name: "Ms. Priya Mehta" },
  { id: 5, name: "Mr. Anil Verma" },
];

const mockStudents = [
  { id: 101, name: "Anjali Kapoor" },
  { id: 102, name: "Rohan Mehta" },
  { id: 103, name: "Shreya Mishra" },
  { id: 104, name: "Aryan Sharma" },
  { id: 105, name: "Priya Patel" },
  { id: 106, name: "Vikram Singh" },
  { id: 107, name: "Neha Gupta" },
  { id: 108, name: "Kabir Das" },
];

const initialClasses: ClassRecord[] = [
  {
    id: 1,
    className: "Grade 10",
    section: "A",
    teacherId: 1,
    teacherName: "Ms. Rita Sharma",
    students: [
      { ...mockStudents[0], rollNo: "1", enrollmentNo: "ENR101" },
      { ...mockStudents[1], rollNo: "2", enrollmentNo: "ENR102" }
    ],
    subjects: ["Mathematics", "Science", "English"],
    color: "var(--blue)",
  },
  {
    id: 2,
    className: "Grade 9",
    section: "B",
    teacherId: 2,
    teacherName: "Mrs. Sunita Gupta",
    students: [
      { ...mockStudents[2], rollNo: "1", enrollmentNo: "ENR901" },
      { ...mockStudents[6], rollNo: "5", enrollmentNo: "ENR905" }
    ],
    subjects: ["Science", "Computer Science"],
    color: "var(--orange)",
  },
];

export default function ClassesManagement() {
  const [classesList, setClassesList] = useState<ClassRecord[]>(initialClasses);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<ClassRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<ClassRecord | null>(null);

  // Form states
  const [newClass, setNewClass] = useState<Partial<ClassRecord>>({
    className: "", section: "", teacherId: 0, teacherName: "", students: [], subjects: []
  });
  const [newSubject, setNewSubject] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = classesList.filter(c => 
    c.className.toLowerCase().includes(search.toLowerCase()) || 
    c.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newClass.className) return;
    
    if (isEditing && editingId) {
      setClassesList(classesList.map(c => 
        c.id === editingId 
          ? { 
              ...c, 
              className: newClass.className || "",
              section: newClass.section || "",
              teacherId: newClass.teacherId || 0,
              teacherName: newClass.teacherName || "",
              students: newClass.students || [],
              subjects: newClass.subjects || []
            } 
          : c
      ));
    } else {
      const colors = ["var(--blue)", "var(--orange)", "var(--green)", "var(--purple)", "var(--blue-mid)"];
      setClassesList([...classesList, {
        id: Date.now(),
        className: newClass.className || "",
        section: newClass.section || "",
        teacherId: 0,
        teacherName: "Unassigned",
        students: [],
        subjects: [],
        color: colors[Math.floor(Math.random() * colors.length)],
      }]);
    }
    
    closeCreateModal();
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setIsEditing(false);
    setEditingId(null);
    setNewClass({ className: "", section: "", teacherId: 0, teacherName: "", students: [], subjects: [] });
  };

  const handleEditClick = (c: ClassRecord) => {
    setNewClass({
      className: c.className,
      section: c.section,
      teacherId: c.teacherId,
      teacherName: c.teacherName,
      students: [...c.students],
      subjects: [...c.subjects]
    });
    setEditingId(c.id);
    setIsEditing(true);
    setShowCreateModal(true);
  };


  const handleDelete = () => {
    if (showDeleteModal) {
      setClassesList(classesList.filter(c => c.id !== showDeleteModal.id));
      setShowDeleteModal(null);
    }
  };

  const addSubject = () => {
    if (newSubject.trim() && !newClass.subjects?.includes(newSubject.trim())) {
      setNewClass({ ...newClass, subjects: [...(newClass.subjects || []), newSubject.trim()] });
      setNewSubject("");
    }
  };

  const removeSubject = (subjectToRemove: string) => {
    setNewClass({ ...newClass, subjects: newClass.subjects?.filter(s => s !== subjectToRemove) });
  };

  const toggleStudent = (student: StudentSelection) => {
    const isSelected = newClass.students?.some(s => s.id === student.id);
    if (isSelected) {
      setNewClass({ ...newClass, students: newClass.students?.filter(s => s.id !== student.id) });
    } else {
      setNewClass({ ...newClass, students: [...(newClass.students || []), { ...student, rollNo: "", enrollmentNo: "" }] });
    }
  };

  const updateStudentField = (id: number, field: "rollNo" | "enrollmentNo", value: string) => {
    setNewClass({
      ...newClass,
      students: newClass.students?.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const filteredStudents = mockStudents.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));

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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase', marginBottom: '12px' }}>Class Teacher</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div className="avatar" style={{ background: 'var(--purple)', width: '32px', height: '32px', fontSize: '12px' }}>
                      {showDetailsModal.teacherName.split(' ').map(n=>n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{showDetailsModal.teacherName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>Primary Educator</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-meta)', textTransform: 'uppercase', marginBottom: '12px' }}>Subjects ({showDetailsModal.subjects.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {showDetailsModal.subjects.length > 0 ? showDetailsModal.subjects.map((sub, i) => (
                      <span key={i} style={{ fontSize: '13px', color: 'var(--blue-dark)', background: '#E0F2FE', padding: '4px 10px', borderRadius: '6px', fontWeight: 500 }}>{sub}</span>
                    )) : <span style={{ fontSize: '13px', color: 'var(--text-meta)' }}>No subjects added</span>}
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
                        {showDetailsModal.students.map((student, i) => (
                          <tr key={i} style={{ borderBottom: i < showDetailsModal.students.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{student.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-meta)', marginTop: '2px' }}>Roll No: {student.rollNo || '-'} • Enrollment: {student.enrollmentNo || '-'}</div>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-meta)', textAlign: 'right' }}>ID: #{student.id}</td>
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

      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Academic Structure</div>
            <h1>Classes Management</h1>
          </div>
          <div className="topbar-right">
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
                {filtered.map(c => (
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
                    <td style={{ padding: '16px 20px', fontSize: '14px' }}>{c.teacherName}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px' }}>{c.students.length}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {c.subjects.slice(0, 2).map((sub, i) => (
                          <span key={i} style={{ fontSize: '11px', color: 'var(--blue)', background: 'var(--blue-light)', padding: '2px 6px', borderRadius: '4px' }}>
                            {sub}
                          </span>
                        ))}
                        {c.subjects.length > 2 && (
                          <span style={{ fontSize: '11px', color: 'var(--text-meta)', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                            +{c.subjects.length - 2}
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
                ))}
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

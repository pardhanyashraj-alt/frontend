"use client";

import { useState } from "react";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";

interface UploadedChapter {
  id: number; book: string; board: string; class: string; subject: string;
  chapter: string; chapterNo: number; uploadDate: string; status: "Processed" | "Processing" | "Failed";
  summary?: string; qaCount?: number; quizCount?: number;
}

const initialUploads: UploadedChapter[] = [
  { id: 1, book: "NCERT Mathematics", board: "CBSE", class: "Class 10", subject: "Mathematics", chapter: "Introduction to Trigonometry", chapterNo: 8, uploadDate: "Mar 19, 2026", status: "Processed", summary: "Trigonometry deals with the relationship between angles and sides of a triangle. This chapter introduces trigonometric ratios — sine, cosine, and tangent — for acute angles of a right-angled triangle. Students learn to calculate these ratios and apply them in real-world problems including height and distance calculations.", qaCount: 15, quizCount: 10 },
  { id: 2, book: "NCERT Science", board: "CBSE", class: "Class 9", subject: "Science", chapter: "The Fundamental Unit of Life", chapterNo: 5, uploadDate: "Mar 17, 2026", status: "Processed", summary: "The cell is the basic structural and functional unit of all living organisms. This chapter covers cell theory, prokaryotic vs eukaryotic cells, plant vs animal cells, and the functions of key organelles like nucleus, mitochondria, endoplasmic reticulum, and Golgi apparatus.", qaCount: 18, quizCount: 12 },
  { id: 3, book: "NCERT English (First Flight)", board: "CBSE", class: "Class 10", subject: "English", chapter: "Nelson Mandela: Long Walk to Freedom", chapterNo: 2, uploadDate: "Mar 16, 2026", status: "Processing" },
  { id: 4, book: "NCERT History", board: "CBSE", class: "Class 9", subject: "History", chapter: "The French Revolution", chapterNo: 1, uploadDate: "Mar 14, 2026", status: "Processed", summary: "The French Revolution of 1789 marked the end of monarchy in France and introduced democratic ideals. Key events include the storming of the Bastille, the Declaration of Rights, the Reign of Terror, and Napoleon's rise.", qaCount: 20, quizCount: 15 },
  { id: 5, book: "NCERT Physics", board: "CBSE", class: "Class 11", subject: "Physics", chapter: "Laws of Motion", chapterNo: 5, uploadDate: "Mar 12, 2026", status: "Processed", summary: "Newton's laws of motion form the foundation of classical mechanics. This chapter covers inertia, force, momentum, impulse, and the concepts of friction. Applications include problem-solving with FBDs and connected-body systems.", qaCount: 22, quizCount: 14 },
  { id: 6, book: "NCERT Chemistry", board: "CBSE", class: "Class 10", subject: "Chemistry", chapter: "Chemical Reactions and Equations", chapterNo: 1, uploadDate: "Mar 10, 2026", status: "Failed" },
];

const boards = ["All", "CBSE", "ICSE", "State Board"];
const classes = ["All", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const subjects = ["All", "Mathematics", "Science", "English", "History", "Physics", "Chemistry"];

export default function ContentPage() {
  const [uploads, setUploads] = useState<UploadedChapter[]>(initialUploads);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreview, setShowPreview] = useState<UploadedChapter | null>(null);
  const [previewTab, setPreviewTab] = useState<"summary" | "qa" | "quiz">("summary");
  const [boardFilter, setBoardFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState({ board: "CBSE", class: "Class 10", subject: "Mathematics", chapter: "", chapterNo: "" });

  const filtered = uploads.filter(u => {
    return (boardFilter === "All" || u.board === boardFilter) &&
           (classFilter === "All" || u.class === classFilter) &&
           (subjectFilter === "All" || u.subject === subjectFilter);
  });

  const handleUpload = () => {
    setIsProcessing(true);
    const newUpload: UploadedChapter = {
      id: Date.now(), book: `NCERT ${form.subject}`, board: form.board, class: form.class,
      subject: form.subject, chapter: form.chapter, chapterNo: parseInt(form.chapterNo) || 1,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Processing",
    };

    setTimeout(() => {
      setIsProcessing(false);
      setUploads(prev => [{
        ...newUpload,
        status: "Processed",
        summary: `AI-generated summary for "${form.chapter}" covering key concepts, definitions, and important formulae. This content is now available to all teachers using the EduFlow platform globally.`,
        qaCount: Math.floor(Math.random() * 10) + 12,
        quizCount: Math.floor(Math.random() * 8) + 8,
      }, ...prev]);
      setShowUploadModal(false);
      setForm({ board: "CBSE", class: "Class 10", subject: "Mathematics", chapter: "", chapterNo: "" });
    }, 3000);
  };

  const statusColor = (s: string) => s === "Processed" ? "var(--green-dark)" : s === "Processing" ? "#D97706" : "var(--red)";

  return (
    <>
      <SuperAdminSidebar activePage="content" />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => { if (!isProcessing) { setShowUploadModal(false); } }}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title">{isProcessing ? 'AI Processing...' : 'Upload Chapter PDF'}</div>
              {!isProcessing && (
                <button className="icon-btn" onClick={() => setShowUploadModal(false)}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
              )}
            </div>
            <div className="modal-body">
              {isProcessing ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  {/* AI Processing Animation */}
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%', border: '4px solid #E5E7EB', borderTopColor: '#1E40AF', animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>AI Model Processing</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
                    Generating summary, Q&A, and quiz questions from the uploaded PDF...<br />
                    This usually takes 15-30 seconds.
                  </div>
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {["📄 Extracting text from PDF...", "🧠 Generating chapter summary...", "❓ Creating Q&A pairs...", "📝 Building quiz questions..."].map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1E40AF', animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Board</label>
                      <select className="form-input" value={form.board} onChange={e => setForm({...form, board: e.target.value})}>
                        <option>CBSE</option><option>ICSE</option><option>State Board</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Class</label>
                      <select className="form-input" value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
                        {classes.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                        {subjects.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginTop: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Chapter Name *</label>
                      <input className="form-input" placeholder="e.g. Introduction to Trigonometry" value={form.chapter} onChange={e => setForm({...form, chapter: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Chapter No.</label>
                      <input className="form-input" type="number" placeholder="e.g. 8" value={form.chapterNo} onChange={e => setForm({...form, chapterNo: e.target.value})} />
                    </div>
                  </div>
                  {/* PDF Upload Area */}
                  <div style={{ marginTop: '20px', padding: '32px', border: '2px dashed #D1D5DB', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1E40AF" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>Upload Chapter PDF</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Drag & drop or click to browse · PDF only · Max 25MB</div>
                    <div style={{ marginTop: '12px', background: '#DBEAFE', color: '#1E40AF', padding: '6px 16px', borderRadius: '8px', display: 'inline-block', fontSize: '12px', fontWeight: 600 }}>sample_chapter.pdf selected ✓</div>
                  </div>
                </>
              )}
            </div>
            {!isProcessing && (
              <div className="modal-footer">
                <button className="btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button className="btn-primary" style={{ background: '#1E40AF' }} onClick={handleUpload} disabled={!form.chapter}>🚀 Process with AI</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="card-title">Ch {showPreview.chapterNo}: {showPreview.chapter}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-meta)', marginTop: '2px' }}>{showPreview.book} · {showPreview.class} · {showPreview.board}</div>
              </div>
              <button className="icon-btn" onClick={() => setShowPreview(null)}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div style={{ padding: '0 24px', display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)' }}>
              {(["summary", "qa", "quiz"] as const).map(t => (
                <button key={t} onClick={() => setPreviewTab(t)} style={{
                  padding: '12px 16px', border: 'none', background: 'none', fontSize: '13px', fontWeight: 600,
                  color: previewTab === t ? '#1E40AF' : 'var(--text-meta)', cursor: 'pointer',
                  borderBottom: `2px solid ${previewTab === t ? '#1E40AF' : 'transparent'}`, transition: 'all 0.2s',
                }}>{t === 'summary' ? '📄 Summary' : t === 'qa' ? `❓ Q&A (${showPreview.qaCount || 0})` : `📝 Quiz (${showPreview.quizCount || 0})`}</button>
              ))}
            </div>
            <div className="modal-body" style={{ minHeight: '200px' }}>
              {previewTab === "summary" && (
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                  {showPreview.summary || "Summary is being generated..."}
                </div>
              )}
              {previewTab === "qa" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { q: "What is the basic principle discussed in this chapter?", a: "The chapter discusses the fundamental concepts and their real-world applications, building upon knowledge from previous chapters." },
                    { q: "List the key formulas introduced.", a: "The chapter introduces several formulas that are essential for solving numerical problems. Each formula is derived step-by-step." },
                    { q: "How does this topic connect to other subjects?", a: "This topic has cross-disciplinary applications in physics, computer science, and everyday problem solving." },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E40AF', marginBottom: '6px' }}>Q{i + 1}: {item.q}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.a}</div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-meta)', padding: '8px' }}>...and {(showPreview.qaCount || 3) - 3} more Q&A pairs</div>
                </div>
              )}
              {previewTab === "quiz" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { q: "Which of the following best describes the main concept?", options: ["Option A — First choice", "Option B — Second choice", "Option C — Correct answer", "Option D — Fourth choice"], correct: 2 },
                    { q: "What is the correct application of the formula?", options: ["Apply directly", "Substitute values first", "Rearrange and solve", "None of the above"], correct: 1 },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>Q{i + 1}: {item.q}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {item.options.map((opt, j) => (
                          <div key={j} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid', borderColor: j === item.correct ? 'var(--green-dark)' : 'var(--border)', background: j === item.correct ? 'var(--green-light)' : 'white', fontWeight: j === item.correct ? 600 : 400, color: j === item.correct ? 'var(--green-dark)' : 'var(--text-secondary)' }}>
                            {String.fromCharCode(65 + j)}. {opt} {j === item.correct && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-meta)', padding: '8px' }}>...and {(showPreview.quizCount || 2) - 2} more questions</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Upload PDFs → AI generates summary, Q&A & quiz</div>
            <h1>AI Content Engine</h1>
          </div>
          <div className="topbar-right">
            <button className="btn-primary" style={{ background: '#1E40AF', boxShadow: '0 4px 12px rgba(30,64,175,0.2)' }} onClick={() => setShowUploadModal(true)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Upload Chapter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card blue"><div className="stat-value">{uploads.length}</div><div className="stat-label">Total Chapters</div></div>
          <div className="stat-card green"><div className="stat-value">{uploads.filter(u => u.status === 'Processed').length}</div><div className="stat-label">Processed</div></div>
          <div className="stat-card orange"><div className="stat-value">{uploads.filter(u => u.status === 'Processing').length}</div><div className="stat-label">In Queue</div></div>
          <div className="stat-card purple"><div className="stat-value">{uploads.reduce((a, b) => a + (b.qaCount || 0) + (b.quizCount || 0), 0)}</div><div className="stat-label">Questions Generated</div></div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <select className="filter-select" value={boardFilter} onChange={e => setBoardFilter(e.target.value)}>
            {boards.map(b => <option key={b}>{b}</option>)}
          </select>
          <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.map(u => (
            <div key={u.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${statusColor(u.status)}15`, color: statusColor(u.status), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Ch {u.chapterNo}: {u.chapter}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-meta)', marginTop: '2px' }}>{u.book} · {u.class} · {u.board} · {u.uploadDate}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {u.status === "Processed" && (
                    <div style={{ display: 'flex', gap: '12px', marginRight: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>❓ {u.qaCount} Q&A</span>
                      <span style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600 }}>📝 {u.quizCount} Quiz</span>
                    </div>
                  )}
                  <span style={{ fontSize: '11px', fontWeight: 700, color: statusColor(u.status), background: `${statusColor(u.status)}15`, padding: '5px 12px', borderRadius: '20px' }}>{u.status}</span>
                  {u.status === "Processed" && (
                    <button className="btn-outline" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => { setShowPreview(u); setPreviewTab("summary"); }}>Preview</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spinner keyframes */}
        <style jsx global>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        `}</style>
      </main>
    </>
  );
}

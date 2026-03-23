"use client";

import { useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import { mockAssignments } from "../../data/mockData";

// ─── QUIZ DATA ─────────────────────────────────────────────────────────────
const mockQuizQuestions = [
  {
    id: 1,
    question: "What is the result of 2x + 5 = 15?",
    options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
    correct: 0,
  },
  {
    id: 2,
    question: "If a = 5 and b = 3, what is (a + b)²?",
    options: ["16", "64", "25", "34"],
    correct: 1,
  },
  {
    id: 3,
    question: "Simplify: 3(x - 2) + 4x",
    options: ["7x - 2", "7x - 6", "x - 6", "12x - 6"],
    correct: 1,
  },
];

// ─── PUBLISHED CONTENT ─────────────────────────────────────────────────────
const mockPublished = [
  { id: 'p1', title: 'Calculus Basics', chapter: 'Chapter 1', book: 'Mathematics Part 1', type: 'Summary', date: '2024-03-15' },
  { id: 'p2', title: 'Algebra Review', chapter: 'Chapter 2', book: 'Mathematics Part 1', type: 'Quiz', date: '2024-03-18' },
  { id: 'p3', title: 'Geometry Proofs', chapter: 'Chapter 3', book: 'Mathematics Part 2', type: 'Notes', date: '2024-03-20' },
];

// ─── STUDENT SUBJECTS ──────────────────────────────────────────────────────
const mockStudentSubjects = [
  { id: "sub-1", name: "Mathematics", class: "Grade 10-A", teacher: "Mr. David Wilson", color: "bg-indigo-600", icon: "📐" },
  { id: "sub-2", name: "Science", class: "Grade 10-A", teacher: "Mrs. Sunita Gupta", color: "bg-emerald-600", icon: "🧬" },
  { id: "sub-3", name: "English", class: "Grade 10-A", teacher: "Ms. Rita Sharma", color: "bg-blue-600", icon: "📚" },
  { id: "sub-4", name: "Social Studies", class: "Grade 10-A", teacher: "Ms. Priya Mehta", color: "bg-orange-600", icon: "🌍" },
];

export default function StudentClassesPage() {
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"content" | "assignments" | "quiz">("content");
  const [viewingContent, setViewingContent] = useState<any>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [quizStatus, setQuizStatus] = useState({
    submitted: false,
    answers: [] as number[],
    score: null as number | null,
  });
  const [viewingQuizResult, setViewingQuizResult] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleQuizAnswer = (optionIdx: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = optionIdx;
    setQuizAnswers(newAnswers);
  };

  const handleQuizNext = () => {
    if (quizStep < mockQuizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      const finalScore = calculateScore();
      setQuizStatus({
        submitted: true,
        answers: [...quizAnswers],
        score: finalScore
      });
      setActiveTab("content");
      showToast("Quiz submitted! Your results are now available. 🎯");
    }
  };

  const calculateScore = () => {
    let score = 0;
    mockQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <>
      <StudentSidebar activePage="classes" />

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#059669", color: "white", padding: "14px 22px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(5,150,105,0.35)", display: "flex", alignItems: "center", gap: 10 }} className="animate-in slide-in-from-bottom-5">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          {toast}
        </div>
      )}

      {/* View Content Modal */}
      {viewingContent && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingContent(null)} />
          <div className="relative w-full max-w-[640px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingContent.title}</h3>
                <p className="text-[13px] text-slate-400 font-medium">{viewingContent.book} · {viewingContent.chapter}</p>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" onClick={() => setViewingContent(null)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="font-bold text-slate-700 mb-2">Detailed {viewingContent.type}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    This is a simulated view of generated AI content. In the full version, this would be populated with 
                    Markdown formatted notes, key takeaways, and relevant diagrams for {viewingContent.chapter} from {viewingContent.book}.
                  </p>
                </div>
                <div className="p-5 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl">
                  <h4 className="font-black text-indigo-700 text-xs uppercase tracking-widest mb-2">Key Takeaways</h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                    <li>Fundamental concepts of {viewingContent.title}</li>
                    <li>Core formulas and derivations</li>
                    <li>Practical applications and examples</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100" onClick={() => setViewingContent(null)}>Close Viewer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Quiz Result Modal */}
      {viewingQuizResult && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingQuizResult(false)} />
          <div className="relative w-full max-w-[720px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Quiz Results</h3>
                <p className="text-[14px] text-slate-500 font-bold uppercase tracking-widest mt-1">Algebra Review · Chapter 2</p>
              </div>
              <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm border border-slate-100 transition-all" onClick={() => setViewingQuizResult(false)}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-10">
              <div className="flex flex-col md:flex-row gap-10 items-center justify-between mb-12">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={440} 
                      strokeDashoffset={440 - (440 * (quizStatus.score || 0)) / mockQuizQuestions.length} 
                      className="text-indigo-600 transition-all duration-1000 stroke-round" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-800">{quizStatus.score}/{mockQuizQuestions.length}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Score</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[28px]">
                    <h4 className="font-black text-emerald-700 text-xs uppercase tracking-widest mb-2">Teacher Feedback</h4>
                    <p className="text-slate-600 text-[15px] font-medium leading-relaxed italic">
                      "Excellent understanding of linear equations! Your step-by-step logic is becoming much clearer. Focus a bit more on quadratic expansions in the next chapter."
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-widest mb-4">Question Breakdown</h4>
                {mockQuizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                        quizStatus.answers[idx] === q.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-700 text-[15px] mb-3">{q.question}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[11px] font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-lg">You: {q.options[quizStatus.answers[idx]] || "No Answer"}</span>
                          <span className="text-[11px] font-bold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg">Correct: {q.options[q.correct]}</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium italic">
                          Explanation: The value of x is found by subtracting 5 and then dividing by 2.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 flex justify-end">
              <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200" onClick={() => setViewingQuizResult(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto">
          {!selectedSubject ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My <span className="text-indigo-600">Classes</span></h1>
                <p className="text-slate-500 font-medium">Select a subject to view learning materials, assignments, and quizzes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                {mockStudentSubjects.map((sub) => (
                  <div key={sub.id} className="group relative bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden"
                    onClick={() => setSelectedSubject(sub)}>
                    <div className={`absolute top-0 left-0 w-2 h-full ${sub.color}`} />
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${sub.color.replace('bg-', 'bg-')}/10 text-2xl flex items-center justify-center shadow-inner`}>
                          {sub.icon}
                        </div>
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-widest">{sub.class}</span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                      <p className="text-sm text-slate-400 font-bold mb-8 flex items-center gap-1.5">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        {sub.teacher}
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Enter Class</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
              {/* Header with Back Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => setSelectedSubject(null)}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm group"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-lg uppercase tracking-wider">{selectedSubject.class}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-bold text-slate-400">Academic Year 2024-25</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{selectedSubject.name}</h1>
                  </div>
                </div>
                
                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                  {(["content", "assignments", "quiz"] as const).map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => {
                        setActiveTab(tab);
                        if (tab === 'quiz') { 
                          setQuizStep(0); 
                          // If not submitted, reset answers. If submitted, we just block them from re-taking in this flow
                        }
                      }}
                      className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all uppercase tracking-wide ${
                        activeTab === tab 
                          ? "bg-white text-indigo-700 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB CONTENT */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-800">Learning Materials</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockPublished.map(item => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-4 opacity-10 peer-hover:opacity-100 transition-opacity">
                            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          </div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              item.type === 'Summary' ? 'bg-blue-50 text-blue-600' : 
                              item.type === 'Quiz' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">{item.date}</span>
                          </div>
                          <h3 className="text-[17px] font-black text-slate-800 mb-1 leading-tight">{item.title}</h3>
                          <p className="text-[13px] text-slate-500 font-medium mb-6">{item.chapter}</p>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setViewingContent(item)}
                              className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-[12px] font-bold rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300"
                            >
                              View
                            </button>
                            {item.type === 'Quiz' && (
                              <button 
                                onClick={() => {
                                  if (quizStatus.submitted) {
                                    setViewingQuizResult(true);
                                  } else {
                                    setActiveTab('quiz');
                                    setQuizAnswers([]);
                                  }
                                }}
                                className={`flex-1 py-1.5 ${quizStatus.submitted ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-indigo-600 text-white'} text-[12px] font-bold rounded-xl hover:opacity-90 transition-all shadow-md shadow-indigo-100`}
                              >
                                {quizStatus.submitted ? 'View Result' : 'Attempt'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "assignments" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-800">Pending Assignments</h2>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                      <div className="divide-y divide-slate-100">
                        {mockAssignments.filter(a => a.subject === selectedSubject.name || a.subject === "Mathematics").map(a => (
                          <div key={a.id} className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-[16px] font-black text-slate-800">{a.title}</h3>
                                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-md uppercase tracking-tighter">Due soon</span>
                              </div>
                              <p className="text-[13px] text-slate-500 font-medium">{a.subject} · Deadline: {a.dueDate}</p>
                              {a.description && <p className="text-[12px] text-slate-400 italic max-w-xl">&quot;{a.description}&quot;</p>}
                            </div>
                            <button 
                              className="px-6 py-2.5 bg-indigo-600 text-white text-[13px] font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                              onClick={() => showToast(`Assignment "${a.title}" submitted successfully!`)}
                            >
                              Submit Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm min-h-[500px] flex flex-col items-center justify-center max-w-[800px] mx-auto">
                    <div className="w-full space-y-8 animate-in fade-in zoom-in duration-500">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest mb-2 inline-block">Chapter 2 Quiz</span>
                          <h2 className="text-2xl font-black text-slate-800">Question {quizStep + 1} of {mockQuizQuestions.length}</h2>
                        </div>
                        <div className="text-sm font-bold text-slate-400">Total Score Potential: {mockQuizQuestions.length}</div>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-10">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${((quizStep + 1) / mockQuizQuestions.length) * 100}%` }} />
                      </div>

                      <p className="text-xl font-extrabold text-slate-700 leading-relaxed mb-8">{mockQuizQuestions[quizStep].question}</p>

                      <div className="grid grid-cols-1 gap-4">
                        {mockQuizQuestions[quizStep].options.map((option, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleQuizAnswer(idx)}
                            className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold ${
                              quizAnswers[quizStep] === idx 
                                ? "bg-indigo-50 border-indigo-600 text-indigo-700 ring-4 ring-indigo-500/10" 
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                                quizAnswers[quizStep] === idx ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                              }`}>{String.fromCharCode(65 + idx)}</span>
                              {option}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between pt-8 border-t border-slate-50">
                        <button 
                          disabled={quizStep === 0}
                          onClick={() => setQuizStep(prev => prev - 1)}
                          className="px-6 py-3 font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all uppercase tracking-widest text-[12px]"
                        >
                          Previous
                        </button>
                        <button 
                          disabled={quizAnswers[quizStep] === undefined}
                          onClick={handleQuizNext}
                          className="px-10 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-[0.98]"
                        >
                          {quizStep === mockQuizQuestions.length - 1 ? "Submit Quiz" : "Next Question"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

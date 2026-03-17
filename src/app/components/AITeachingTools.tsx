"use client";

import { useState, useEffect } from "react";

type ToolType = "summary" | "quiz" | "test" | null;

export default function AITeachingTools() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  // Form states for modals
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [summaryLength, setSummaryLength] = useState("Medium");
  
  const [quizCount, setQuizCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionType, setQuestionType] = useState("MCQ");

  const [testName, setTestName] = useState("");
  const [timeLimit, setTimeLimit] = useState("60");
  const [totalMarks, setTotalMarks] = useState("100");
  const [allowMultiple, setAllowMultiple] = useState(false);

  const handleGenerate = (type: ToolType) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    
    // Mocking AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      if (type === "summary") {
        setGeneratedContent(`Summary of "${chapterTitle}":\n\nThis chapter covers the fundamental laws of motion as formulated by Isaac Newton. It explores the concepts of inertia, acceleration, and action-reaction pairs with real-world examples...`);
      } else if (type === "quiz") {
        setGeneratedContent(`Quiz for "${chapterTitle}" (${quizCount} questions, ${difficulty}):\n\n1. What is Newton's First Law?\n2. Define acceleration...\n3. Calculate the force if mass is 10kg and acceleration is 5m/s²...`);
      } else if (type === "test") {
        setGeneratedContent(`Online Test: ${testName}\nTime: ${timeLimit} mins | Total Marks: ${totalMarks}\n\nTest published successfully! Link: eduflow.portal/test/xyz123`);
      }
    }, 2500);
  };

  const closeModal = () => {
    setActiveTool(null);
    setGeneratedContent(null);
    setIsGenerating(false);
    // Reset basic fields
    setChapterTitle("");
    setChapterContent("");
  };

  return (
    <div className="ai-tools-section" style={{ marginBottom: '32px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', 
          padding: '8px', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
        }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            <path d="M12 8l-4 2 4 2 4-2-4-2z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>AI Teaching Tools</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-meta)', margin: 0 }}>Automate your content creation with intelligent tools</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Tool Card 1 */}
        <div className="card ai-tool-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTool("summary")}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--blue-light)', color: 'var(--blue)', padding: '12px', borderRadius: '12px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Generate Summary</div>
              <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>Condense chapters into key points</div>
            </div>
          </div>
        </div>

        {/* Tool Card 2 */}
        <div className="card ai-tool-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTool("quiz")}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: '12px', borderRadius: '12px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Generate Quiz</div>
              <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>Create assessment questions instantly</div>
            </div>
          </div>
        </div>

        {/* Tool Card 3 */}
        <div className="card ai-tool-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTool("test")}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--orange-light)', color: 'var(--orange)', padding: '12px', borderRadius: '12px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Create Online Test</div>
              <div style={{ fontSize: '12px', color: 'var(--text-meta)' }}>Set up a digital test for students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Logic */}
      {activeTool && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', 
                  padding: '6px', 
                  borderRadius: '8px'
                }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="card-title">
                  {activeTool === "summary" && "AI Summary Generator"}
                  {activeTool === "quiz" && "AI Quiz Generator"}
                  {activeTool === "test" && "Create Online Test"}
                </div>
              </div>
              <button className="icon-btn" onClick={closeModal}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {generatedContent ? (
                <div className="generated-result">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Preview & Edit Content
                    <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>READY TO SAVE</span>
                  </label>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: '300px', fontSize: '14px', lineHeight: '1.6', background: 'var(--input-bg)' }}
                    defaultValue={generatedContent}
                  ></textarea>
                </div>
              ) : isGenerating ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AI is hard at work...</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-meta)', marginTop: '8px' }}>
                    Reading content and crafting the perfect {activeTool}
                  </div>
                </div>
              ) : (
                <>
                  {activeTool === "summary" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Chapter Title</label>
                        <input className="form-input" placeholder="e.g. Newton's Laws of Motion" value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Chapter Content / Paste Text</label>
                        <textarea className="form-input" style={{ minHeight: '150px' }} placeholder="Paste the text you want to summarize..." value={chapterContent} onChange={e => setChapterContent(e.target.value)}></textarea>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Summary Length</label>
                        <select className="form-input" value={summaryLength} onChange={e => setSummaryLength(e.target.value)}>
                          <option>Short</option>
                          <option>Medium</option>
                          <option>Detailed</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeTool === "quiz" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Chapter Title</label>
                        <input className="form-input" placeholder="e.g. Physics Chapter 3" value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Content to Generate From</label>
                        <textarea className="form-input" style={{ minHeight: '120px' }} placeholder="Enter background information..." value={chapterContent} onChange={e => setChapterContent(e.target.value)}></textarea>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">No. of Questions</label>
                          <input type="number" className="form-input" value={quizCount} onChange={e => setQuizCount(parseInt(e.target.value))} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Difficulty</label>
                          <select className="form-input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Question Type</label>
                        <select className="form-input" value={questionType} onChange={e => setQuestionType(e.target.value)}>
                          <option>MCQ</option>
                          <option>Short Answer</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeTool === "test" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Test Name</label>
                        <input className="form-input" placeholder="e.g. Mid-Term Examination" value={testName} onChange={e => setTestName(e.target.value)} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Time Limit (mins)</label>
                          <input className="form-input" type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Total Marks</label>
                          <input className="form-input" type="number" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>Allow Multiple Attempts</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-meta)' }}>Students can retake the test</div>
                        </div>
                        <div 
                          onClick={() => setAllowMultiple(!allowMultiple)}
                          style={{ 
                            width: '44px', 
                            height: '24px', 
                            background: allowMultiple ? 'var(--blue)' : '#CBD5E1', 
                            borderRadius: '20px', 
                            position: 'relative', 
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}>
                          <div style={{ 
                            position: 'absolute', 
                            top: '3px', 
                            left: allowMultiple ? '23px' : '3px', 
                            width: '18px', 
                            height: '18px', 
                            background: 'white', 
                            borderRadius: '50%',
                            transition: 'all 0.3s'
                          }} />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={closeModal}>Cancel</button>
              {generatedContent ? (
                <button className="btn-primary" style={{ background: 'var(--green)' }} onClick={closeModal}>
                  {activeTool === "test" ? "Confirm & Publish" : "Save Content"}
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', border: 'none' }}
                  onClick={() => handleGenerate(activeTool)}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : activeTool === "test" ? "Create Test" : "Generate Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          border-color: #8B5CF6;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(139, 92, 246, 0.1);
          border-top: 4px solid #8B5CF6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .day-chip.active {
          background: #8B5CF6 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}

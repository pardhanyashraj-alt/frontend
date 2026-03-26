"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StudentSidebar from "../../../components/StudentSidebar";
import { apiFetch } from "../../../lib/api";

interface PublishedChapter {
  class_chapter_id: string;
  chapter_number: number;
  published_date: string;
}

interface PublishedContent {
  class_id: string;
  subject: string;
  content_type: string;
  total_published: number;
  chapters: PublishedChapter[];
}

interface ChapterContent {
  class_chapter_id: string;
  book_name: string;
  chapter_number: number;
  subject: string;
  content_type: string;
  is_customized: boolean;
  published_date: string;
  summary?: any;
  quiz?: any;
  qa_bank?: any;
  ppt_structure?: any;
}

interface StudentClass {
  class_id: string;
  section: string;
  grade_level: number;
  school_name: string;
  enrolled_on: string;
}

export default function ClassDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');

  const [studentClass, setStudentClass] = useState<StudentClass | null>(null);
  const [publishedContent, setPublishedContent] = useState<PublishedContent | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string>('summary');
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentTypeLoading, setContentTypeLoading] = useState(false);
  const [isAttemptingQuiz, setIsAttemptingQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  useEffect(() => {
    const loadClassData = async () => {
      try {
        // Get class info from dashboard
        const dashboardRes = await apiFetch('/student/dashboard');
        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          setStudentClass(dashboardData.class);
        }
      } catch (err) {
        console.error('Error loading class data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, [id]);

  // Separate effect to load published content when subject or content type changes
  useEffect(() => {
    const loadPublishedContent = async () => {
      if (!subject) {
        setPublishedContent(null);
        setChapterContent(null);
        return;
      }

      setContentTypeLoading(true);
      setChapterContent(null); // Clear previous chapter content when type changes
      
      try {
        const contentRes = await apiFetch(`/student/classes/${id}/published-content?subject=${encodeURIComponent(subject)}&content_type=${selectedContentType}`);
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setPublishedContent(contentData);
          console.log("Published Content:", contentData);
        } else {
          console.error('Failed to fetch published content');
          setPublishedContent(null);
        }
      } catch (err) {
        console.error('Error loading published content:', err);
        setPublishedContent(null);
      } finally {
        setContentTypeLoading(false);
      }
    };

    loadPublishedContent();
  }, [id, subject, selectedContentType]);

  const checkQuizAlreadySubmitted = async (classChapterId: string, subject: string) => {
    try {
      const historyRes = await apiFetch('/student/quiz-history');
      if (!historyRes.ok) {
        return;
      }

      const historyData = await historyRes.json();
      const attempt = (historyData || []).find((item: any) => {
        if (!item) return false;
        if (item.class_chapter_id && item.class_chapter_id === classChapterId) {
          return true;
        }
        // Best effort fallback: match subject if chapter id not available
        if (item.subject && item.subject.toLowerCase() === subject?.toLowerCase()) {
          return true;
        }
        return false;
      });

      if (!attempt || !attempt.quiz_attempt_id) {
        return;
      }

      const resultsRes = await apiFetch(`/student/quiz-attempts/${attempt.quiz_attempt_id}`);
      if (!resultsRes.ok) {
        return;
      }

      const resultsData = await resultsRes.json();
      setQuizAttemptId(attempt.quiz_attempt_id);
      setQuizResults(resultsData);
      setQuizSubmitted(true);
      setIsAttemptingQuiz(true);
      console.log('Quiz already submitted; loaded results from history:', resultsData);
    } catch (err) {
      console.error('Error checking quiz history:', err);
    }
  };

  const loadChapterContent = async (classChapterId: string) => {
    setContentLoading(true);
    try {
      const contentRes = await apiFetch(`/student/class-chapters/${classChapterId}/content?content_type=${selectedContentType}`);
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setChapterContent(contentData);
        console.log("Chapter Data 2:",contentData);

        if (selectedContentType === 'quiz' && contentData) {
          await checkQuizAlreadySubmitted(contentData.class_chapter_id, contentData.subject);
        }
      }
    } catch (err) {
      console.error('Error loading chapter content:', err);
    } finally {
      setContentLoading(false);
    }
  };

  const contentTypes = [
    { key: 'summary', label: 'Summaries', color: 'var(--blue)' },
    { key: 'quiz', label: 'Quizzes', color: 'var(--green)' },
    { key: 'qa_bank', label: 'Q&A Banks', color: 'var(--orange)' },
    { key: 'ppt_structure', label: 'PPT Structures', color: 'var(--purple)' }
  ];

  const handleSubmitQuiz = async () => {
    if (!chapterContent?.class_chapter_id) return;

    setQuizSubmitting(true);
    setQuizError(null);

    try {
      // Transform answers: create an object where key is question number as string
      const questions = chapterContent.quiz.quiz?.questions || [];
      const studentAnswers: { [key: string]: string | null } = {};
      
      questions.forEach((q: any, idx: number) => {
        studentAnswers[(idx + 1).toString()] = userAnswers[idx] || null;
      });

      console.log('Submitting quiz with answers:', studentAnswers);
      console.log('Quiz attempt for chapter:', chapterContent.class_chapter_id);

      const response = await apiFetch(`/student/quiz/${chapterContent.class_chapter_id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ student_answers: studentAnswers })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Quiz submitted successfully:', data);
        
        // Now fetch the full results
        const resultsResponse = await apiFetch(`/student/quiz-attempts/${data.quiz_attempt_id}`);
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          console.log('Quiz results fetched:', resultsData);
          setQuizAttemptId(data.quiz_attempt_id);
          setQuizResults(resultsData);
          setQuizSubmitted(true);
          setIsAttemptingQuiz(true);
        } else {
          const errorData = await resultsResponse.json().catch(() => ({}));
          console.error('Failed to fetch results:', errorData);
          setQuizError('Failed to fetch quiz results');
        }
      } else {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // If JSON parsing fails, try to get text
          const text = await response.text().catch(() => '');
          console.error('Failed to parse error response:', text);
          errorData = { detail: text || 'Unknown error' };
        }
        console.error('Quiz submission failed:', response.status, errorData);
        setQuizError(errorData.detail || errorData.message || errorData.error || `Failed to submit quiz (HTTP ${response.status})`);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setQuizError(`Network error: ${errorMessage}`);
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <StudentSidebar activePage="classes" />
        <main className="main" style={{ padding: 24 }}>
          <p>Loading class content...</p>
        </main>
      </>
    );
  }

  if (!studentClass) {
    return (
      <>
        <StudentSidebar activePage="classes" />
        <main className="main" style={{ padding: 24 }}>
          <p>Class not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <StudentSidebar activePage="classes" />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <Link href="/student/classes" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-meta)', textDecoration: 'none', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Classes
            </Link>
            <h1>Grade {studentClass.grade_level} - Section {studentClass.section}</h1>
            {subject && <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '4px' }}>{subject}</div>}
          </div>
        </div>

        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>

          <div className="left-col">
            {/* Content Type Selector */}
            {subject && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Content Type</div>
                </div>
                <div style={{ padding: '0 24px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {contentTypes.map((type) => (
                    <button
                      key={type.key}
                      onClick={() => setSelectedContentType(type.key)}
                      className={`btn-outline ${selectedContentType === type.key ? 'active' : ''}`}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        background: selectedContentType === type.key ? type.color : 'transparent',
                        color: selectedContentType === type.key ? 'white' : 'var(--text-primary)',
                        border: `1px solid ${type.color}`
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Published Chapters */}
            {subject && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Published {contentTypes.find(t => t.key === selectedContentType)?.label}</div>
                    <div className="card-subtitle">
                      {contentTypeLoading 
                        ? 'Loading chapters...' 
                        : publishedContent?.total_published 
                          ? `${publishedContent.total_published} chapters available` 
                          : 'No chapters available'
                      }
                    </div>
                  </div>
                </div>

                {contentTypeLoading ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-meta)' }}>
                    Loading chapters...
                  </div>
                ) : publishedContent && publishedContent.chapters.length > 0 ? (
                  <>
                    {publishedContent.chapters.map((chapter) => (
                      <div key={chapter.class_chapter_id} className="class-row">
                        <div className="class-info">
                          <div className="class-name">Chapter {chapter.chapter_number}</div>
                          <div className="class-meta">Published {new Date(chapter.published_date).toLocaleDateString()}</div>
                        </div>
                        <button
                          onClick={() => loadChapterContent(chapter.class_chapter_id)}
                          className="btn-primary"
                          style={{ padding: '8px 16px' }}
                          disabled={contentLoading}
                        >
                          {contentLoading ? 'Loading...' : 'View Content'}
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-meta)' }}>
                    No {contentTypes.find(t => t.key === selectedContentType)?.label.toLowerCase()} available for this subject
                  </div>
                )}
              </div>
            )}

            {/* Chapter Content Display */}
            {chapterContent && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Chapter {chapterContent.chapter_number} - {chapterContent.book_name}</div>
                    <div className="card-subtitle">{chapterContent.subject} · {chapterContent.is_customized ? 'Customized' : 'Standard'} Content</div>
                  </div>
                  {selectedContentType === 'quiz' && (
                    <button 
                      className="btn-primary" 
                      style={{ background: quizSubmitted ? 'var(--gray)' : (isAttemptingQuiz ? 'var(--red)' : 'var(--green)'), padding: '8px 16px' }}
                      onClick={() => {
                        if (quizSubmitted) {
                          setIsAttemptingQuiz(true);
                          return;
                        }

                        if (isAttemptingQuiz) {
                          setIsAttemptingQuiz(false);
                          setQuizSubmitted(false);
                          setUserAnswers({});
                          setCurrentQuestionIndex(0);
                        } else {
                          setIsAttemptingQuiz(true);
                          setQuizSubmitted(false);
                          setUserAnswers({});
                          setCurrentQuestionIndex(0);
                        }
                      }}
                    >
                      {quizSubmitted ? 'View Result' : (isAttemptingQuiz ? 'Exit Quiz' : 'Attempt Quiz')}
                    </button>
                  )}
                </div>
                <div style={{ padding: '0 24px 24px' }}>
                  {selectedContentType === 'summary' && chapterContent.summary && (
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Key Points</h3>
                      <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                        {chapterContent.summary.key_points?.map((point: string, index: number) => (
                          <li key={index} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedContentType === 'quiz' && chapterContent.quiz && (
                    <div>
                      {!isAttemptingQuiz ? (
                        // Preview mode
                        <>
                          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                {chapterContent.quiz.heading}
                              </h2>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--blue)' }}>
                                {chapterContent.quiz.quiz?.questions?.length || 0} Questions
                              </div>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                              This is a preview. Click "Attempt Quiz" in the header to start answering these questions.
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {chapterContent.quiz.quiz?.questions?.map((question: any, index: number) => (
                              <div key={question.id} style={{ padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-meta)', marginBottom: '4px' }}>Question {index + 1} of {chapterContent.quiz.quiz?.questions?.length}</div>
                                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {question.question_text}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                  {Object.entries(question.options || {}).map(([key, value]: [string, any]) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                      <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        border: '2px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--text-meta)',
                                      }}>
                                        {key}
                                      </div>
                                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{value}</span>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>EXPLANATION</div>
                                  <div style={{ fontSize: '13px', color: '#047857', lineHeight: '1.5' }}>{question.explanation}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        // Attempt mode
                        <>
                          {!quizSubmitted ? (
                            // Quiz in progress
                            <>
                              <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                                      Question {currentQuestionIndex + 1} of {chapterContent.quiz.quiz?.questions?.length}
                                    </h2>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                                      {Object.keys(userAnswers).length} of {chapterContent.quiz.quiz?.questions?.length} answered
                                    </p>
                                  </div>
                                  <div style={{ width: '100px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(Object.keys(userAnswers).length / (chapterContent.quiz.quiz?.questions?.length || 1)) * 100}%`, height: '100%', background: 'var(--green)', transition: 'width 0.3s' }}></div>
                                  </div>
                                </div>
                              </div>

                              {chapterContent.quiz.quiz?.questions && (
                                <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                  <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                      {chapterContent.quiz.quiz.questions[currentQuestionIndex].question_text}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                      {Object.entries(chapterContent.quiz.quiz.questions[currentQuestionIndex].options || {}).map(([key, value]: [string, any]) => (
                                        <button
                                          key={key}
                                          onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: key })}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '16px',
                                            background: userAnswers[currentQuestionIndex] === key ? 'var(--blue)' : 'var(--white)',
                                            border: `2px solid ${userAnswers[currentQuestionIndex] === key ? 'var(--blue)' : 'var(--border)'}`,
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontFamily: 'inherit',
                                            fontSize: '14px'
                                          }}
                                        >
                                          <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '6px',
                                            background: userAnswers[currentQuestionIndex] === key ? 'var(--blue)' : 'var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            color: userAnswers[currentQuestionIndex] === key ? 'white' : 'var(--text-meta)',
                                          }}>
                                            {key}
                                          </div>
                                          <span style={{ color: userAnswers[currentQuestionIndex] === key ? 'white' : 'var(--text-secondary)', fontWeight: 500 }}>
                                            {value}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                                    <button
                                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                      disabled={currentQuestionIndex === 0}
                                      style={{
                                        padding: '10px 20px',
                                        background: currentQuestionIndex === 0 ? 'var(--border)' : 'var(--white)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                        opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                        fontSize: '14px',
                                        fontWeight: 600
                                      }}
                                    >
                                      ← Previous
                                    </button>

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
                                      {chapterContent.quiz.quiz.questions.map((q: any, idx: number) => (
                                        <button
                                          key={idx}
                                          onClick={() => setCurrentQuestionIndex(idx)}
                                          style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border)',
                                            background: currentQuestionIndex === idx ? 'var(--blue)' : (userAnswers[idx] ? '#D1FAE5' : 'var(--white)'),
                                            color: currentQuestionIndex === idx ? 'white' : (userAnswers[idx] ? '#059669' : 'var(--text-secondary)'),
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            fontSize: '12px'
                                          }}
                                        >
                                          {idx + 1}
                                        </button>
                                      ))}
                                    </div>

                                    <button
                                      onClick={() => setCurrentQuestionIndex(Math.min((chapterContent.quiz.quiz?.questions?.length || 1) - 1, currentQuestionIndex + 1))}
                                      disabled={currentQuestionIndex === (chapterContent.quiz.quiz?.questions?.length || 1) - 1}
                                      style={{
                                        padding: '10px 20px',
                                        background: currentQuestionIndex === (chapterContent.quiz.quiz?.questions?.length || 1) - 1 ? 'var(--border)' : 'var(--white)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        cursor: currentQuestionIndex === (chapterContent.quiz.quiz?.questions?.length || 1) - 1 ? 'not-allowed' : 'pointer',
                                        opacity: currentQuestionIndex === (chapterContent.quiz.quiz?.questions?.length || 1) - 1 ? 0.5 : 1,
                                        fontSize: '14px',
                                        fontWeight: 600
                                      }}
                                    >
                                      Next →
                                    </button>
                                  </div>
                                </div>
                              )}

                              {quizError && (
                                <div style={{ marginBottom: '16px', padding: '12px', background: '#FEE2E2', borderRadius: '8px', border: '1px solid #FECACA', color: '#DC2626', fontSize: '14px' }}>
                                  {quizError}
                                </div>
                              )}
                              <button
                                onClick={handleSubmitQuiz}
                                disabled={quizSubmitting}
                                style={{
                                  width: '100%',
                                  padding: '14px',
                                  background: quizSubmitting ? 'var(--border)' : 'var(--green)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '10px',
                                  fontSize: '16px',
                                  fontWeight: 700,
                                  cursor: quizSubmitting ? 'not-allowed' : 'pointer',
                                  opacity: quizSubmitting ? 0.6 : 1
                                }}
                              >
                                {quizSubmitting ? 'Submitting...' : 'Submit Quiz'}
                              </button>
                            </>
                          ) : (
                            // Results view
                            <>
                              {quizResults && (
                                <>
                                  <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)', margin: '0 0 12px 0' }}>Quiz Results</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                      <div style={{ padding: '12px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>SCORE</div>
                                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green)' }}>{quizResults.score}/{quizResults.total_questions}</div>
                                      </div>
                                      <div style={{ padding: '12px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>PERCENTAGE</div>
                                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--blue)' }}>{quizResults.percentage.toFixed(1)}%</div>
                                      </div>
                                      <div style={{ padding: '12px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>STATUS</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: quizResults.pass_fail === 'PASS' ? 'var(--green)' : '#DC2626' }}>
                                          {quizResults.pass_fail}
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                      Submitted: {new Date(quizResults.submitted_date).toLocaleString()}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {quizResults.questions?.map((question: any, index: number) => (
                                      <div key={question.id} style={{ padding: '16px', background: question.is_correct ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: `1px solid ${question.is_correct ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                                        <div style={{ marginBottom: '12px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-meta)' }}>Question {index + 1}</div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, background: question.is_correct ? '#D1FAE5' : '#FEE2E2', color: question.is_correct ? '#059669' : '#DC2626', padding: '4px 8px', borderRadius: '4px' }}>
                                              {question.is_correct ? '✓ Correct' : '✗ Incorrect'}
                                            </div>
                                          </div>
                                          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {question.question_text}
                                          </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                          <div style={{ padding: '12px', background: question.student_answer ? 'rgba(59, 130, 246, 0.1)' : 'var(--border)', borderRadius: '8px', border: `2px solid ${question.student_answer ? 'var(--blue)' : 'var(--border)'}` }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', marginBottom: '4px' }}>YOUR ANSWER</div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: question.student_answer ? 'var(--text-primary)' : 'var(--text-meta)' }}>
                                              {question.student_answer ? `${question.student_answer} - ${question.options[question.student_answer]}` : 'Not answered'}
                                            </div>
                                          </div>
                                          <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '2px solid var(--green)' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-meta)', marginBottom: '4px' }}>CORRECT ANSWER</div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)' }}>
                                              {question.correct_answer} - {question.options[question.correct_answer]}
                                            </div>
                                          </div>
                                        </div>

                                        <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
                                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>EXPLANATION</div>
                                          <div style={{ fontSize: '13px', color: '#047857', lineHeight: '1.5' }}>{question.explanation}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg)', borderRadius: '12px', textAlign: 'center' }}>
                                    <button
                                      onClick={() => {
                                        setIsAttemptingQuiz(false);
                                        setQuizSubmitted(false);
                                        setUserAnswers({});
                                        setCurrentQuestionIndex(0);
                                        setQuizResults(null);
                                        setQuizError(null);
                                      }}
                                      style={{
                                        padding: '12px 24px',
                                        background: 'var(--white)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600
                                      }}
                                    >
                                      Back to Preview
                                    </button>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {selectedContentType === 'qa_bank' && chapterContent.qa_bank && (
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>{chapterContent.qa_bank.heading || 'Q&A Bank'}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {chapterContent.qa_bank.qa_bank?.exercises?.map((exercise: any, exerciseIndex: number) => (
                          <div key={exerciseIndex} style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{exercise.section_title}</h4>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {exercise.questions?.map((question: any, questionIndex: number) => (
                                <div key={questionIndex} style={{ padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange)', background: 'rgba(251, 146, 60, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                        {question.type?.replace('_', ' ').toUpperCase() || 'QUESTION'}
                                      </span>
                                      <span style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600 }}>
                                        Q{question.question_number}
                                      </span>
                                      {question.based_on_image && (
                                        <span style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 600 }}>
                                          📷 Image-based
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.5' }}>
                                      {question.question_text}
                                    </div>
                                  </div>
                                  <div style={{ padding: '12px', background: '#F0F9FF', borderRadius: '6px', borderLeft: '3px solid var(--blue)' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)', marginBottom: '4px' }}>ANSWER</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                      {question.answer === 'Not found in chapter' ? (
                                        <span style={{ fontStyle: 'italic', color: 'var(--text-meta)' }}>Not found in chapter</span>
                                      ) : question.answer === 'Cannot answer - question requires image reference' ? (
                                        <span style={{ fontStyle: 'italic', color: 'var(--text-meta)' }}>Cannot answer - question requires image reference</span>
                                      ) : (
                                        question.answer
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedContentType === 'ppt_structure' && chapterContent.ppt_structure && (
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>PPT Structure</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {chapterContent.ppt_structure.slides?.map((slide: any, index: number) => (
                          <div key={index} style={{ padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 600, color: 'var(--purple)', fontSize: '14px', marginBottom: '8px' }}>Slide {index + 1}: {slide.title}</div>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0 }}>
                              {slide.content?.map((item: string, i: number) => (
                                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!subject && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Select a Subject</div>
                </div>
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-meta)' }}>
                  Go back to the Classes page and click on a subject to view available content
                </div>
              </div>
            )}

            {subject && !chapterContent && !contentTypeLoading && publishedContent?.chapters.length === 0 && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">No Content Available</div>
                </div>
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-meta)' }}>
                  No {contentTypes.find(t => t.key === selectedContentType)?.label.toLowerCase()} chapters have been published for {subject} yet.
                </div>
              </div>
            )}
          </div>

          <div className="right-col">
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ fontSize: '16px' }}>Class Info</div>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>GRADE & SECTION</div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Grade {studentClass.grade_level} - Section {studentClass.section}</div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>SCHOOL</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{studentClass.school_name}</div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-meta)', fontWeight: 600, marginBottom: '4px' }}>ENROLLED ON</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{new Date(studentClass.enrolled_on).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {subject && (
              <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                  <div className="card-title" style={{ fontSize: '16px' }}>Content Statistics</div>
                </div>
                <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Published Chapters</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--blue)' }}>{publishedContent?.total_published || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Content Type</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green)' }}>{contentTypes.find(t => t.key === selectedContentType)?.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Subject</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--orange)' }}>{subject}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}

"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---

export interface Student {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  initials: string;
  class: string;
  section: string;
  rollNo: number;
  parentName: string;
  phone: string;
  email?: string;
  admissionNo?: string;
  feeStatus: "Paid" | "Pending" | "Overdue";
  status: "active" | "inactive" | "graduated";
  academicStatus: "Pass" | "Fail";
  color: string;
  academicYear: string;
}

export interface TeacherAssignment {
  teacherId: number;
  subject: string;
  isClassTeacher: boolean;
}

export interface ClassRecord {
  id: number;
  className: string;
  section: string;
  assignments: TeacherAssignment[];
  students: number[];
  color: string;
  academicYear: string;
}

export interface Teacher {
  id: number;
  name: string;
}

// --- Initial Mock Data ---

const MOCK_TEACHERS: Teacher[] = [
  { id: 1, name: "Ms. Rita Sharma" },
  { id: 2, name: "Mrs. Sunita Gupta" },
  { id: 3, name: "Mr. David Wilson" },
  { id: 4, name: "Ms. Priya Mehta" },
  { id: 5, name: "Mr. Anil Verma" },
];

const MOCK_STUDENTS: Student[] = [
  { id: 101, name: "Anjali Kapoor", initials: "AK", class: "Grade 10", section: "A", rollNo: 1, parentName: "Mr. Kapoor", phone: "+91 98765 11111", feeStatus: "Paid", status: "active", academicStatus: "Pass", color: "var(--blue-mid)", academicYear: "2024-25" },
  { id: 102, name: "Rohan Mehta", initials: "RM", class: "Grade 10", section: "A", rollNo: 2, parentName: "Mr. Mehta", phone: "+91 98765 22222", feeStatus: "Pending", status: "active", academicStatus: "Pass", color: "var(--orange)", academicYear: "2024-25" },
  { id: 103, name: "Shreya Mishra", initials: "SM", class: "Grade 9", section: "B", rollNo: 3, parentName: "Mrs. Mishra", phone: "+91 98765 33333", feeStatus: "Paid", status: "active", academicStatus: "Pass", color: "var(--purple)", academicYear: "2024-25" },
  { id: 104, name: "Aryan Sharma", initials: "AS", class: "Grade 11", section: "A", rollNo: 4, parentName: "Mr. Sharma", phone: "+91 98765 44444", feeStatus: "Overdue", status: "active", academicStatus: "Pass", color: "var(--green)", academicYear: "2024-25" },
  { id: 105, name: "Priya Patel", initials: "PP", class: "Grade 10", section: "B", rollNo: 5, parentName: "Mr. Patel", phone: "+91 98765 55555", feeStatus: "Paid", status: "active", academicStatus: "Pass", color: "var(--blue)", academicYear: "2024-25" },
  { id: 106, name: "Vikram Singh", initials: "VS", class: "Grade 8", section: "A", rollNo: 6, parentName: "Mr. Singh", phone: "+91 98765 66666", feeStatus: "Paid", status: "active", academicStatus: "Fail", color: "var(--orange)", academicYear: "2024-25" },
  { id: 107, name: "Neha Gupta", initials: "NG", class: "Grade 9", section: "A", rollNo: 7, parentName: "Mrs. Gupta", phone: "+91 98765 77777", feeStatus: "Pending", status: "active", academicStatus: "Pass", color: "var(--purple)", academicYear: "2024-25" },
  { id: 108, name: "Kabir Das", initials: "KD", class: "Grade 11", section: "B", rollNo: 8, parentName: "Mr. Das", phone: "+91 98765 88888", feeStatus: "Overdue", status: "inactive", academicStatus: "Pass", color: "var(--blue-mid)", academicYear: "2024-25" },
];

const MOCK_CLASSES: ClassRecord[] = [
  { id: 1, className: "Grade 10", section: "A", assignments: [{ teacherId: 1, subject: "Mathematics", isClassTeacher: true }], students: [101, 102], color: "var(--blue)", academicYear: "2024-25" },
  { id: 2, className: "Grade 9", section: "B", assignments: [{ teacherId: 2, subject: "Science", isClassTeacher: true }], students: [103, 107], color: "var(--orange)", academicYear: "2024-25" },
  { id: 3, className: "Grade 11", section: "A", assignments: [{ teacherId: 3, subject: "Physics", isClassTeacher: true }], students: [104], color: "var(--green)", academicYear: "2024-25" },
  { id: 4, className: "Grade 10", section: "B", assignments: [{ teacherId: 4, subject: "English", isClassTeacher: true }], students: [105], color: "var(--purple)", academicYear: "2024-25" },
  { id: 5, className: "Grade 8", section: "A", assignments: [{ teacherId: 5, subject: "Mathematics", isClassTeacher: true }], students: [106], color: "var(--blue-mid)", academicYear: "2024-25" },
];

// --- Context Definition ---

interface AdminContextProps {
  students: Student[];
  classes: ClassRecord[];
  teachers: Teacher[];
  currentAcademicYear: string;
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: number, updates: Partial<Student>) => void;
  addClass: (newClass: Omit<ClassRecord, "id">) => void;
  updateClass: (id: number, updates: Partial<ClassRecord>) => void;
  deleteClass: (id: number) => void;
  promoteStudents: (fromYear: string, toYear: string) => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classes, setClasses] = useState<ClassRecord[]>(MOCK_CLASSES);
  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [currentAcademicYear, setCurrentAcademicYear] = useState("2024-25");

  const addStudent = (newStudent: Omit<Student, "id">) => {
    const id = Date.now();
    const student = { ...newStudent, id, academicStatus: "Pass" as const };
    setStudents(prev => [...prev, student]);

    // Auto-map to class matching year, className, and section
    setClasses(prevClasses => prevClasses.map(c => {
      if (c.academicYear === student.academicYear && c.className === student.class && c.section === student.section) {
        return { ...c, students: [...c.students, id] };
      }
      return c;
    }));
  };

  const updateStudent = (id: number, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addClass = (newClass: Omit<ClassRecord, "id">) => {
    setClasses(prev => [...prev, { ...newClass, id: Date.now() }]);
  };

  const updateClass = (id: number, updates: Partial<ClassRecord>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: number) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const promoteStudents = (fromYear: string, toYear: string) => {
    // 1. Get all classes from fromYear
    const currentClasses = classes.filter(c => c.academicYear === fromYear);
    const newClasses: ClassRecord[] = [];
    const updatedStudents = [...students];

    // Build next grade mapping helper
    const getNextGrade = (className: string) => {
      const match = className.match(/Grade (\d+)/i);
      if (match) {
        const gradeNum = parseInt(match[1]);
        if (gradeNum === 12) return "Graduated";
        return `Grade ${gradeNum + 1}`;
      }
      return className; 
    };

    currentClasses.forEach(c => {
      const nextGrade = getNextGrade(c.className);
      
      if (nextGrade !== "Graduated") {
        // Create duplicate class structure for next year
        const newClassId = Date.now() + Math.floor(Math.random() * 10000);
        const newClass: ClassRecord = {
          ...c,
          id: newClassId,
          academicYear: toYear,
          students: [], // Reset students initially, we'll populate them next
        };

        // Move students
        c.students.forEach(studentId => {
          const sIndex = updatedStudents.findIndex(s => s.id === studentId);
          if (sIndex !== -1 && updatedStudents[sIndex].status === "active") {
            updatedStudents[sIndex] = {
              ...updatedStudents[sIndex],
              class: c.className, // Keep old class or move to next? The user wants "Move students from current class to next class". So it should become `nextGrade`.
              // Actually, user said Grade 9 -> Grade 10. Wait, if the class name of `c` was Grade 9, when we DUPLICATE the class structure, does the class name stay Grade 9 or Grade 10?
              // "Promote students to next class: Grade 9 -> Grade 10" 
              // AND "Duplicate class structure for next year"
              // If we duplicate it literally, we get a new "Grade 9 - A" for 2025-26. 
              // The old "Grade 8 - A" students move into this new "Grade 9 - A".
            };
          }
        });
        
        // Wait, promotion logic implies students move to the NEXT grade, but classes are structural containers. 
        // Example: School always has Grade 9 A and Grade 10 A.
        // In 2025-26, we create Grade 9 A and Grade 10 A again.
        // The students inside 2024-25 Grade 9 A -> get moved to 2025-26 Grade 10 A.
        newClasses.push(newClass);
      }
    });
    
    // Better logic: Create structural copies first
    const duplicatedClasses = currentClasses.map((c, i) => ({
      ...c,
      id: Date.now() + i,
      academicYear: toYear,
      students: [] as number[]
    }));

    // Now promote students
    const finalStudents = updatedStudents.map(s => {
      if (s.academicYear === fromYear && s.status === "active") {
        if (s.academicStatus === "Fail") {
          // If failed, they stay in the exact same Grade and Section for the next year
          const targetClass = duplicatedClasses.find(c => c.className === s.class && c.section === s.section);
          if (targetClass) {
            targetClass.students.push(s.id);
          }
          return { ...s, academicYear: toYear }; 
        }

        const nextGrade = getNextGrade(s.class);
        if (nextGrade === "Graduated") {
          return { ...s, academicYear: toYear, status: "graduated" as const };
        } else {
          // Find matching class in duplicated classes
          const targetClass = duplicatedClasses.find(c => c.className === nextGrade && c.section === s.section);
          if (targetClass) {
            targetClass.students.push(s.id);
          }
          return { ...s, class: nextGrade, academicYear: toYear };
        }
      }
      return s;
    });

    setClasses(prev => [...prev, ...duplicatedClasses]);
    setStudents(finalStudents);
    setCurrentAcademicYear(toYear);
  };

  return (
    <AdminContext.Provider value={{ students, classes, teachers, currentAcademicYear, addStudent, updateStudent, addClass, updateClass, deleteClass, promoteStudents }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}

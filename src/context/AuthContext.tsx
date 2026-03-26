"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../lib/api';

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'teacher' | 'admin' | 'superadmin';
  school_id: string;
  is_active: boolean;
  is_password_changed: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsPasswordChange?: boolean }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const mockUsers: Record<string, User> = {
  "admin@gmail.com": { user_id: "u1", email: "admin@gmail.com", first_name: "Admin", last_name: "User", role: "admin", school_id: "s1", is_active: true, is_password_changed: true, created_at: "2026-01-01" },
  "teacher@gmail.com": { user_id: "u2", email: "teacher@gmail.com", first_name: "Rita", last_name: "Sharma", role: "teacher", school_id: "s1", is_active: true, is_password_changed: true, created_at: "2026-01-01" },
  "student@gmail.com": { user_id: "u3", email: "student@gmail.com", first_name: "Priya", last_name: "Sharma", role: "student", school_id: "s1", is_active: true, is_password_changed: true, created_at: "2026-01-01" },
  "owner@eduflow.com": { user_id: "u4", email: "owner@eduflow.com", first_name: "Platform", last_name: "Owner", role: "superadmin", school_id: "s1", is_active: true, is_password_changed: true, created_at: "2026-01-01" }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
<<<<<<< HEAD
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await apiFetch('/auth/me');

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
=======
      // Use our static mock logic
      const savedEmail = localStorage.getItem('mock_user_email');
      if (savedEmail && mockUsers[savedEmail]) {
        // Simulate a tiny network delay for realism
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(mockUsers[savedEmail]);
      } else {
        localStorage.removeItem('mock_user_email');
>>>>>>> 9bb5ab978091b9c8ebd58271677592ae22912dbf
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const mockUser = mockUsers[email.toLowerCase()];
      
      // We accept any password for the mock except empty
      if (mockUser && password.length >= 6) {
        // Store persistent mock token
        localStorage.setItem('mock_user_email', email.toLowerCase());
        setUser(mockUser);

        return {
          success: true,
          needsPasswordChange: false
        };
      } else {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check if the backend server is running.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('mock_user_email');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import { useState, useEffect, useCallback } from "react";

export interface GuestAssessment {
  assessmentId: number;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface GuestChallenge {
  challengeId: number;
  title: string;
  score: number;
  totalQuestions: number;
  isPassed: boolean;
  completedAt: string;
}

export interface GuestSession {
  id: string;
  startedAt: string;
  assessments: GuestAssessment[];
  challenges: GuestChallenge[];
  currentQuizAnswers: Record<string, Record<number, number>>;
}

const GUEST_KEY = "mindmap_guest_session";

function createGuestSession(): GuestSession {
  return {
    id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    startedAt: new Date().toISOString(),
    assessments: [],
    challenges: [],
    currentQuizAnswers: {},
  };
}

function loadGuestSession(): GuestSession {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) return JSON.parse(raw) as GuestSession;
  } catch {}
  const fresh = createGuestSession();
  localStorage.setItem(GUEST_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveGuestSession(session: GuestSession): void {
  localStorage.setItem(GUEST_KEY, JSON.stringify(session));
}

export function clearGuestSession(): void {
  localStorage.removeItem(GUEST_KEY);
}

export function getGuestSessionRaw(): GuestSession | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as GuestSession) : null;
  } catch {
    return null;
  }
}

export function useGuest() {
  const [session, setSession] = useState<GuestSession>(loadGuestSession);

  useEffect(() => {
    saveGuestSession(session);
  }, [session]);

  const saveAssessment = useCallback((data: GuestAssessment) => {
    setSession((prev) => {
      const without = prev.assessments.filter((a) => a.assessmentId !== data.assessmentId);
      return { ...prev, assessments: [...without, data] };
    });
  }, []);

  const saveChallenge = useCallback((data: GuestChallenge) => {
    setSession((prev) => {
      const without = prev.challenges.filter((c) => c.challengeId !== data.challengeId);
      return { ...prev, challenges: [...without, data] };
    });
  }, []);

  const hasActivity = session.assessments.length > 0 || session.challenges.length > 0;
  const totalScore = session.challenges.reduce((sum, c) => sum + c.score, 0);
  const passed = session.challenges.filter((c) => c.isPassed).length;

  return {
    session,
    saveAssessment,
    saveChallenge,
    hasActivity,
    totalScore,
    passed,
  };
}

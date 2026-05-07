import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/mindmap/login");
    } else if (!isLoading && user && adminOnly && user.role !== "admin") {
      setLocation("/mindmap/dashboard");
    }
  }, [user, isLoading, setLocation, adminOnly]);

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (adminOnly && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
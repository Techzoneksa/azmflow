"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="mr-[240px]">
          <TopBar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

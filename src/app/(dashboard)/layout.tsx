"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isDesktop } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.div
        animate={{ marginRight: isDesktop ? (isCollapsed ? 60 : 240) : 0 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      >
        <TopBar />
        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </AuthProvider>
  );
}

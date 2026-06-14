"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Truck,
  RotateCcw,
  FileUp,
  Users,
  Car,
  Handshake,
  FileText,
  Activity,
  BarChart3,
  UserCog,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";

const NAV_GROUPS = [
  {
    label: "التشغيل",
    items: [
      { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
      { label: "استيراد الشحنات", href: "/import", icon: FileUp },
      { label: "الشحنات", href: "/shipments", icon: Package },
      { label: "التوزيع", href: "/dispatch", icon: Truck },
      { label: "المرتجعات", href: "/returns", icon: RotateCcw },
    ],
  },
  {
    label: "الإدارة",
    items: [
      { label: "المناديب", href: "/agents", icon: Users },
      { label: "المركبات", href: "/vehicles", icon: Car },
      { label: "الشركاء", href: "/partners", icon: Handshake },
      { label: "العقود", href: "#", icon: FileText },
    ],
  },
  {
    label: "النظام",
    items: [
      { label: "مركز الجاهزية", href: "/readiness", icon: Activity },
      { label: "التقارير", href: "/reports", icon: BarChart3 },
      { label: "المستخدمون", href: "/users", icon: UserCog },
      { label: "الإعدادات", href: "/settings", icon: Settings },
    ],
  },
];

const sidebarVariants = {
  collapsed: { width: 60 },
  expanded: { width: 240 },
};

const logoTextVariants = {
  collapsed: { opacity: 0, width: 0, marginRight: 0 },
  expanded: { opacity: 1, width: "auto", marginRight: 8 },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, isDesktop, closeMobile } = useSidebar();
  const [openGroups, setOpenGroups] = useState<string[]>(["التشغيل"]);

  const toggleGroup = (label: string) => {
    if (isCollapsed) return;
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleNavClick = () => {
    if (!isDesktop) closeMobile();
  };

  return (
    <>
      {/* Desktop sidebar */}
      {isDesktop && (
        <motion.aside
          variants={sidebarVariants}
          animate={isCollapsed ? "collapsed" : "expanded"}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="fixed right-0 top-0 z-40 h-screen overflow-hidden border-l border-border bg-surface hidden lg:block"
        >
          <InnerSidebar
            isCollapsed={isCollapsed}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
            pathname={pathname}
            onNavClick={handleNavClick}
          />
        </motion.aside>
      )}

      {/* Mobile backdrop */}
      {!isDesktop && isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer */}
      {!isDesktop && (
        <motion.aside
          animate={{ x: isMobileOpen ? 0 : "100%" }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="fixed right-0 top-0 z-50 h-screen w-[280px] overflow-hidden border-l border-border bg-surface lg:hidden"
        >
          <InnerSidebar
            isCollapsed={false}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
            pathname={pathname}
            onNavClick={handleNavClick}
          />
        </motion.aside>
      )}
    </>
  );
}

function InnerSidebar({
  isCollapsed,
  openGroups,
  toggleGroup,
  pathname,
  onNavClick,
}: {
  isCollapsed: boolean;
  openGroups: string[];
  toggleGroup: (label: string) => void;
  pathname: string;
  onNavClick: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Link href="/dashboard" onClick={onNavClick} className="flex items-center">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-gradient text-white text-sm font-bold">
            ع
          </div>
          <motion.span
            variants={logoTextVariants}
            animate={isCollapsed ? "collapsed" : "expanded"}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap font-cairo text-lg font-bold text-text-primary"
          >
            AZM Flow
          </motion.span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden p-3 space-y-1">
        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups.includes(group.label);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "flex w-full items-center rounded-lg text-xs font-medium text-text-muted uppercase tracking-wider transition-colors",
                  isCollapsed ? "justify-center py-2" : "justify-between px-3 py-2 hover:text-text-secondary"
                )}
              >
                {isCollapsed ? (
                  <div className="w-full border-t border-border" />
                ) : (
                  <>
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </>
                )}
              </button>

              {(!isCollapsed || isOpen) && (
                <div className={cn("space-y-1", !isCollapsed && "pr-2")}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onNavClick}
                        className={cn(
                          "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                          isCollapsed
                            ? "justify-center mx-auto w-10 h-10"
                            : "gap-3 px-3 py-2.5",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                        {!isCollapsed && item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

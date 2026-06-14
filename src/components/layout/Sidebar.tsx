"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const NAV_GROUPS = [
  {
    label: "التشغيل",
    icon: ChevronDown,
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
    icon: ChevronDown,
    items: [
      { label: "المناديب", href: "/agents", icon: Users },
      { label: "المركبات", href: "#", icon: Car },
      { label: "الشركاء", href: "/partners", icon: Handshake },
      { label: "العقود", href: "#", icon: FileText },
    ],
  },
  {
    label: "النظام",
    icon: ChevronDown,
    items: [
      { label: "مركز الجاهزية", href: "/readiness", icon: Activity },
      { label: "التقارير", href: "/reports", icon: BarChart3 },
      { label: "المستخدمون", href: "/users", icon: UserCog },
      { label: "الإعدادات", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(["التشغيل"]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-[240px] border-l border-border bg-surface">
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-gradient text-white text-sm font-bold">
            ع
          </div>
          <span className="font-cairo text-lg font-bold text-text-primary">
            AZM Flow
          </span>
        </Link>
      </div>

      <nav className="h-[calc(100vh-64px)] overflow-y-auto p-3 space-y-1">
        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups.includes(group.label);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider hover:text-text-secondary transition-colors"
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <div className="space-y-1 pr-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

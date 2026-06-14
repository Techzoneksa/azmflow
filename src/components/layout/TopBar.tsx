"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, ChevronLeft, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const BREADCRUMBS: Record<string, string> = {
  "/dashboard": "لوحة التحكم",
  "/shipments": "الشحنات",
};

export default function TopBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => "/" + seg);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            {i > 0 && <ChevronLeft className="h-3.5 w-3.5" />}
            <span className={i === crumbs.length - 1 ? "text-text-primary" : ""}>
              {BREADCRUMBS[crumb] || crumb.split("/").pop()}
            </span>
          </span>
        ))}
      </div>

      <div className="mr-auto flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="بحث..."
            className="pr-9 h-9 text-sm"
          />
        </div>

        <button className="relative rounded-lg p-2 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 text-text-secondary hover:bg-surface-2 transition-all">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
                {user?.name?.charAt(0) || "م"}
              </div>
              <span className="text-sm text-text-primary font-medium hidden sm:block">
                {user?.name || "مشرف النظام"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="ml-2 h-4 w-4" />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-error">
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

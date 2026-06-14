"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENT } from "@/data/mock-agent";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "/agent/dashboard", icon: Home },
  { label: "شحناتي", href: "/agent/shipments", icon: Package },
  { label: "حسابي", href: "/agent/profile", icon: User },
];

const today = new Date().toLocaleDateString("ar-SA", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex items-start justify-center">
      <div className="w-full max-w-md h-screen relative shadow-2xl overflow-y-auto bg-background border-x border-border">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-xl px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-gradient text-white text-xs font-bold">
              ع
            </div>
            <span className="text-sm font-bold text-text-primary">AZM Flow</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-text-primary">{AGENT.name}</p>
            <p className="text-[10px] text-text-muted">{today}</p>
          </div>
        </header>

        <main className="pb-20">
          {children}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-md border-t border-border bg-surface">
          <div className="flex items-center justify-around h-16 px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <NavButton
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  icon={Icon}
                  isActive={isActive}
                />
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function NavButton({
  label,
  href,
  icon: Icon,
  isActive,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full transition-colors",
        isActive ? "text-primary" : "text-text-muted hover:text-text-secondary"
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

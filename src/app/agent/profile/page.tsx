"use client";

import { useRouter } from "next/navigation";
import { Phone, BadgeCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENT } from "@/data/mock-agent";

export default function AgentProfilePage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center py-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary text-3xl font-bold mb-3">
          {AGENT.name.charAt(0)}
        </div>
        <h1 className="text-lg font-bold text-text-primary">{AGENT.name}</h1>
        <p className="text-sm text-text-secondary">مندوب توصيل</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-surface border border-border p-4">
          <BadgeCheck className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-text-muted">رقم المندوب</p>
            <p className="text-sm font-medium text-text-primary">{AGENT.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface border border-border p-4">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-text-muted">رقم الجوال</p>
            <p className="text-sm font-inter font-medium text-text-primary" dir="ltr">
              {AGENT.phone}
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="destructive"
        className="w-full h-12 text-base"
        onClick={() => router.push("/login")}
      >
        <LogOut className="ml-2 h-5 w-5" />
        تسجيل الخروج
      </Button>
    </div>
  );
}

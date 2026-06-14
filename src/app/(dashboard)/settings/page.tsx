"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Shield, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import PageTransition from "@/components/layout/PageTransition";

const TABS = [
  { id: "general", label: "عام", icon: Globe },
  { id: "integrations", label: "التكاملات", icon: Link2 },
  { id: "security", label: "الأمان", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">الإعدادات</h1>
            <p className="text-text-secondary text-sm mt-1">إدارة إعدادات النظام العامة</p>
          </div>
          <Button>
            <Save className="ml-2 h-4 w-4" />
            حفظ التغييرات
          </Button>
        </div>

        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "security" && <SecurityTab />}
        </motion.div>
      </div>
    </PageTransition>
  );
}

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-5">
      <div>
        <h3 className="font-cairo text-base font-bold text-text-primary">{title}</h3>
        {desc && <p className="text-sm text-text-secondary mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="space-y-5">
      <SectionCard title="معلومات النظام" desc="البيانات الأساسية للنظام">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nameAr">اسم النظام (عربي)</Label>
            <Input id="nameAr" defaultValue="عزم فلو" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameEn">اسم النظام (إنجليزي)</Label>
            <Input id="nameEn" defaultValue="AZM Flow" dir="ltr" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الإشعارات" desc="إعدادات البريد الإلكتروني والإشعارات">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailFrom">بريد الإرسال</Label>
            <Input id="emailFrom" defaultValue="noreply@azmflow.com" dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">رقم واتساب</Label>
            <Input id="whatsapp" defaultValue="966500000000" dir="ltr" className="font-inter" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="المظهر" desc="تخصيص واجهة النظام">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>السمة</Label>
            <Select
              options={[
                { value: "dark", label: "داكن" },
                { value: "light", label: "فاتح" },
              ]}
              defaultValue="dark"
            />
          </div>
          <div className="space-y-2">
            <Label>اللغة</Label>
            <Select
              options={[
                { value: "ar", label: "العربية" },
                { value: "en", label: "English" },
              ]}
              defaultValue="ar"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-5">
      <SectionCard title="التكامل مع شركات الشحن" desc="ربط النظام مع شركات الشحن الخارجية">
        <div className="space-y-4">
          <IntegrationRow name="سبل" status="متصل" />
          <IntegrationRow name="نون" status="غير متصل" />
          <IntegrationRow name="جاهز" status="متصل" />
        </div>
      </SectionCard>

      <SectionCard title="بوابات الدفع" desc="ربط بوابات الدفع الإلكتروني">
        <div className="space-y-4">
          <IntegrationRow name="مدى" status="غير متصل" />
          <IntegrationRow name="Apple Pay" status="غير متصل" />
        </div>
      </SectionCard>

      <SectionCard title="API Keys" desc="مفاتيح API للتكامل الخارجي">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">مفتاح API</Label>
            <Input id="apiKey" defaultValue="sk_live_xxxxxxxxxxxx" dir="ltr" className="font-inter" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input id="webhook" defaultValue="https://api.azmflow.com/webhook" dir="ltr" className="font-inter" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-5">
      <SectionCard title="كلمة المرور" desc="تغيير كلمة مرور المدير العام">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPw">كلمة المرور الحالية</Label>
            <Input id="currentPw" type="password" dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPw">كلمة المرور الجديدة</Label>
            <Input id="newPw" type="password" dir="ltr" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الجلسات" desc="إدارة جلسات المستخدمين النشطة">
        <div className="space-y-3">
          <SessionRow user="مدير النظام" device="Chrome على Windows" ip="192.168.1.1" />
          <SessionRow user="منسق التوزيع" device="Safari على macOS" ip="192.168.1.2" />
        </div>
      </SectionCard>

      <SectionCard title="سجل النشاط" desc="آخر الأحداث في النظام">
        <div className="space-y-2 text-sm">
          <ActivityRow time="منذ 5 دقائق" action="تسجيل دخول" user="مدير النظام" />
          <ActivityRow time="منذ 15 دقيقة" action="إسناد شحنة" user="منسق التوزيع" />
          <ActivityRow time="منذ ساعة" action="إضافة شريك" user="مدير النظام" />
        </div>
      </SectionCard>
    </div>
  );
}

function IntegrationRow({ name, status }: { name: string; status: string }) {
  const connected = status === "متصل";
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${connected ? "bg-success-bg" : "bg-error-bg"}`}>
          <span className={`text-sm font-bold ${connected ? "text-success" : "text-error"}`}>{name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{name}</p>
          <p className={`text-xs ${connected ? "text-success" : "text-error"}`}>{status}</p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        {connected ? "إعدادات" : "ربط"}
      </Button>
    </div>
  );
}

function SessionRow({ user, device, ip }: { user: string; device: string; ip: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
      <div>
        <p className="text-sm font-medium text-text-primary">{user}</p>
        <p className="text-xs text-text-muted">{device} · {ip}</p>
      </div>
      <Button variant="ghost" size="sm" className="text-error">إنهاء</Button>
    </div>
  );
}

function ActivityRow({ time, action, user }: { time: string; action: string; user: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-text-secondary">{action}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span>{user}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

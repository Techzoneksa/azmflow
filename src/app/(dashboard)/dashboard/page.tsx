"use client";

import { motion } from "framer-motion";
import { Package, CheckCircle2, AlertTriangle, Undo2, Truck, Users } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { SHIPMENTS } from "@/data/mock";

const KPI_CARDS = [
  {
    label: "إجمالي الشحنات",
    value: "247",
    icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    label: "مُسلَّمة",
    value: SHIPMENTS.filter((s) => s.status === "تم التسليم").length.toString(),
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success-bg",
    border: "border-success/20",
  },
  {
    label: "متعثرة",
    value: SHIPMENTS.filter((s) => s.status === "تعذر التسليم").length.toString(),
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-bg",
    border: "border-warning/20",
  },
  {
    label: "مرتجعة",
    value: SHIPMENTS.filter((s) => s.status === "مرتجعة").length.toString(),
    icon: Undo2,
    color: "text-error",
    bg: "bg-error-bg",
    border: "border-error/20",
  },
];

const RECENT_SHIPMENTS = SHIPMENTS.slice(0, 5);

const STATUS_VARIANTS: Record<string, string> = {
  "تم التسليم": "success",
  "تعذر التسليم": "destructive",
  "مرتجعة": "destructive",
  "خرجت للتوصيل": "warning",
  "مسندة إلى مندوب": "warning",
  "جديد": "outline",
  "تم الاستلام من الشريك": "secondary",
  "جاهزة للتوزيع": "default",
};

const PRIORITIES = [
  { text: "مستندات مفقودة للشحنة SHP-1004", type: "urgent" },
  { text: "تأخير مندوب (أحمد الزهراني) عن موعد التسليم", type: "warning" },
  { text: "شحنة مرتجعة بانتظار التأكيد SHP-1005", type: "info" },
  { text: "طلب إعادة توزيع للشحنة SHP-1002", type: "warning" },
  { text: "تحديث بيانات الاتصال للعميل 0559876543", type: "info" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-cairo text-2xl font-bold text-text-primary">لوحة التحكم</h1>
          <p className="text-text-secondary text-sm mt-1">نظرة عامة على العمليات التشغيلية</p>
        </div>

        {/* KPI Cards Row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={item}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-border-active hover:shadow-lg hover:shadow-primary/5 cursor-default"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">{card.label}</p>
                    <p className="font-cairo text-3xl font-bold text-text-primary">
                      {card.value}
                    </p>
                  </div>
                  <div className={`rounded-lg ${card.bg} p-2.5 ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-0.5 ${card.color.replace("text", "bg")} w-0 transition-all duration-500 group-hover:w-full`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Donut Chart - Readiness */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">نسبة الجاهزية</h3>
            <div className="flex items-center justify-center">
              <DonutChart percentage={78} />
            </div>
            <p className="text-center text-sm text-text-secondary mt-3">
              78% من الشحنات جاهزة للتوزيع
            </p>
          </div>

          {/* Resources Status */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">حالة الموارد</h3>
            <div className="space-y-6">
              <ResourceBar
                icon={<Users className="h-5 w-5 text-primary" />}
                label="المناديب المتاحين"
                current={8}
                total={11}
                color="bg-primary"
              />
              <ResourceBar
                icon={<Truck className="h-5 w-5 text-success" />}
                label="المركبات الجاهزة"
                current={7}
                total={9}
                color="bg-success"
              />
            </div>
          </div>
        </motion.div>

        {/* Row 3: Recent Shipments + Priorities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Recent Shipments Mini Table */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cairo text-base font-bold text-text-primary">آخر الشحنات</h3>
              <span className="text-xs text-text-muted">آخر 5 شحنات</span>
            </div>
            <div className="space-y-3">
              {RECENT_SHIPMENTS.map((s) => {
                const variant = STATUS_VARIANTS[s.status] || "default";
                const colorMap: Record<string, string> = {
                  success: "text-success bg-success-bg border-success/20",
                  destructive: "text-error bg-error-bg border-error/20",
                  warning: "text-warning bg-warning-bg border-warning/20",
                  outline: "text-text-primary border-border",
                  secondary: "text-text-secondary bg-surface-2 border-border",
                  default: "text-primary bg-primary/10 border-primary/20",
                };
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-all hover:border-border-active"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-inter text-xs font-medium text-text-muted shrink-0">
                        {s.trackingNumber}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {s.customerName}
                        </p>
                        <p className="text-xs text-text-muted">{s.partner}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${colorMap[variant]}`}
                    >
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priorities */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">أولويات التشغيل</h3>
            <div className="space-y-3">
              {PRIORITIES.map((p, i) => {
                const borderColor =
                  p.type === "urgent"
                    ? "border-r-error"
                    : p.type === "warning"
                    ? "border-r-warning"
                    : "border-r-primary";
                const dotColor =
                  p.type === "urgent"
                    ? "bg-error"
                    : p.type === "warning"
                    ? "bg-warning"
                    : "bg-primary";
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 rounded-lg border border-border bg-background p-3 border-r-2 ${borderColor} transition-all hover:border-border-active`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                    <p className="text-sm text-text-secondary leading-relaxed">{p.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

function DonutChart({ percentage }: { percentage: number }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#1A1D26"
          strokeWidth="12"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6C8EF5" />
            <stop offset="100%" stopColor="#9B6CF5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-inter text-3xl font-bold text-text-primary" dir="ltr">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function ResourceBar({
  icon,
  label,
  current,
  total,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  total: number;
  color: string;
}) {
  const percent = (current / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-text-secondary">{label}</span>
        </div>
        <span className="font-inter text-sm font-medium text-text-primary">
          {current}/{total}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        />
      </div>
    </div>
  );
}

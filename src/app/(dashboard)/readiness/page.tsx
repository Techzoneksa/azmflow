"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, RefreshCw, ExternalLink, Truck, Shield, Globe, Building2, FileCheck, Briefcase } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/layout/PageTransition";
import { COMPLIANCE_SCORES, MISSING_ITEMS, OFFICIAL_LINKS } from "@/data/mock-readiness";

const iconMap: Record<string, React.ElementType> = {
  Truck, Globe, Shield, Building2, FileCheck, Briefcase,
};

const URGENCY_CONFIG = {
  urgent: { icon: AlertTriangle, color: "text-error", bg: "bg-error-bg", border: "border-error/20", badge: "destructive" as const },
  warning: { icon: AlertCircle, color: "text-warning", bg: "bg-warning-bg", border: "border-warning/20", badge: "warning" as const },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", badge: "default" as const },
};

export default function ReadinessPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">مركز الجاهزية</h1>
            <p className="text-text-secondary text-sm mt-1">متابعة الامتثال التشغيلي والقانوني</p>
          </div>
          <Button>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث البيانات
          </Button>
        </div>

        {/* Compliance Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPLIANCE_SCORES.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-surface p-5 text-center"
            >
              <p className="text-sm text-text-secondary mb-2">{item.label}</p>
              <div className="mx-auto w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={12}
                    data={[{ name: item.label, value: item.score, fill: item.color }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={6} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-cairo text-3xl font-bold" fill={item.color}>
                      {item.score}%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Missing Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 rounded-xl border border-border bg-surface p-5"
          >
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">البنود الناقصة</h3>
            <div className="space-y-3">
              {MISSING_ITEMS.map((item) => {
                const config = URGENCY_CONFIG[item.urgency];
                const Icon = config.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 rounded-lg border ${config.border} ${config.bg} p-3`}
                  >
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{item.text}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
                    </div>
                    <Badge variant={config.badge}>
                      {item.urgency === "urgent" ? "عاجل" : item.urgency === "warning" ? "تنبيه" : "معلومات"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Official Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 rounded-xl border border-border bg-surface p-5"
          >
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">الروابط الرسمية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICIAL_LINKS.map((link) => {
                const Icon = iconMap[link.icon] || Globe;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center transition-all hover:border-primary/30 hover:bg-primary/5 group"
                  >
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">{link.name}</span>
                    <ExternalLink className="h-3 w-3 text-text-muted" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

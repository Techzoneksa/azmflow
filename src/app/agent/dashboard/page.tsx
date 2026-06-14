"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Play,
  Square,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AGENT_SHIPMENTS } from "@/data/mock-agent";

export default function AgentDashboardPage() {
  const [isOnShift, setIsOnShift] = useState(false);
  const router = useRouter();

  const total = AGENT_SHIPMENTS.length;
  const delivered = AGENT_SHIPMENTS.filter((s) => s.status === "مكتملة").length;
  const failed = AGENT_SHIPMENTS.filter((s) => s.status === "متعثرة").length;
  const inProgress = AGENT_SHIPMENTS.filter((s) => s.status === "قيد التوصيل").length;

  const nextShipment = AGENT_SHIPMENTS.find((s) => s.status === "قيد التوصيل");

  return (
    <div className="p-4 space-y-4">
      <motion.div
        layout
        className={`rounded-2xl border-2 p-5 text-center transition-colors ${
          isOnShift
            ? "border-success/40 bg-success-bg/30"
            : "border-border bg-surface"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOnShift ? (
            <motion.div
              key="online"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
                </span>
                <span className="text-lg font-bold text-success">الوردية نشطة</span>
              </div>
              <p className="text-sm text-text-secondary">
                تم بدء الوردية في 08:30 ص
              </p>
              <Button
                variant="destructive"
                className="w-full h-12 text-base"
                onClick={() => setIsOnShift(false)}
              >
                <Square className="ml-2 h-4 w-4" />
                إنهاء الوردية
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="offline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <Clock className="mx-auto h-10 w-10 text-text-muted" />
              <p className="text-lg font-bold text-text-primary">الوردية متوقفة</p>
              <p className="text-sm text-text-secondary">
                اضغط لبدء وردية اليوم
              </p>
              <Button
                className="w-full h-12 text-base"
                onClick={() => setIsOnShift(true)}
              >
                <Play className="ml-2 h-4 w-4" />
                بدء الوردية
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Package} label="شحنات اليوم" value={total.toString()} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={CheckCircle2} label="تم التسليم" value={delivered.toString()} color="text-success" bg="bg-success-bg" />
        <StatCard icon={AlertTriangle} label="متعثرة" value={failed.toString()} color="text-warning" bg="bg-warning-bg" />
        <StatCard icon={Navigation} label="قيد التوصيل" value={inProgress.toString()} color="text-primary" bg="bg-primary/10" />
      </div>

      {nextShipment && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">الشحنة التالية</h3>
            <Badge variant="warning">قيد التوصيل</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-text-primary">
              {nextShipment.customerName}
            </p>
            <p className="text-sm text-text-secondary">
              {nextShipment.area} — {nextShipment.customerAddress}
            </p>
            <p className="font-inter text-xs text-text-muted" dir="ltr">
              {nextShipment.trackingNumber}
            </p>
          </div>
          <Button
            className="w-full h-12 text-base"
            onClick={() => router.push(`/agent/shipments/${nextShipment.id}`)}
          >
            <Navigation className="ml-2 h-4 w-4" />
            ابدأ التوجيه
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-secondary">{label}</span>
        <div className={`rounded-lg ${bg} p-1.5 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={`font-cairo text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, MapPin, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AGENT_SHIPMENTS, type AgentShipment } from "@/data/mock-agent";

type Tab = "الكل" | "قيد التوصيل" | "مكتملة";

const TABS: Tab[] = ["الكل", "قيد التوصيل", "مكتملة"];

const STATUS_BADGE: Record<string, "warning" | "success" | "destructive"> = {
  "قيد التوصيل": "warning",
  "مكتملة": "success",
  "متعثرة": "destructive",
};

export default function AgentShipmentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("الكل");
  const router = useRouter();

  const filtered = AGENT_SHIPMENTS.filter((s) => {
    if (activeTab === "الكل") return true;
    if (activeTab === "قيد التوصيل") return s.status === "قيد التوصيل";
    if (activeTab === "مكتملة") return s.status === "مكتملة" || s.status === "متعثرة";
    return true;
  });

  return (
    <div>
      <div className="sticky top-14 z-20 bg-surface border-b border-border px-4">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Package className="h-12 w-12 text-text-muted mb-3" />
              <p className="text-text-secondary">لا توجد شحنات في هذا القسم</p>
            </motion.div>
          ) : (
            filtered.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onClick={() => router.push(`/agent/shipments/${shipment.id}`)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ShipmentCard({
  shipment,
  onClick,
}: {
  shipment: AgentShipment;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className="rounded-xl border border-border bg-surface p-4 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-text-primary truncate">
            {shipment.customerName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-text-muted shrink-0" />
            <p className="text-sm text-text-secondary truncate">
              {shipment.area}
            </p>
          </div>
        </div>
        <ChevronLeft className="h-5 w-5 text-text-muted shrink-0 mr-2" />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-inter text-xs text-text-muted" dir="ltr">
          {shipment.trackingNumber}
        </span>
        <Badge variant={STATUS_BADGE[shipment.status]}>
          {shipment.status}
        </Badge>
      </div>
    </motion.div>
  );
}

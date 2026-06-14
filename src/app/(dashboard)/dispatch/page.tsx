"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Building2,
  Truck,
  RefreshCw,
  ChevronLeft,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import PageTransition from "@/components/layout/PageTransition";
import { Toaster, toast } from "sonner";
import { UNASSIGNED_SHIPMENTS, AVAILABLE_AGENTS, DISTRICTS } from "@/data/mock-dispatch";

export default function DispatchPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [districtFilter, setDistrictFilter] = useState("جميع المناطق");

  const filtered = useMemo(
    () =>
      districtFilter === "جميع المناطق"
        ? UNASSIGNED_SHIPMENTS
        : UNASSIGNED_SHIPMENTS.filter((s) => s.district === districtFilter),
    [districtFilter]
  );

  const allSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id));

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  }, [allSelected, filtered]);

  const handleAssign = useCallback(
    (agentName: string) => {
      if (selectedIds.size === 0) {
        toast.error("لم يتم تحديد أي شحنة", {
          description: "يرجى اختيار شحنة واحدة على الأقل للإسناد",
        });
        return;
      }
      toast.success(`تم إسناد الشحنات بنجاح للمندوب ${agentName}`, {
        description: `عدد الشحنات: ${selectedIds.size}`,
      });
      setSelectedIds(new Set());
    },
    [selectedIds]
  );

  const districtOptions = DISTRICTS.map((d) => ({ value: d, label: d }));

  return (
    <PageTransition>
      <Toaster
        position="top-left"
        toastOptions={{
          style: { background: "#111318", border: "1px solid #252830", color: "#F0F2F7" },
        }}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">منصة التوزيع والإسناد</h1>
            <p className="text-text-secondary text-sm mt-1">إسناد الشحنات الجاهزة للمناديب المتاحين</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث القائمة
          </Button>
        </div>

        {/* Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Right: Unassigned Shipments */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="selectAll"
                  checked={allSelected}
                  onChange={toggleAll}
                />
                <label htmlFor="selectAll" className="text-sm text-text-primary font-medium cursor-pointer">
                  تحديد الكل
                </label>
                {selectedIds.size > 0 && (
                  <span className="text-xs text-primary font-medium">
                    ({selectedIds.size} مختارة)
                  </span>
                )}
              </div>
              <Select
                options={districtOptions}
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-40 h-8 text-xs"
              />
            </div>

            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {filtered.map((shipment) => (
                  <motion.div
                    key={shipment.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                      selectedIds.has(shipment.id)
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-background hover:border-border-active"
                    }`}
                    onClick={() => toggleSelect(shipment.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(shipment.id)}
                      onChange={() => toggleSelect(shipment.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-text-primary truncate">
                          {shipment.customerName}
                        </p>
                        <span className="font-inter text-[10px] text-text-muted shrink-0 mr-2">
                          {shipment.trackingNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <MapPin className="h-3 w-3" />
                          {shipment.district}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Building2 className="h-3 w-3" />
                          {shipment.partner}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Phone className="h-3 w-3" />
                          {shipment.customerPhone}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {shipment.size}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <p className="text-center text-text-muted py-8">لا توجد شحنات في هذه المنطقة</p>
              )}
            </div>
          </div>

          {/* Left: Available Agents */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-surface">
            <div className="border-b border-border p-4">
              <h3 className="text-sm font-bold text-text-primary">المناديب المتاحين</h3>
            </div>
            <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {AVAILABLE_AGENTS.filter((a) => a.status === "متاح").map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-primary">{agent.name}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {agent.vehicle}
                        </p>
                      </div>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-text-muted">الحمولة الحالية</span>
                      <span className="font-inter text-xs font-medium text-text-primary">
                        معه {agent.currentLoad} من {agent.maxLoad} شحنات
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(agent.currentLoad / agent.maxLoad) * 100}%` }}
                        className="h-full rounded-full bg-primary"
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full h-9 text-xs"
                      disabled={selectedIds.size === 0}
                      onClick={() => handleAssign(agent.name)}
                    >
                      <ChevronLeft className="ml-1.5 h-3.5 w-3.5" />
                      إسناد الشحنات المحددة
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {AVAILABLE_AGENTS.filter((a) => a.status === "متاح").length === 0 && (
                <p className="text-center text-text-muted py-8">لا يوجد مناديب متاحون حالياً</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

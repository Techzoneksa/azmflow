"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  Copy,
  Phone,
  MapPin,
  Building2,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTransition from "@/components/layout/PageTransition";

interface ShipmentRow {
  id: string;
  trackingNumber: string;
  partner: string;
  pickupPoint: string;
  customerName: string;
  customerPhone: string;
  district: string;
  status: string;
  agentName: string | null;
  deliveryAttempts: { id: string; time: string; agentName: string; reason: string | null; success: boolean }[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "outline",
  RECEIVED: "secondary",
  READY: "warning",
  ASSIGNED: "info",
  OUT_FOR_DELIVERY: "primary",
  DELIVERED: "success",
  FAILED: "destructive",
  RETURNED: "muted",
} as const;

const STATUS_LABELS: Record<string, string> = {
  NEW: "جديد",
  RECEIVED: "تم الاستلام",
  READY: "جاهزة للتوزيع",
  ASSIGNED: "مسندة",
  OUT_FOR_DELIVERY: "خرجت للتوصيل",
  DELIVERED: "تم التسليم",
  FAILED: "تعذر التسليم",
  RETURNED: "مرتجعة",
};

export default function ShipmentsClient({
  shipments,
  partners,
}: {
  shipments: ShipmentRow[];
  partners: string[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(
    () =>
      shipments.filter((s) => {
        if (search && !s.trackingNumber.includes(search) && !s.customerPhone.includes(search)) return false;
        if (statusFilter && s.status !== statusFilter) return false;
        if (partnerFilter && s.partner !== partnerFilter) return false;
        return true;
      }),
    [shipments, search, statusFilter, partnerFilter]
  );

  const openSheet = useCallback((shipment: ShipmentRow) => {
    setSelectedShipment(shipment);
    setCopied(false);
    setSheetOpen(true);
  }, []);

  const copyPhone = useCallback(async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  const statusOptions = [
    { value: "", label: "جميع الحالات" },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const partnerOptions = [
    { value: "", label: "جميع الشركاء" },
    ...partners.map((p) => ({ value: p, label: p })),
  ];

  return (
    <PageTransition>
      <div className="space-y-5">
        <div>
          <h1 className="font-cairo text-2xl font-bold text-text-primary">الشحنات</h1>
          <p className="text-text-secondary text-sm mt-1">إدارة وتتبع جميع الشحنات</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="بحث برقم الشحنة أو رقم الجوال"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-9"
            />
          </div>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[160px] h-9"
          />
          <Select
            options={partnerOptions}
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="min-w-[140px] h-9"
          />
          <Button variant="secondary" size="sm" className="h-9">
            <Filter className="ml-1.5 h-4 w-4" />
            تصفية
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الشحنة</TableHead>
                <TableHead>الشريك</TableHead>
                <TableHead>المنطقة</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المندوب</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((shipment) => (
                <motion.tr
                  key={shipment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group border-b border-border transition-colors hover:bg-surface-2/50 cursor-pointer"
                  onClick={() => openSheet(shipment)}
                >
                  <TableCell>
                    <span className="font-inter text-xs font-medium text-text-primary">
                      {shipment.trackingNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-text-muted" />
                      <span className="text-sm">{shipment.partner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">{shipment.district}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{shipment.customerName}</p>
                      <p className="text-xs text-text-muted font-inter" dir="ltr">{shipment.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[shipment.status] as "outline"}>
                      {STATUS_LABELS[shipment.status] || shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">
                      {shipment.agentName || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSheet(shipment);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-text-muted" />
                      <p className="text-text-secondary">لا توجد نتائج للبحث</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="overflow-y-auto">
          {selectedShipment && (
            <>
              <SheetHeader className="text-right mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <SheetTitle className="font-inter text-lg">
                    {selectedShipment.trackingNumber}
                  </SheetTitle>
                  <Badge variant={STATUS_COLORS[selectedShipment.status] as "outline"}>
                    {STATUS_LABELS[selectedShipment.status] || selectedShipment.status}
                  </Badge>
                </div>
                <SheetDescription>
                  <span className="flex items-center gap-1.5 text-xs">
                    <Clock className="h-3 w-3" />
                    تاريخ الإنشاء: {new Date(selectedShipment.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <Section title="معلومات الشريك والاستلام">
                  <InfoRow icon={<Building2 className="h-4 w-4" />} label="الشريك" value={selectedShipment.partner} />
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label="نقطة الاستلام" value={selectedShipment.pickupPoint} />
                </Section>

                <Section title="معلومات العميل">
                  <InfoRow icon={<User className="h-4 w-4" />} label="الاسم" value={selectedShipment.customerName} />
                  <div className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-text-muted" />
                      <span className="text-sm text-text-secondary">رقم الجوال</span>
                      <span className="text-sm font-inter text-text-primary font-medium" dir="ltr">
                        {selectedShipment.customerPhone}
                      </span>
                    </div>
                    <button
                      onClick={() => copyPhone(selectedShipment.customerPhone)}
                      className="rounded-md p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
                      title="نسخ الرقم"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label="المنطقة" value={selectedShipment.district} />
                </Section>

                <Section title="محاولات التسليم">
                  {selectedShipment.deliveryAttempts.length === 0 ? (
                    <p className="text-sm text-text-muted">لا توجد محاولات تسليم سابقة</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedShipment.deliveryAttempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="flex items-start gap-3 rounded-lg border border-border p-3"
                        >
                          {attempt.success ? (
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-error mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-text-primary">
                                {attempt.agentName}
                              </span>
                              <span className="text-xs text-text-muted font-inter">
                                {new Date(attempt.time).toLocaleString("ar-SA")}
                              </span>
                            </div>
                            {attempt.reason && (
                              <p className="text-xs text-text-muted mt-1">
                                <span className="text-warning">السبب:</span> {attempt.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              </div>

              <SheetFooter className="mt-8 gap-3">
                <Button className="flex-1">إسناد لمندوب</Button>
                <Button variant="destructive" className="flex-1">تحويل لمرتجع</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageTransition>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-2 p-3">
      <span className="text-text-muted">{icon}</span>
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm text-text-primary font-medium mr-auto">{value}</span>
    </div>
  );
}

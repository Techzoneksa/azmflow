"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Phone,
  MessageCircle,
  MapPin,
  Navigation,
  CheckCircle2,
  XCircle,
  Circle,
  ChevronRight,
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AGENT_SHIPMENTS,
  FAILURE_REASONS,
} from "@/data/mock-agent";

export default function AgentShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const shipment = AGENT_SHIPMENTS.find((s) => s.id === id);

  const [podOpen, setPodOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [failReason, setFailReason] = useState("");
  const [copied, setCopied] = useState(false);

  if (!shipment) {
    return (
      <div className="p-4 text-center">
        <p className="text-text-secondary">الشحنة غير موجودة</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          رجوع
        </Button>
      </div>
    );
  }

  const copyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <div className="pb-24">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <button onClick={() => router.back()} className="p-1 -mr-1">
          <ChevronRight className="h-5 w-5 text-text-secondary" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-text-primary truncate">
            {shipment.customerName}
          </h1>
          <p className="font-inter text-xs text-text-muted" dir="ltr">
            {shipment.trackingNumber}
          </p>
        </div>
        <Badge
          variant={
            shipment.status === "مكتملة"
              ? "success"
              : shipment.status === "متعثرة"
              ? "destructive"
              : "warning"
          }
        >
          {shipment.status}
        </Badge>
      </div>

      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary mb-3">حالة الشحنة</h3>
        <div className="space-y-0">
          {shipment.timeline.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                ) : step.active ? (
                  <div className="relative">
                    <Circle className="h-5 w-5 text-primary shrink-0" />
                    <span className="absolute inset-1 rounded-full bg-primary animate-pulse" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-border shrink-0" />
                )}
                {i < shipment.timeline.length - 1 && (
                  <div
                    className={`w-px h-8 ${
                      step.completed ? "bg-success/40" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className={`pb-4 ${i === shipment.timeline.length - 1 ? "pb-0" : ""}`}>
                <p
                  className={`text-sm ${
                    step.completed
                      ? "text-text-primary"
                      : step.active
                      ? "text-primary"
                      : "text-text-muted"
                  }`}
                >
                  {step.label}
                </p>
                <p className="font-inter text-xs text-text-muted mt-0.5">
                  {step.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary mb-3">بيانات العميل</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-primary text-lg font-bold">
            {shipment.customerName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary">{shipment.customerName}</p>
            <p className="font-inter text-xs text-text-muted" dir="ltr">
              {shipment.customerPhone}
            </p>
          </div>
          <button
            onClick={() => copyPhone(shipment.customerPhone)}
            className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <a
            href={`tel:${shipment.customerPhone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success/10 border border-success/20 py-3 text-success text-sm font-bold"
          >
            <Phone className="h-5 w-5" />
            اتصال
          </a>
          <a
            href={`https://wa.me/${shipment.customerPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 py-3 text-primary text-sm font-bold"
          >
            <MessageCircle className="h-5 w-5" />
            واتساب
          </a>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary mb-3">موقع التوصيل</h3>
        <div className="rounded-xl bg-surface-2 p-3 mb-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-text-secondary">{shipment.customerAddress}</p>
          </div>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(shipment.customerAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-surface-2 border border-border py-3 text-sm text-text-primary font-bold"
        >
          <Navigation className="h-4 w-4" />
          فتح في خرائط جوجل
        </a>
      </div>

      {shipment.notes && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-bold text-text-primary mb-2">ملاحظات التسليم</h3>
          <p className="text-sm text-text-secondary bg-surface-2 rounded-xl p-3">
            {shipment.notes}
          </p>
        </div>
      )}

      {shipment.status === "قيد التوصيل" && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-surface border-t border-border p-4 flex gap-3">
          <Button
            variant="destructive"
            className="flex-1 h-14 text-base"
            onClick={() => setFailOpen(true)}
          >
            <XCircle className="ml-2 h-5 w-5" />
            تسجيل تعثر
          </Button>
          <Button
            className="flex-1 h-14 text-base"
            onClick={() => setPodOpen(true)}
          >
            <CheckCircle2 className="ml-2 h-5 w-5" />
            تسليم الشحنة
          </Button>
        </div>
      )}

      <Sheet open={podOpen} onOpenChange={setPodOpen}>
        <SheetContent side="bottom" className="px-4 pt-4 pb-8">
          <SheetHeader className="text-right mb-5">
            <SheetTitle>تأكيد التسليم</SheetTitle>
            <SheetDescription>
              أدخل بيانات المستلم لتأكيد تسليم الشحنة
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiver">اسم المستلم</Label>
              <Input
                id="receiver"
                placeholder="أدخل اسم المستلم"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Input
                id="notes"
                placeholder="اختياري — ملاحظات عن التسليم"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-12 text-base"
              disabled={!receiverName.trim()}
              onClick={() => {
                setPodOpen(false);
                setReceiverName("");
                setDeliveryNotes("");
              }}
            >
              <CheckCircle2 className="ml-2 h-5 w-5" />
              تأكيد التسليم
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={failOpen} onOpenChange={setFailOpen}>
        <SheetContent side="bottom" className="px-4 pt-4 pb-8">
          <SheetHeader className="text-right mb-5">
            <SheetTitle>تسجيل تعثر</SheetTitle>
            <SheetDescription>
              اختر سبب عدم التمكن من التسليم
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3 mb-6">
            {FAILURE_REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => setFailReason(reason)}
                className={`w-full text-right rounded-xl border p-4 text-sm transition-all ${
                  failReason === reason
                    ? "border-error/50 bg-error-bg text-error"
                    : "border-border bg-surface text-text-primary"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
          <Button
            variant="destructive"
            className="w-full h-12 text-base"
            disabled={!failReason}
            onClick={() => {
              setFailOpen(false);
              setFailReason("");
            }}
          >
            <XCircle className="ml-2 h-5 w-5" />
            تأكيد التعثر
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

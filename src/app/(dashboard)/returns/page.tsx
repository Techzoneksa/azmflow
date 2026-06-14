"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, RotateCcw, Undo2, CheckCircle2, Clock, MoreHorizontal, XCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageTransition from "@/components/layout/PageTransition";
import { RETURN_ITEMS } from "@/data/mock-analytics";
import { Toaster, toast } from "sonner";

export default function ReturnsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => RETURN_ITEMS.filter((r) =>
      r.trackingNumber.includes(search) ||
      r.partner.includes(search) ||
      r.agentName.includes(search)
    ),
    [search]
  );

  const pending = RETURN_ITEMS.filter((r) => r.status === "بانتظار الإجراء").length;
  const closed = RETURN_ITEMS.filter((r) => r.status === "تم التسليم للشريك").length;

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
            <h1 className="font-cairo text-2xl font-bold text-text-primary">إدارة المرتجعات</h1>
            <p className="text-text-secondary text-sm mt-1">متابعة الشحنات المرتجعة وإعادتها للشركاء</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="بحث برقم الشحنة أو الشريك..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-9"
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard icon={RotateCcw} label="إجمالي المرتجعات" value={RETURN_ITEMS.length.toString()} color="text-primary" bg="bg-primary/10" />
          <MetricCard icon={Clock} label="بانتظار التسليم للشريك" value={pending.toString()} color="text-warning" bg="bg-warning-bg" />
          <MetricCard icon={CheckCircle2} label="مغلقة" value={closed.toString()} color="text-success" bg="bg-success-bg" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الشحنة</TableHead>
                <TableHead>الشريك</TableHead>
                <TableHead>المندوب</TableHead>
                <TableHead>سبب الإرجاع</TableHead>
                <TableHead>تاريخ الإرجاع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-inter text-xs font-medium text-text-primary">
                      {item.trackingNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-primary">{item.partner}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">{item.agentName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">{item.reason}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm text-text-muted" dir="ltr">
                      {item.returnDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "بانتظار الإجراء" ? "warning" : "success"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => toast.success("تم إغلاق المرتجع بنجاح")}>
                          <XCircle className="ml-2 h-4 w-4" />
                          إغلاق المرتجع
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.success("تم إعادة جدولة الشحنة للتوصيل")}>
                          <RefreshCw className="ml-2 h-4 w-4" />
                          إعادة جدولة للتوصيل
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Undo2 className="mx-auto h-8 w-8 text-text-muted mb-2" />
                    <p className="text-text-secondary">لا توجد نتائج للبحث</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTransition>
  );
}

function MetricCard({
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4"
    >
      <div className={`rounded-lg ${bg} p-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className={`font-cairo text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </motion.div>
  );
}

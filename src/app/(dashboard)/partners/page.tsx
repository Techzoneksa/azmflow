"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Building2, FileText, MapPin, MoreHorizontal, Edit, Eye, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import PageTransition from "@/components/layout/PageTransition";
import { PARTNERS } from "@/data/mock-readiness";

const STATUS_VARIANT: Record<string, "success" | "destructive" | "warning"> = {
  "نشط": "success",
  "موقوف": "destructive",
  "قيد التجهيز": "warning",
};

export default function PartnersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", activity: "", city: "", phone: "" });

  const filtered = PARTNERS.filter((p) =>
    p.name.includes(search) || p.city.includes(search) || p.phone.includes(search)
  );

  const handleSubmit = useCallback(() => {
    setDialogOpen(false);
    setForm({ name: "", activity: "", city: "", phone: "" });
  }, []);

  const totalPartners = PARTNERS.length;
  const activeContracts = PARTNERS.reduce((s, p) => s + p.contracts, 0);
  const totalPickupPoints = PARTNERS.reduce((s, p) => s + p.pickupPoints, 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">إدارة الشركاء</h1>
            <p className="text-text-secondary text-sm mt-1">إدارة الشركاء والعقود ونقاط الاستلام</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة شريك جديد
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard icon={Building2} label="إجمالي الشركاء" value={totalPartners.toString()} color="text-primary" bg="bg-primary/10" />
          <MetricCard icon={FileText} label="عقود نشطة" value={activeContracts.toString()} color="text-success" bg="bg-success-bg" />
          <MetricCard icon={MapPin} label="نقاط استلام" value={totalPickupPoints.toString()} color="text-warning" bg="bg-warning-bg" />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="بحث باسم الشريك أو المدينة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-9"
            />
          </div>
          <Select
            options={[
              { value: "", label: "جميع الحالات" },
              { value: "نشط", label: "نشط" },
              { value: "موقوف", label: "موقوف" },
              { value: "قيد التجهيز", label: "قيد التجهيز" },
            ]}
            className="w-36 h-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الشريك</TableHead>
                <TableHead>نوع النشاط</TableHead>
                <TableHead>العقود النشطة</TableHead>
                <TableHead>نقاط الاستلام</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {partner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{partner.name}</p>
                        <p className="text-xs text-text-muted">{partner.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">{partner.activity}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm text-text-primary">{partner.contracts}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm text-text-primary">{partner.pickupPoints}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[partner.status]}>{partner.status}</Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="ml-2 h-4 w-4" />
                          عرض العقود
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-error">
                          <XCircle className="ml-2 h-4 w-4" />
                          إيقاف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <p className="text-text-secondary">لا توجد نتائج للبحث</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Partner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة شريك جديد</DialogTitle>
            <DialogDescription>أدخل بيانات الشريك الجديد لإضافته إلى النظام</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الشريك</Label>
              <Input
                id="name"
                placeholder="أدخل اسم الشريك"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">نوع النشاط</Label>
              <Select
                id="activity"
                options={[
                  { value: "", label: "اختر النشاط" },
                  { value: "متجر إلكتروني", label: "متجر إلكتروني" },
                  { value: "شركة شحن", label: "شركة شحن" },
                ]}
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Select
                  id="city"
                  options={[
                    { value: "", label: "اختر المدينة" },
                    { value: "الرياض", label: "الرياض" },
                    { value: "جدة", label: "جدة" },
                    { value: "الدمام", label: "الدمام" },
                    { value: "مكة", label: "مكة" },
                    { value: "المدينة", label: "المدينة" },
                    { value: "الخبر", label: "الخبر" },
                    { value: "القصيم", label: "القصيم" },
                  ]}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم التواصل</Label>
                <Input
                  id="phone"
                  placeholder="05xxxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="font-inter"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={!form.name || !form.activity}>
              حفظ الشريك
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

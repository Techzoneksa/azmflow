"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Car,
  User,
  CalendarDays,
  Shield,
  Pencil,
  Trash2,
  RefreshCw,
  Gauge,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/layout/PageTransition";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type VehicleStatus = "active" | "maintenance";

type Vehicle = {
  id: string;
  model: string;
  plateNumber: string;
  chassisNumber: string;
  sequenceNumber: string;
  color: string;
  licenseExpiry: Date;
  insuranceExpiry: Date;
  driverName: string;
  driverInitial: string;
  region: string;
  status: VehicleStatus;
};

const MOCK_VEHICLES: Vehicle[] = [
  { id: "1", model: "تويوتا كورولا 2020", plateNumber: "ABC 1234", chassisNumber: "JT2BF22KX00012345", sequenceNumber: "SN-001", color: "أبيض", licenseExpiry: new Date(2027, 2, 15), insuranceExpiry: new Date(2026, 11, 20), driverName: "أحمد خالد", driverInitial: "أ", region: "الرياض", status: "active" },
  { id: "2", model: "نيسان صني 2019", plateNumber: "DEF 5678", chassisNumber: "JN1BF22KX00067890", sequenceNumber: "SN-002", color: "فضي", licenseExpiry: new Date(2025, 11, 1), insuranceExpiry: new Date(2026, 6, 15), driverName: "ياسر محمد", driverInitial: "ي", region: "جدة", status: "active" },
  { id: "3", model: "هوندا سيفيك 2021", plateNumber: "GHI 9012", chassisNumber: "JH2BF22KX00090123", sequenceNumber: "SN-003", color: "أسود", licenseExpiry: new Date(2026, 8, 10), insuranceExpiry: new Date(2026, 3, 22), driverName: "محمد القحطاني", driverInitial: "م", region: "الدمام", status: "maintenance" },
  { id: "4", model: "كيا ريو 2022", plateNumber: "JKL 3456", chassisNumber: "KNABF22KX00034567", sequenceNumber: "SN-004", color: "أحمر", licenseExpiry: new Date(2026, 5, 28), insuranceExpiry: new Date(2026, 5, 28), driverName: "فيصل الزهراني", driverInitial: "ف", region: "مكة", status: "active" },
  { id: "5", model: "مازدا 3 2020", plateNumber: "MNO 7890", chassisNumber: "JMZBF22KX00078901", sequenceNumber: "SN-005", color: "أزرق", licenseExpiry: new Date(2026, 6, 5), insuranceExpiry: new Date(2026, 6, 20), driverName: "سعد الحربي", driverInitial: "س", region: "المدينة", status: "active" },
  { id: "6", model: "شيفروليه أوبترا 2018", plateNumber: "PQR 2345", chassisNumber: "KL1BF22KX00023456", sequenceNumber: "SN-006", color: "رمادي", licenseExpiry: new Date(2026, 6, 2), insuranceExpiry: new Date(2026, 7, 1), driverName: "خالد الدوسري", driverInitial: "خ", region: "الرياض", status: "maintenance" },
];

const REGIONS = ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "القصيم", "تبوك"];
const DRIVERS = ["أحمد خالد", "ياسر محمد", "محمد القحطاني", "فيصل الزهراني", "سعد الحربي", "خالد الدوسري"];
const COLORS = ["أبيض", "أسود", "فضي", "أحمر", "أزرق", "رمادي", "أخضر", "بني"];

type ViewMode = "grid" | "table";

function getExpiryStatus(date: Date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = date.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return { color: "text-error", bg: "bg-error/10", border: "border-error/30", daysLeft, label: "منتهية", pulse: true };
  if (daysLeft <= 7) return { color: "text-error", bg: "bg-error/10", border: "border-error/30", daysLeft, label: `خلال ${daysLeft} أيام`, pulse: true };
  if (daysLeft <= 30) return { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", daysLeft, label: `خلال ${daysLeft} يوم`, pulse: false };
  return { color: "text-success", bg: "bg-success/10", border: "border-success/30", daysLeft, label: `خلال ${daysLeft} يوم`, pulse: false };
}

function getHealthScore(v: Vehicle) {
  const l = getExpiryStatus(v.licenseExpiry).daysLeft;
  const i = getExpiryStatus(v.insuranceExpiry).daysLeft;
  const min = Math.min(l, i);
  if (min <= 0) return { score: 15, color: "#EF4444", label: "حرج" };
  if (min <= 7) return { score: 35, color: "#EF4444", label: "خطر" };
  if (min <= 30) return { score: 60, color: "#F59E0B", label: "تنبيه" };
  return { score: 90, color: "#22C55E", label: "جيد" };
}

function formatDate(date: Date) {
  try {
    return format(date, "yyyy/MM/dd", { locale: ar });
  } catch {
    return date.toLocaleDateString("ar-SA");
  }
}

function DatePicker({ value, onChange, label }: { value: Date | undefined; onChange: (d: Date | undefined) => void; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border bg-surface px-3 py-2 text-sm transition-all",
            value ? "text-text-primary" : "text-text-muted",
            "border-border hover:border-primary/50"
          )}
        >
          {value ? formatDate(value) : label}
          <CalendarDays className="h-4 w-4 text-text-muted mr-2 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={value}
          onSelect={(d) => { onChange(d); setOpen(false); }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({
    model: "", plateNumber: "", chassisNumber: "", sequenceNumber: "", color: COLORS[0],
    licenseExpiry: undefined as Date | undefined, insuranceExpiry: undefined as Date | undefined,
    driverName: DRIVERS[0], region: REGIONS[0], status: "active" as VehicleStatus,
  });

  const filtered = useMemo(() =>
    vehicles.filter((v) =>
      v.model.includes(search) || v.plateNumber.includes(search) || v.driverName.includes(search) || v.region.includes(search)
    ),
    [vehicles, search]
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ model: "", plateNumber: "", chassisNumber: "", sequenceNumber: "", color: COLORS[0], licenseExpiry: undefined, insuranceExpiry: undefined, driverName: DRIVERS[0], region: REGIONS[0], status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({ model: v.model, plateNumber: v.plateNumber, chassisNumber: v.chassisNumber, sequenceNumber: v.sequenceNumber, color: v.color, licenseExpiry: v.licenseExpiry, insuranceExpiry: v.insuranceExpiry, driverName: v.driverName, region: v.region, status: v.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.model || !form.plateNumber || !form.licenseExpiry || !form.insuranceExpiry) return;
    if (editing) {
      setVehicles((prev) => prev.map((v) => v.id === editing.id ? {
        ...v, ...form, driverInitial: form.driverName.charAt(0), id: v.id,
      } : v));
    } else {
      const newV: Vehicle = {
        id: String(Date.now()), ...form,
        driverInitial: form.driverName.charAt(0),
      };
      setVehicles((prev) => [newV, ...prev]);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">إدارة المركبات</h1>
            <p className="text-text-secondary text-sm mt-1">إدارة أسطول المركبات وتتبع تواريخ التجديد</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
              <button
                onClick={() => setView("grid")}
                className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all", view === "grid" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text-primary")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">بطاقات</span>
              </button>
              <button
                onClick={() => setView("table")}
                className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all", view === "table" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text-primary")}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">جدول</span>
              </button>
            </div>
            <Button onClick={openAdd}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مركبة
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="بحث بالطراز أو اللوحة أو السائق..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-10" />
        </div>

        {/* Table View */}
        {view === "table" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-right p-3 font-medium">الطراز</th>
                  <th className="text-right p-3 font-medium">اللوحة</th>
                  <th className="text-right p-3 font-medium">الشاصي</th>
                  <th className="text-right p-3 font-medium">اللون</th>
                  <th className="text-right p-3 font-medium">ترخيص</th>
                  <th className="text-right p-3 font-medium">تأمين</th>
                  <th className="text-right p-3 font-medium">السائق</th>
                  <th className="text-right p-3 font-medium">المنطقة</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-center p-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((v) => (
                    <TableRow key={v.id} vehicle={v} onEdit={openEdit} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState />}
          </motion.div>
        )}

        {/* Card View */}
        {view === "grid" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {filtered.map((v) => (
                <VehicleCard key={v.id} vehicle={v} onEdit={openEdit} onDelete={handleDelete} itemVariants={itemVariants} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        {view === "grid" && filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-text-muted">
            <Car className="h-12 w-12 mb-3 opacity-30" />
            <p>لا توجد مركبات مطابقة</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل المركبة" : "إضافة مركبة جديدة"}</DialogTitle>
            <DialogDescription>{editing ? "تحديث بيانات المركبة" : "أدخل بيانات المركبة بالكامل"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="الطراز">
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="تويوتا كورولا 2020" />
              </Field>
              <Field label="رقم اللوحة">
                <Input value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} placeholder="ABC 1234" className="font-inter" dir="ltr" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="رقم الشاصي">
                <Input value={form.chassisNumber} onChange={(e) => setForm({ ...form, chassisNumber: e.target.value })} placeholder="17 حرف" className="font-inter text-xs" dir="ltr" />
              </Field>
              <Field label="الرقم التسلسلي">
                <Input value={form.sequenceNumber} onChange={(e) => setForm({ ...form, sequenceNumber: e.target.value })} placeholder="SN-001" className="font-inter" dir="ltr" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="اللون">
                <Select options={COLORS.map((c) => ({ value: c, label: c }))} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </Field>
              <Field label="المنطقة">
                <Select options={REGIONS.map((r) => ({ value: r, label: r }))} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="السائق">
                <Select options={DRIVERS.map((d) => ({ value: d, label: d }))} value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} />
              </Field>
              <Field label="الحالة">
                <Select options={[{ value: "active", label: "نشطة" }, { value: "maintenance", label: "صيانة" }]} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VehicleStatus })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="تاريخ انتهاء الترخيص">
                <DatePicker value={form.licenseExpiry} onChange={(d) => setForm({ ...form, licenseExpiry: d })} label="اختر التاريخ" />
              </Field>
              <Field label="تاريخ انتهاء التأمين">
                <DatePicker value={form.insuranceExpiry} onChange={(d) => setForm({ ...form, insuranceExpiry: d })} label="اختر التاريخ" />
              </Field>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!form.model || !form.plateNumber || !form.licenseExpiry || !form.insuranceExpiry}>
              {editing ? "حفظ التغييرات" : "إضافة المركبة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs text-text-secondary">{label}</Label>{children}</div>;
}

function EmptyState() {
  return <p className="p-6 text-center text-text-muted text-sm">لا توجد نتائج للبحث</p>;
}

function TableRow({ vehicle, onEdit, onDelete }: { vehicle: Vehicle; onEdit: (v: Vehicle) => void; onDelete: (id: string) => void }) {
  const licenseS = getExpiryStatus(vehicle.licenseExpiry);
  const insuranceS = getExpiryStatus(vehicle.insuranceExpiry);
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="border-b border-border/60 hover:bg-surface-2/50 transition-colors"
    >
      <td className="p-3 text-text-primary font-medium">{vehicle.model}</td>
      <td className="p-3 font-inter text-text-primary">{vehicle.plateNumber}</td>
      <td className="p-3 font-inter text-xs text-text-secondary max-w-[120px] truncate">{vehicle.chassisNumber}</td>
      <td className="p-3">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-3.5 rounded-full border border-border" style={{ background: colorMap[vehicle.color] || "#888" }} />
          {vehicle.color}
        </span>
      </td>
      <td className="p-3">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border", licenseS.border, licenseS.bg, licenseS.color)}>
          {licenseS.pulse && <span className="relative flex h-2 w-2"><span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", licenseS.color.replace("text", "bg"))} /><span className={cn("relative inline-flex h-2 w-2 rounded-full", licenseS.color.replace("text", "bg"))} /></span>}
          {formatDate(vehicle.licenseExpiry)}
        </span>
      </td>
      <td className="p-3">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border", insuranceS.border, insuranceS.bg, insuranceS.color)}>
          {insuranceS.pulse && <span className="relative flex h-2 w-2"><span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", insuranceS.color.replace("text", "bg"))} /><span className={cn("relative inline-flex h-2 w-2 rounded-full", insuranceS.color.replace("text", "bg"))} /></span>}
          {formatDate(vehicle.insuranceExpiry)}
        </span>
      </td>
      <td className="p-3">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">{vehicle.driverInitial}</span>
          {vehicle.driverName}
        </span>
      </td>
      <td className="p-3 text-text-secondary">{vehicle.region}</td>
      <td className="p-3">
        <Badge variant={vehicle.status === "active" ? "success" : "warning"}>
          {vehicle.status === "active" ? "نشطة" : "صيانة"}
        </Badge>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => onEdit(vehicle)} className="rounded-lg p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 transition-all" title="تعديل"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(vehicle.id)} className="rounded-lg p-1.5 text-text-muted hover:text-error hover:bg-error/10 transition-all" title="حذف"><Trash2 className="h-4 w-4" /></button>
        </div>
      </td>
    </motion.tr>
  );
}

function VehicleCard({ vehicle, onEdit, onDelete, itemVariants }: { vehicle: Vehicle; onEdit: (v: Vehicle) => void; onDelete: (id: string) => void; itemVariants: Variants }) {
  const licenseS = getExpiryStatus(vehicle.licenseExpiry);
  const insuranceS = getExpiryStatus(vehicle.insuranceExpiry);
  const health = getHealthScore(vehicle);

  return (
    <motion.div
      variants={itemVariants}
      layout
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group rounded-2xl border border-border bg-surface p-5 transition-shadow duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">{vehicle.model}</h3>
            <p className="text-xs font-inter text-text-muted mt-0.5">{vehicle.plateNumber}</p>
          </div>
        </div>
        <Badge variant={vehicle.status === "active" ? "success" : "warning"}>
          {vehicle.status === "active" ? "نشطة" : "صيانة"}
        </Badge>
      </div>

      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-text-muted">مؤشر الصحة</span>
          <span className={cn("font-semibold", health.score < 40 ? "text-error" : health.score < 70 ? "text-warning" : "text-success")}>
            <Gauge className="inline h-3 w-3 ml-0.5" />
            {health.label}
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${health.score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full transition-all"
            style={{ background: `linear-gradient(90deg, ${health.color}, ${health.score > 80 ? "#22C55E" : health.color})` }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <InfoItem icon={Shield} label="الشاصي" value={vehicle.chassisNumber.slice(-6)} />
        <InfoItem icon={CalendarDays} label="الرقم التسلسلي" value={vehicle.sequenceNumber} />
        <InfoItem icon={Shield} label="اللون" value={<><span className="inline-block h-3 w-3 rounded-full border border-border ml-1 align-middle" style={{ background: colorMap[vehicle.color] || "#888" }} />{vehicle.color}</>} />
        <InfoItem icon={User} label="المنطقة" value={vehicle.region} />
      </div>

      {/* Expiry Dates */}
      <div className="space-y-1.5 mb-4">
        <ExpiryRow label="الترخيص" date={vehicle.licenseExpiry} status={licenseS} />
        <ExpiryRow label="التأمين" date={vehicle.insuranceExpiry} status={insuranceS} />
      </div>

      {/* Driver */}
      <div className="flex items-center gap-2 rounded-xl bg-background p-3 border border-border/60 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">{vehicle.driverInitial}</span>
        <div>
          <p className="text-xs text-text-muted">السائق</p>
          <p className="text-sm font-medium text-text-primary">{vehicle.driverName}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" onClick={() => onEdit(vehicle)}>
          <Pencil className="ml-1.5 h-3.5 w-3.5" />
          تعديل
        </Button>
        <Button variant="outline" size="sm" className="flex-1 h-9 text-xs text-warning border-warning/30 hover:bg-warning/10">
          <RefreshCw className="ml-1.5 h-3.5 w-3.5" />
          تجديد
        </Button>
        <button onClick={() => onDelete(vehicle.id)} className="rounded-lg p-2 text-text-muted hover:text-error hover:bg-error/10 transition-all">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-text-secondary">
      <Icon className="h-3.5 w-3.5 text-text-muted shrink-0" />
      <span className="text-text-muted">{label}:</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}

function ExpiryRow({ label, date, status }: { label: string; date: Date; status: ReturnType<typeof getExpiryStatus> }) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg px-3 py-1.5 text-xs border", status.bg, status.border)}>
      <span className="font-medium text-text-secondary">{label}</span>
      <span className={cn("flex items-center gap-1.5 font-semibold", status.color)}>
        {status.pulse && (
          <span className="relative flex h-2 w-2">
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", status.color.replace("text", "bg"))} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", status.color.replace("text", "bg"))} />
          </span>
        )}
        {formatDate(date)}
        <span className="text-[10px] opacity-70">({status.label})</span>
      </span>
    </div>
  );
}

const colorMap: Record<string, string> = {
  أبيض: "#FFFFFF", أسود: "#1A1A1A", فضي: "#C0C0C0", أحمر: "#EF4444",
  أزرق: "#3B82F6", رمادي: "#6B7280", أخضر: "#22C55E", بني: "#8B5E3C",
};

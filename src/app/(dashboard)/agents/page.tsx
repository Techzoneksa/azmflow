"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users,
  Package,
  Clock,
  TrendingUp,
  Search,
  Plus,
  MapPin,
  BadgeCheck,
  UserCog,
  Phone,
  Camera,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

// ─── Types ────────────────────────────────────────────────────
type AgentRecord = {
  id: string;
  name: string;
  idNumber: string;
  nationality: string;
  phone: string;
  district: string;
  supervisor: string;
  vehicle: string;
  shipmentsToday: number;
  successRate: number;
  avgDeliveryTime: number;
  isActive: boolean;
};

// ─── Mock Data ────────────────────────────────────────────────
const INITIAL_AGENTS: AgentRecord[] = [
  { id: "1", name: "أحمد خالد", idNumber: "1045876321", nationality: "سعودي", phone: "0511111111", district: "العليا", supervisor: "محمد القحطاني", vehicle: "تويوتا كورولا 2020", shipmentsToday: 12, successRate: 94, avgDeliveryTime: 28, isActive: true },
  { id: "2", name: "ياسر محمد", idNumber: "1087452369", nationality: "سعودي", phone: "0522222222", district: "الشاطئ", supervisor: "خالد الدوسري", vehicle: "نيسان صني 2019", shipmentsToday: 8, successRate: 87, avgDeliveryTime: 35, isActive: true },
  { id: "3", name: "محمد القحطاني", idNumber: "1065893247", nationality: "سعودي", phone: "0533333333", district: "النهضة", supervisor: "محمد القحطاني", vehicle: "هوندا سيفيك 2021", shipmentsToday: 15, successRate: 96, avgDeliveryTime: 22, isActive: true },
  { id: "4", name: "خالد الدوسري", idNumber: "1023658741", nationality: "سعودي", phone: "0544444444", district: "العزيزية", supervisor: "محمد القحطاني", vehicle: "كيا ريو 2022", shipmentsToday: 5, successRate: 72, avgDeliveryTime: 45, isActive: false },
  { id: "5", name: "فيصل الزهراني", idNumber: "1098741236", nationality: "سعودي", phone: "0555555555", district: "السليمانية", supervisor: "خالد الدوسري", vehicle: "مازدا 3 2020", shipmentsToday: 10, successRate: 90, avgDeliveryTime: 30, isActive: true },
  { id: "6", name: "سعد الحربي", idNumber: "1074123658", nationality: "سعودي", phone: "0566666666", district: "النخيل", supervisor: "محمد القحطاني", vehicle: "شيفروليه أوبترا 2018", shipmentsToday: 7, successRate: 85, avgDeliveryTime: 32, isActive: true },
];

const DISTRICTS = Array.from(new Set(INITIAL_AGENTS.map((a) => a.district)));
const SUPERVISORS = Array.from(new Set(INITIAL_AGENTS.map((a) => a.supervisor)));
const NATIONALITIES = ["سعودي", "مصري", "أردني", "سوري", "يمني", "فلسطيني"];

// ─── Sparkline ────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 64;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// ─── Switch Toggle ────────────────────────────────────────────
function SwitchToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
        checked ? "border-success bg-success/20" : "border-border bg-surface-2"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ${
          checked ? "translate-x-[22px] bg-success" : "translate-x-[2px] bg-text-muted"
        }`}
      />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRecord[]>(INITIAL_AGENTS);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [supervisorFilter, setSupervisorFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", idNumber: "", nationality: "سعودي", phone: "",
    district: DISTRICTS[0], supervisor: SUPERVISORS[0], vehicle: "",
  });

  const filtered = useMemo(() =>
    agents.filter((a) => {
      const matchSearch = a.name.includes(search) || a.idNumber.includes(search) || a.phone.includes(search);
      const matchDistrict = districtFilter === "all" || a.district === districtFilter;
      const matchSupervisor = supervisorFilter === "all" || a.supervisor === supervisorFilter;
      return matchSearch && matchDistrict && matchSupervisor;
    }),
    [agents, search, districtFilter, supervisorFilter]
  );

  const kpi = useMemo(() => ({
    totalActive: agents.filter((a) => a.isActive).length,
    totalShipments: agents.reduce((s, a) => s + a.shipmentsToday, 0),
    avgDeliveryTime: Math.round(agents.reduce((s, a) => s + a.avgDeliveryTime, 0) / agents.length),
    avgSuccessRate: Math.round(agents.reduce((s, a) => s + a.successRate, 0) / agents.length),
  }), [agents]);

  const handleAddAgent = useCallback(() => {
    if (!form.name || !form.idNumber || !form.phone) return;
    const newAgent: AgentRecord = {
      id: String(Date.now()),
      name: form.name,
      idNumber: form.idNumber,
      nationality: form.nationality,
      phone: form.phone,
      district: form.district,
      supervisor: form.supervisor,
      vehicle: form.vehicle || "غير محدد",
      shipmentsToday: 0,
      successRate: 0,
      avgDeliveryTime: 0,
      isActive: true,
    };
    setAgents((prev) => [newAgent, ...prev]);
    setDialogOpen(false);
  }, [form]);

  const handleToggleStatus = useCallback((id: string) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  }, []);

  const resetForm = () => setForm({
    name: "", idNumber: "", nationality: "سعودي", phone: "",
    district: DISTRICTS[0], supervisor: SUPERVISORS[0], vehicle: "",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">إدارة المناديب</h1>
            <p className="text-text-secondary text-sm mt-1">بطاقات الأداء والمتابعة اللحظية لفريق التوصيل</p>
          </div>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مندوب
          </Button>
        </div>

        {/* ── KPI Section (Glassmorphism) ── */}
        <div className="rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-xl p-6 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              icon={Users}
              label="المناديب النشطون"
              value={String(kpi.totalActive)}
              trend={{ value: 12, direction: "up" }}
              color="#6C8EF5"
            />
            <KpiCard
              icon={Package}
              label="شحنات اليوم"
              value={String(kpi.totalShipments)}
              trend={{ value: 8, direction: "up" }}
              color="#22C55E"
            />
            <KpiCard
              icon={Clock}
              label="متوسط وقت التوصيل"
              value={`${kpi.avgDeliveryTime} د`}
              trend={{ value: 3, direction: "down" }}
              color="#F5A623"
            />
            <KpiCard
              icon={TrendingUp}
              label="معدل النجاح"
              value={`${kpi.avgSuccessRate}%`}
              trend={{ value: 2, direction: "up" }}
              color="#6C8EF5"
            >
              <div className="mt-3 h-2 rounded-full bg-surface-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${kpi.avgSuccessRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #6C8EF5, #22C55E)" }}
                />
              </div>
            </KpiCard>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="بحث بالاسم أو رقم الهوية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={[{ value: "all", label: "جميع المناطق" }, ...DISTRICTS.map((d) => ({ value: d, label: d }))]}
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-36 h-10"
            />
            <Select
              options={[{ value: "all", label: "جميع المشرفين" }, ...SUPERVISORS.map((s) => ({ value: s, label: s }))]}
              value={supervisorFilter}
              onChange={(e) => setSupervisorFilter(e.target.value)}
              className="w-40 h-10"
            />
          </div>
        </div>

        {/* ── Agent Cards Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filtered.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onToggleStatus={handleToggleStatus}
                cardVariants={cardVariants}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p>لا توجد نتائج للبحث</p>
          </div>
        )}
      </div>

      {/* ── Add Agent Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>إضافة مندوب جديد</DialogTitle>
            <DialogDescription>أدخل البيانات الكاملة للمندوب الجديد</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-surface-2 text-text-muted cursor-pointer hover:border-primary/50 transition-colors">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">الصورة الشخصية</p>
                <p className="text-xs text-text-muted">اختر صورة للمندوب</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="الاسم الكامل">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="أدخل الاسم" />
              </Field>
              <Field label="رقم الهوية">
                <Input value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} placeholder="10 أرقام" className="font-inter" dir="ltr" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="الجنسية">
                <Select options={NATIONALITIES.map((n) => ({ value: n, label: n }))} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
              </Field>
              <Field label="رقم الجوال">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05xxxxxxxx" className="font-inter" dir="ltr" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="المنطقة">
                <Select options={DISTRICTS.map((d) => ({ value: d, label: d }))} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </Field>
              <Field label="المشرف">
                <Select options={SUPERVISORS.map((s) => ({ value: s, label: s }))} value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} />
              </Field>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleAddAgent} disabled={!form.name || !form.idNumber || !form.phone}>
              إضافة المندوب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

// ─── Sub-Components ────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-text-secondary">{label}</Label>
      {children}
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: { value: number; direction: "up" | "down" };
  color: string;
  children?: React.ReactNode;
}) {
  const isUp = trend.direction === "up";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? "text-success" : "text-error"}`}>
          {isUp ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {trend.value}%
        </span>
      </div>
      <p className="text-2xl font-bold text-text-primary font-cairo">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
      {children}
    </motion.div>
  );
}

function AgentCard({
  agent,
  onToggleStatus,
  cardVariants,
}: {
  agent: AgentRecord;
  onToggleStatus: (id: string) => void;
  cardVariants: Variants;
}) {
  const sparklineData = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const base = agent.successRate;
      return Math.max(0, Math.min(100, base + Math.round((Math.sin(i * 1.2) + Math.random() * 0.6) * 6)));
    }),
    [agent.successRate]
  );
  const statusColor = agent.isActive ? "bg-success" : "bg-text-muted";

  return (
    <motion.div
      variants={cardVariants}
      layout
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-2xl border border-border bg-surface p-5 transition-shadow duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Top: Avatar + Identity */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold bg-primary-gradient text-white shadow-lg shadow-primary/20`}>
            {agent.name.charAt(0)}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface ${statusColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-text-primary truncate">{agent.name}</h3>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
            <span className="font-inter">{agent.idNumber}</span>
            <span>·</span>
            <span>{agent.nationality}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3 w-3 text-text-muted" />
            <span className="text-xs text-text-secondary">{agent.district}</span>
          </div>
        </div>
      </div>

      {/* KPI Badge with Sparkline */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-background p-3 border border-border/60">
        <div className="space-y-0.5">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">شحنات اليوم</p>
          <p className="font-cairo text-lg font-bold text-text-primary">{agent.shipmentsToday}</p>
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <Clock className="h-3 w-3" />
            {agent.avgDeliveryTime} د
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Sparkline data={sparklineData} color={agent.successRate > 85 ? "#22C55E" : "#F5A623"} />
          <span className={`text-xs font-semibold ${agent.successRate > 85 ? "text-success" : "text-warning"}`}>
            {agent.successRate}% نجاح
          </span>
        </div>
      </div>

      {/* Supervisor + Vehicle */}
      <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <UserCog className="h-3 w-3 text-text-muted" />
          {agent.supervisor}
        </span>
        <span className="flex items-center gap-1">
          <BadgeCheck className="h-3 w-3 text-text-muted" />
          {agent.vehicle}
        </span>
      </div>

      {/* Footer: Contact + Toggle */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
        <Button variant="ghost" size="sm" className="text-xs h-8 px-2 text-text-muted hover:text-text-primary">
          <Phone className="ml-1 h-3.5 w-3.5" />
          {agent.phone}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">{agent.isActive ? "نشط" : "موقوف"}</span>
          <SwitchToggle checked={agent.isActive} onChange={() => onToggleStatus(agent.id)} />
        </div>
      </div>
    </motion.div>
  );
}

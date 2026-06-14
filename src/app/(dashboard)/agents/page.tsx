"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Truck,
  Phone,
  ToggleLeft,
  ToggleRight,
  Package,
  CheckCircle2,
} from "lucide-react";
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

type AgentRecord = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  shipmentsToday: number;
  isActive: boolean;
};

const INITIAL_AGENTS: AgentRecord[] = [
  { id: "1", name: "أحمد خالد", phone: "0511111111", vehicle: "تويوتا كورولا 2020", shipmentsToday: 12, isActive: true },
  { id: "2", name: "ياسر محمد", phone: "0522222222", vehicle: "نيسان صني 2019", shipmentsToday: 8, isActive: true },
  { id: "3", name: "محمد القحطاني", phone: "0533333333", vehicle: "هوندا سيفيك 2021", shipmentsToday: 15, isActive: true },
  { id: "4", name: "خالد الدوسري", phone: "0544444444", vehicle: "كيا ريو 2022", shipmentsToday: 5, isActive: false },
  { id: "5", name: "فيصل الزهراني", phone: "0555555555", vehicle: "مازدا 3 2020", shipmentsToday: 10, isActive: true },
];

const VEHICLES = [
  "تويوتا كورولا 2020",
  "نيسان صني 2019",
  "هوندا سيفيك 2021",
  "كيا ريو 2022",
  "مازدا 3 2020",
  "شيفروليه أوبترا 2018",
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRecord[]>(INITIAL_AGENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentRecord | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "" });

  const filtered = agents.filter((a) => {
    const matchSearch = a.name.includes(search) || a.phone.includes(search);
    const matchStatus = !statusFilter || (statusFilter === "نشط" ? a.isActive : !a.isActive);
    return matchSearch && matchStatus;
  });

  const activeAgents = agents.filter((a) => a.isActive).length;
  const totalShipments = agents.reduce((s, a) => s + a.shipmentsToday, 0);
  const avgShipments = agents.length ? Math.round(totalShipments / agents.length) : 0;

  const resetForm = () => setForm({ name: "", phone: "", vehicle: VEHICLES[0] });

  const handleCreate = useCallback(() => {
    if (!form.name || !form.phone) return;
    const newAgent: AgentRecord = {
      id: String(Date.now()),
      name: form.name,
      phone: form.phone,
      vehicle: form.vehicle,
      shipmentsToday: 0,
      isActive: true,
    };
    setAgents((prev) => [newAgent, ...prev]);
    setCreateOpen(false);
    resetForm();
  }, [form]);

  const handleEdit = useCallback(() => {
    if (!editingAgent || !form.name) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === editingAgent.id
          ? { ...a, name: form.name, phone: form.phone, vehicle: form.vehicle }
          : a
      )
    );
    setEditingAgent(null);
  }, [editingAgent, form]);

  const handleToggleStatus = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  }, []);

  const openEdit = useCallback((agent: AgentRecord) => {
    setEditingAgent(agent);
    setForm({ name: agent.name, phone: agent.phone, vehicle: agent.vehicle });
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">إدارة المناديب</h1>
            <p className="text-text-secondary text-sm mt-1">إدارة مناديب التوصيل والمركبات</p>
          </div>
          <Button onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مندوب
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <MetricCard icon={Users} label="إجمالي المناديب" value={String(agents.length)} color="text-primary" bg="bg-primary/10" />
          <MetricCard icon={CheckCircle2} label="نشط حاليًا" value={String(activeAgents)} color="text-success" bg="bg-success-bg" />
          <MetricCard icon={Package} label="شحنات اليوم" value={String(totalShipments)} color="text-warning" bg="bg-warning-bg" />
          <MetricCard icon={Truck} label="متوسط الشحنات" value={String(avgShipments)} color="text-text-secondary" bg="bg-surface-2" />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="بحث باسم المندوب..."
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
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36 h-9"
          />
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المندوب</TableHead>
                <TableHead>رقم الجوال</TableHead>
                <TableHead>المركبة</TableHead>
                <TableHead>شحنات اليوم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{agent.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm text-text-primary flex items-center gap-1" dir="ltr">
                      <Phone className="h-3 w-3 text-text-muted" />
                      {agent.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary flex items-center gap-1">
                      <Truck className="h-3 w-3 text-text-muted" />
                      {agent.vehicle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm font-semibold text-text-primary">{agent.shipmentsToday}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={agent.isActive ? "success" : "destructive"}>
                      {agent.isActive ? "نشط" : "موقوف"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openEdit(agent)}>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(agent.id)}>
                          {agent.isActive ? (
                            <ToggleLeft className="ml-2 h-4 w-4" />
                          ) : (
                            <ToggleRight className="ml-2 h-4 w-4" />
                          )}
                          {agent.isActive ? "إيقاف" : "تفعيل"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-error">
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مندوب جديد</DialogTitle>
            <DialogDescription>أدخل بيانات المندوب الجديد</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">اسم المندوب</Label>
              <Input
                id="agentName"
                placeholder="أدخل اسم المندوب"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentPhone">رقم الجوال</Label>
              <Input
                id="agentPhone"
                placeholder="05xxxxxxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="font-inter"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentVehicle">المركبة</Label>
              <Select
                id="agentVehicle"
                options={VEHICLES.map((v) => ({ value: v, label: v }))}
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleCreate} disabled={!form.name || !form.phone}>
              حفظ المندوب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAgent} onOpenChange={(o) => { if (!o) setEditingAgent(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المندوب</DialogTitle>
            <DialogDescription>تحديث بيانات {editingAgent?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">اسم المندوب</Label>
              <Input
                id="editName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">رقم الجوال</Label>
              <Input
                id="editPhone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="font-inter"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editVehicle">المركبة</Label>
              <Select
                id="editVehicle"
                options={VEHICLES.map((v) => ({ value: v, label: v }))}
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={!form.name || !form.phone}>
              حفظ التغييرات
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

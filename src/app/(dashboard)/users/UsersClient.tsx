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
  ToggleLeft,
  ToggleRight,
  Shield,
  Phone,
  User,
  CalendarDays,
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
import { ROLE_LIST, ROLE_LABELS } from "@/lib/permissions";

type UserRecord = {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: string;
  jobTitle: string;
  isActive: boolean;
  createdAt: Date;
};

export default function UsersClient({ users: initialUsers }: { users: UserRecord[] }) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    role: "DATA_ENTRY",
    jobTitle: "",
  });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.includes(search) ||
      u.username.includes(search) ||
      u.phone.includes(search);
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const activeCount = users.filter((u) => u.isActive).length;
  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const resetForm = () =>
    setForm({ name: "", username: "", phone: "", password: "", role: "DATA_ENTRY", jobTitle: "" });

  const handleCreate = useCallback(async () => {
    if (!form.name || !form.username || !form.phone || !form.password) return;
    try {
      const { createUser } = await import("@/app/actions/userActions");
      const newUser = await createUser(form);
      setUsers((prev) => [newUser as UserRecord, ...prev]);
      setCreateOpen(false);
      resetForm();
    } catch (e) {
      console.error("[users] create error:", e);
    }
  }, [form]);

  const handleEdit = useCallback(async () => {
    if (!editTarget || !form.name) return;
    try {
      const { updateUser } = await import("@/app/actions/userActions");
      const updated = await updateUser(editTarget.id, {
        name: form.name,
        username: form.username,
        phone: form.phone,
        role: form.role,
        jobTitle: form.jobTitle,
        ...(form.password ? { password: form.password } : {}),
      });
      setUsers((prev) => prev.map((u) => (u.id === editTarget.id ? (updated as UserRecord) : u)));
      setEditTarget(null);
    } catch (e) {
      console.error("[users] edit error:", e);
    }
  }, [editTarget, form]);

  const handleToggleStatus = useCallback(async (user: UserRecord) => {
    try {
      const { toggleUserStatus } = await import("@/app/actions/userActions");
      const result = await toggleUserStatus(user.id, !user.isActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: result.isActive } : u))
      );
    } catch (e) {
      console.error("[users] toggle error:", e);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const { deleteUser } = await import("@/app/actions/userActions");
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error("[users] delete error:", e);
    }
  }, []);

  const openEdit = useCallback((user: UserRecord) => {
    setEditTarget(user);
    setForm({
      name: user.name,
      username: user.username,
      phone: user.phone,
      password: "",
      role: user.role,
      jobTitle: user.jobTitle,
    });
  }, []);

  const roleOptions = [
    { value: "", label: "جميع الصلاحيات" },
    ...ROLE_LIST.map((r) => ({ value: r.value, label: r.label })),
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">إدارة المستخدمين</h1>
            <p className="text-text-secondary text-sm mt-1">إضافة وتعديل وإدارة صلاحيات المستخدمين</p>
          </div>
          <Button onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مستخدم
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <MetricCard icon={Users} label="إجمالي المستخدمين" value={String(users.length)} color="text-primary" bg="bg-primary/10" />
          <MetricCard icon={Shield} label="نشط حاليًا" value={String(activeCount)} color="text-success" bg="bg-success-bg" />
          <MetricCard icon={User} label="الصلاحيات" value={String(Object.keys(roleCounts).length)} color="text-warning" bg="bg-warning-bg" />
          <MetricCard icon={CalendarDays} label="آخر تحديث" value={new Date().toLocaleDateString("ar-SA")} color="text-text-secondary" bg="bg-surface-2" />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="بحث بالاسم أو اسم المستخدم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-9"
            />
          </div>
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-40 h-9"
          />
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>المسمى الوظيفي</TableHead>
                <TableHead>جهة الاتصال</TableHead>
                <TableHead>الصلاحية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-muted">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">{user.jobTitle || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm text-text-primary flex items-center gap-1" dir="ltr">
                      <Phone className="h-3 w-3 text-text-muted" />
                      {user.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "success" : "destructive"}>
                      {user.isActive ? "نشط" : "موقوف"}
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
                        <DropdownMenuItem onClick={() => openEdit(user)}>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.isActive ? (
                            <ToggleLeft className="ml-2 h-4 w-4" />
                          ) : (
                            <ToggleRight className="ml-2 h-4 w-4" />
                          )}
                          {user.isActive ? "إيقاف" : "تفعيل"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-error" onClick={() => handleDelete(user.id)}>
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
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            <DialogDescription>أدخل بيانات المستخدم الجديد وصلاحياته</DialogDescription>
          </DialogHeader>
          <UserForm form={form} onChange={setForm} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleCreate} disabled={!form.name || !form.username || !form.phone || !form.password}>
              حفظ المستخدم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>تحديث بيانات وصلاحيات {editTarget?.name}</DialogDescription>
          </DialogHeader>
          <UserForm form={form} onChange={setForm} isEdit />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={!form.name || !form.username || !form.phone}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

function UserForm({
  form,
  onChange,
  isEdit,
}: {
  form: { name: string; username: string; phone: string; password: string; role: string; jobTitle: string };
  onChange: (f: typeof form) => void;
  isEdit?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            placeholder="أدخل الاسم"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">اسم المستخدم</Label>
          <Input
            id="username"
            placeholder="أدخل اسم المستخدم"
            value={form.username}
            onChange={(e) => onChange({ ...form, username: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الجوال</Label>
          <Input
            id="phone"
            placeholder="05xxxxxxxx"
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            className="font-inter"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
          <Input
            id="jobTitle"
            placeholder="مثال: محاسب"
            value={form.jobTitle}
            onChange={(e) => onChange({ ...form, jobTitle: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">الصلاحية</Label>
        <Select
          id="role"
          options={[...ROLE_LIST.map((r) => ({ value: r.value, label: r.label }))]}
          value={form.role}
          onChange={(e) => onChange({ ...form, role: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{isEdit ? "كلمة المرور الجديدة (اتركها فارغة إذا لا تريد التغيير)" : "كلمة المرور"}</Label>
        <Input
          id="password"
          type="password"
          placeholder={isEdit ? "اترك فارغاً إذا لا تريد التغيير" : "أدخل كلمة المرور"}
          value={form.password}
          onChange={(e) => onChange({ ...form, password: e.target.value })}
          dir="ltr"
        />
      </div>
    </div>
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { CalendarIcon, TrendingUp, Package, Clock, Trophy } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import PageTransition from "@/components/layout/PageTransition";
import { KPI_REPORTS, WEEKLY_DATA, FAILURE_REASONS_DATA, TOP_AGENTS } from "@/data/mock-analytics";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-xl">
        <p className="text-sm font-bold text-text-primary mb-1">{label}</p>
        {payload.map((p, i: number) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { color: string; name: string; value: number }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-xl">
        <p className="text-sm" style={{ color: payload[0].color }}>
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">التقارير التشغيلية</h1>
            <p className="text-text-secondary text-sm mt-1">تحليلات الأداء ونسب النجاح</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "MMM yyyy", { locale: arSA }) : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={arSA}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            icon={TrendingUp}
            label="نسبة نجاح التوصيل"
            value={`${KPI_REPORTS.successRate}%`}
            subtext={`+2.5% عن الشهر الماضي`}
            color="text-success"
            bg="bg-success-bg"
          />
          <KpiCard
            icon={Package}
            label="إجمالي الشحنات"
            value={KPI_REPORTS.totalShipments.toLocaleString()}
            subtext="هذا الشهر"
            color="text-primary"
            bg="bg-primary/10"
          />
          <KpiCard
            icon={Clock}
            label="متوسط وقت التوصيل"
            value={`${KPI_REPORTS.avgDeliveryTime}`}
            subtext="ساعات"
            color="text-warning"
            bg="bg-warning-bg"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 rounded-xl border border-border bg-surface p-5"
          >
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">حجم الشحنات (أسبوعي)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="returnedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252830" />
                  <XAxis dataKey="day" stroke="#50566A" tick={{ fill: "#8B92A5", fontSize: 12 }} />
                  <YAxis stroke="#50566A" tick={{ fill: "#8B92A5", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="مُسلَّمة" stroke="#22C55E" strokeWidth={2} fill="url(#deliveredGrad)" />
                  <Area type="monotone" dataKey="مرتجعة" stroke="#EF4444" strokeWidth={2} fill="url(#returnedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3">
              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                مُسلَّمة
              </span>
              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full bg-error" />
                مرتجعة
              </span>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-border bg-surface p-5"
          >
            <h3 className="font-cairo text-base font-bold text-text-primary mb-4">أسباب التعثر</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FAILURE_REASONS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {FAILURE_REASONS_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-text-secondary">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Top Agents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-warning" />
            <h3 className="font-cairo text-base font-bold text-text-primary">أفضل المناديب أداءً</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>اسم المندوب</TableHead>
                <TableHead>عدد التوصيلات</TableHead>
                <TableHead>نسبة النجاح</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_AGENTS.map((agent) => (
                <TableRow key={agent.rank}>
                  <TableCell>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      agent.rank === 1
                        ? "bg-warning/20 text-warning"
                        : agent.rank === 2
                        ? "bg-text-muted/20 text-text-secondary"
                        : agent.rank === 3
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-2 text-text-muted"
                    }`}>
                      {agent.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-text-primary">{agent.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-inter text-sm text-text-primary">{agent.delivered}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 max-w-[120px] rounded-full bg-surface-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${agent.successRate}%` }}
                          className={`h-full rounded-full ${
                            agent.successRate >= 95 ? "bg-success" : agent.successRate >= 90 ? "bg-primary" : "bg-warning"
                          }`}
                          transition={{ duration: 1, delay: 0.5 + agent.rank * 0.1 }}
                        />
                      </div>
                      <span className="font-inter text-xs font-medium text-text-primary min-w-[3rem] text-left" dir="ltr">
                        {agent.successRate}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </PageTransition>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
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
        <p className="text-xs text-text-muted mt-0.5">{subtext}</p>
      </div>
    </motion.div>
  );
}

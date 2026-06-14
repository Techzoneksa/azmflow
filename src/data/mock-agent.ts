export interface AgentShipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  area: string;
  status: "قيد التوصيل" | "مكتملة" | "متعثرة";
  timeline: TimelineStep[];
  notes?: string;
}

export interface TimelineStep {
  label: string;
  time: string;
  active: boolean;
  completed: boolean;
  reason?: string;
}

export const AGENT = {
  name: "محمد القحطاني",
  id: "AG-042",
  phone: "0501234567",
};

export const AGENT_SHIPMENTS: AgentShipment[] = [
  {
    id: "SHP-1002",
    trackingNumber: "AZM-2024-002",
    customerName: "فاطمة الزهراني",
    customerPhone: "0559876543",
    customerAddress: "حي الشاطئ، جدة",
    area: "الشاطئ",
    status: "قيد التوصيل",
    timeline: [
      { label: "تم استلام الشحنة من المستودع", time: "08:30 ص", active: false, completed: true },
      { label: "خرجت للتوصيل", time: "09:15 ص", active: true, completed: true },
      { label: "تم التسليم", time: "--", active: true, completed: false },
    ],
  },
  {
    id: "SHP-1010",
    trackingNumber: "AZM-2024-010",
    customerName: "ياسر اليامي",
    customerPhone: "0554443322",
    customerAddress: "حي الرويس، جدة",
    area: "الرويس",
    status: "قيد التوصيل",
    timeline: [
      { label: "تم استلام الشحنة من المستودع", time: "08:45 ص", active: false, completed: true },
      { label: "خرجت للتوصيل", time: "09:30 ص", active: true, completed: true },
      { label: "تم التسليم", time: "--", active: true, completed: false },
    ],
  },
  {
    id: "SHP-1001",
    trackingNumber: "AZM-2024-001",
    customerName: "خالد الأحمد",
    customerPhone: "0501234567",
    customerAddress: "حي العليا، الرياض",
    area: "العليا",
    status: "مكتملة",
    timeline: [
      { label: "تم استلام الشحنة من المستودع", time: "07:00 ص", active: false, completed: true },
      { label: "خرجت للتوصيل", time: "07:30 ص", active: false, completed: true },
      { label: "تم التسليم", time: "10:30 ص", active: false, completed: true },
    ],
    notes: "تم التسليم للعميل مباشرة",
  },
  {
    id: "SHP-1009",
    trackingNumber: "AZM-2024-009",
    customerName: "لينا القاسم",
    customerPhone: "0501112233",
    customerAddress: "حي الملقا، الرياض",
    area: "الملقا",
    status: "مكتملة",
    timeline: [
      { label: "تم استلام الشحنة من المستودع", time: "07:15 ص", active: false, completed: true },
      { label: "خرجت للتوصيل", time: "08:00 ص", active: false, completed: true },
      { label: "تم التسليم", time: "12:00 م", active: false, completed: true },
    ],
  },
  {
    id: "SHP-1004",
    trackingNumber: "AZM-2024-004",
    customerName: "هند العتيبي",
    customerPhone: "0567890123",
    customerAddress: "حي العزيزية، مكة",
    area: "العزيزية",
    status: "متعثرة",
    timeline: [
      { label: "تم استلام الشحنة من المستودع", time: "08:00 ص", active: false, completed: true },
      { label: "خرجت للتوصيل", time: "08:45 ص", active: false, completed: true },
      { label: "تعذر التسليم", time: "10:00 ص", active: false, completed: true, reason: "العميل لا يرد" },
    ],
  },
];

export const FAILURE_REASONS = [
  "العميل لا يرد",
  "العميل رفض الاستلام",
  "العنوان خاطئ",
  "مؤجلة من قبل العميل",
];

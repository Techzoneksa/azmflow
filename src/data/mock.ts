export type ShipmentStatus =
  | "جديد"
  | "تم الاستلام من الشريك"
  | "جاهزة للتوزيع"
  | "مسندة إلى مندوب"
  | "خرجت للتوصيل"
  | "تم التسليم"
  | "تعذر التسليم"
  | "مرتجعة";

export interface DeliveryAttempt {
  id: string;
  time: string;
  agentName: string;
  reason?: string;
  success: boolean;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  partner: string;
  pickupPoint: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: ShipmentStatus;
  agentName?: string;
  deliveryAttempts: DeliveryAttempt[];
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
}

export const PARTNERS: Partner[] = [
  { id: "p1", name: "نون" },
  { id: "p2", name: "سلة" },
  { id: "p3", name: "جاهز" },
  { id: "p4", name: "مرسول" },
  { id: "p5", name: "مربي" },
];

export const SHIPMENTS: Shipment[] = [
  {
    id: "SHP-1001",
    trackingNumber: "AZM-2024-001",
    partner: "نون",
    pickupPoint: "مستودع نون - الرياض",
    customerName: "خالد الأحمد",
    customerPhone: "0501234567",
    customerAddress: "حي العليا، الرياض",
    status: "تم التسليم",
    agentName: "محمد القحطاني",
    deliveryAttempts: [
      { id: "a1", time: "2024-01-15 10:30", agentName: "محمد القحطاني", success: true },
    ],
    createdAt: "2024-01-14",
  },
  {
    id: "SHP-1002",
    trackingNumber: "AZM-2024-002",
    partner: "سلة",
    pickupPoint: "مستودع سلة - جدة",
    customerName: "فاطمة الزهراني",
    customerPhone: "0559876543",
    customerAddress: "حي الشاطئ، جدة",
    status: "خرجت للتوصيل",
    agentName: "أحمد الزهراني",
    deliveryAttempts: [
      { id: "a2", time: "2024-01-15 09:00", agentName: "أحمد الزهراني", success: false, reason: "العميل غير متواجد" },
    ],
    createdAt: "2024-01-13",
  },
  {
    id: "SHP-1003",
    trackingNumber: "AZM-2024-003",
    partner: "جاهز",
    pickupPoint: "مستودع جاهز - الدمام",
    customerName: "سعود الدوسري",
    customerPhone: "0534567890",
    customerAddress: "حي النهضة، الدمام",
    status: "مسندة إلى مندوب",
    agentName: "خالد الدوسري",
    deliveryAttempts: [],
    createdAt: "2024-01-12",
  },
  {
    id: "SHP-1004",
    trackingNumber: "AZM-2024-004",
    partner: "مرسول",
    pickupPoint: "مستودع مرسول - مكة",
    customerName: "هند العتيبي",
    customerPhone: "0567890123",
    customerAddress: "حي العزيزية، مكة",
    status: "تعذر التسليم",
    agentName: "سعد الحربي",
    deliveryAttempts: [
      { id: "a3", time: "2024-01-15 08:00", agentName: "سعد الحربي", success: false, reason: "عنوان خاطئ" },
      { id: "a4", time: "2024-01-15 14:00", agentName: "سعد الحربي", success: false, reason: "العميل طلب تأجيل" },
    ],
    createdAt: "2024-01-11",
  },
  {
    id: "SHP-1005",
    trackingNumber: "AZM-2024-005",
    partner: "مربي",
    pickupPoint: "مستودع مربي - الرياض",
    customerName: "نورة الشمراني",
    customerPhone: "0543210987",
    customerAddress: "حي السليمانية، الرياض",
    status: "مرتجعة",
    agentName: "فهد البقمي",
    deliveryAttempts: [
      { id: "a5", time: "2024-01-14 11:00", agentName: "فهد البقمي", success: false, reason: "العميل رفض الاستلام" },
      { id: "a6", time: "2024-01-14 16:00", agentName: "فهد البقمي", success: false, reason: "لم يتم الاتصال" },
    ],
    createdAt: "2024-01-10",
  },
  {
    id: "SHP-1006",
    trackingNumber: "AZM-2024-006",
    partner: "نون",
    pickupPoint: "مستودع نون - جدة",
    customerName: "عبدالله الغامدي",
    customerPhone: "0576543210",
    customerAddress: "حي الحمراء، جدة",
    status: "جديد",
    createdAt: "2024-01-15",
    deliveryAttempts: [],
  },
  {
    id: "SHP-1007",
    trackingNumber: "AZM-2024-007",
    partner: "سلة",
    pickupPoint: "مستودع سلة - الرياض",
    customerName: "منال الحربي",
    customerPhone: "0587654321",
    customerAddress: "حي النخيل، الرياض",
    status: "جاهزة للتوزيع",
    createdAt: "2024-01-15",
    deliveryAttempts: [],
  },
  {
    id: "SHP-1008",
    trackingNumber: "AZM-2024-008",
    partner: "جاهز",
    pickupPoint: "مستودع جاهز - الرياض",
    customerName: "تركي المطيري",
    customerPhone: "0598765432",
    customerAddress: "حي الملك فهد، الرياض",
    status: "تم الاستلام من الشريك",
    createdAt: "2024-01-14",
    deliveryAttempts: [],
  },
  {
    id: "SHP-1009",
    trackingNumber: "AZM-2024-009",
    partner: "مرسول",
    pickupPoint: "مستودع مرسول - الرياض",
    customerName: "لينا القاسم",
    customerPhone: "0501112233",
    customerAddress: "حي الملقا، الرياض",
    status: "تم التسليم",
    agentName: "محمد القحطاني",
    deliveryAttempts: [
      { id: "a7", time: "2024-01-15 12:00", agentName: "محمد القحطاني", success: true },
    ],
    createdAt: "2024-01-13",
  },
  {
    id: "SHP-1010",
    trackingNumber: "AZM-2024-010",
    partner: "مربي",
    pickupPoint: "مستودع مربي - جدة",
    customerName: "ياسر اليامي",
    customerPhone: "0554443322",
    customerAddress: "حي الرويس، جدة",
    status: "خرجت للتوصيل",
    agentName: "أحمد الزهراني",
    deliveryAttempts: [],
    createdAt: "2024-01-15",
  },
];

export const STATUSES: ShipmentStatus[] = [
  "جديد",
  "تم الاستلام من الشريك",
  "جاهزة للتوزيع",
  "مسندة إلى مندوب",
  "خرجت للتوصيل",
  "تم التسليم",
  "تعذر التسليم",
  "مرتجعة",
];

export const STATUS_COLORS: Record<ShipmentStatus, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  "جديد": "outline",
  "تم الاستلام من الشريك": "secondary",
  "جاهزة للتوزيع": "default",
  "مسندة إلى مندوب": "warning",
  "خرجت للتوصيل": "warning",
  "تم التسليم": "success",
  "تعذر التسليم": "destructive",
  "مرتجعة": "destructive",
};

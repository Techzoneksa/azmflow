export interface ReturnItem {
  id: string;
  trackingNumber: string;
  partner: string;
  agentName: string;
  reason: string;
  returnDate: string;
  status: "بانتظار الإجراء" | "تم التسليم للشريك";
}

export const RETURN_ITEMS: ReturnItem[] = [
  { id: "r1", trackingNumber: "AZM-2024-005", partner: "مربي", agentName: "فهد البقمي", reason: "العميل رفض الاستلام", returnDate: "2024-01-20", status: "بانتظار الإجراء" },
  { id: "r2", trackingNumber: "AZM-2024-011", partner: "نون", agentName: "محمد القحطاني", reason: "العميل لا يرد", returnDate: "2024-01-21", status: "بانتظار الإجراء" },
  { id: "r3", trackingNumber: "AZM-2024-012", partner: "سلة", agentName: "أحمد الزهراني", reason: "عنوان خاطئ", returnDate: "2024-01-22", status: "تم التسليم للشريك" },
  { id: "r4", trackingNumber: "AZM-2024-013", partner: "جاهز", agentName: "خالد الدوسري", reason: "مؤجلة من قبل العميل", returnDate: "2024-01-22", status: "تم التسليم للشريك" },
  { id: "r5", trackingNumber: "AZM-2024-014", partner: "مرسول", agentName: "سعد الحربي", reason: "العميل رفض الاستلام", returnDate: "2024-01-23", status: "بانتظار الإجراء" },
  { id: "r6", trackingNumber: "AZM-2024-015", partner: "نون", agentName: "فهد البقمي", reason: "العميل لا يرد", returnDate: "2024-01-24", status: "بانتظار الإجراء" },
  { id: "r7", trackingNumber: "AZM-2024-016", partner: "سلة", agentName: "أحمد الزهراني", reason: "عنوان خاطئ", returnDate: "2024-01-24", status: "تم التسليم للشريك" },
  { id: "r8", trackingNumber: "AZM-2024-017", partner: "مربي", agentName: "محمد القحطاني", reason: "العميل رفض الاستلام", returnDate: "2024-01-25", status: "بانتظار الإجراء" },
];

export const WEEKLY_DATA = [
  { day: "الأحد", مُسلَّمة: 142, مرتجعة: 18 },
  { day: "الإثنين", مُسلَّمة: 168, مرتجعة: 22 },
  { day: "الثلاثاء", مُسلَّمة: 195, مرتجعة: 15 },
  { day: "الأربعاء", مُسلَّمة: 210, مرتجعة: 25 },
  { day: "الخميس", مُسلَّمة: 178, مرتجعة: 20 },
];

export const FAILURE_REASONS_DATA = [
  { name: "العميل لا يرد", value: 45, color: "#EF4444" },
  { name: "رفض الاستلام", value: 30, color: "#F5A623" },
  { name: "عنوان خاطئ", value: 15, color: "#6C8EF5" },
  { name: "مؤجلة من قبل العميل", value: 10, color: "#9B6CF5" },
];

export const TOP_AGENTS = [
  { rank: 1, name: "محمد القحطاني", delivered: 156, successRate: 98.2 },
  { rank: 2, name: "أحمد الزهراني", delivered: 142, successRate: 95.8 },
  { rank: 3, name: "خالد الدوسري", delivered: 128, successRate: 94.1 },
  { rank: 4, name: "سعد الحربي", delivered: 97, successRate: 91.5 },
  { rank: 5, name: "فهد البقمي", delivered: 85, successRate: 89.3 },
];

export const KPI_REPORTS = {
  successRate: 88,
  totalShipments: 1240,
  avgDeliveryTime: 4.2,
};

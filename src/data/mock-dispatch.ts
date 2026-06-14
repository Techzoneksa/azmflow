export interface UnassignedShipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  district: string;
  partner: string;
  size: "صغير" | "متوسط" | "كبير";
}

export interface AvailableAgent {
  id: string;
  name: string;
  vehicle: string;
  currentLoad: number;
  maxLoad: number;
  status: "متاح" | "مشغول";
}

export const DISTRICTS = [
  "جميع المناطق",
  "العليا",
  "الشاطئ",
  "النهضة",
  "العزيزية",
  "السليمانية",
  "النخيل",
  "الحمراء",
  "الرويس",
  "الملك فهد",
  "الملقا",
];

export const UNASSIGNED_SHIPMENTS: UnassignedShipment[] = [
  { id: "SHP-2001", trackingNumber: "AZM-2024-201", customerName: "سارة الأحمدي", customerPhone: "0512345678", district: "العليا", partner: "نون", size: "صغير" },
  { id: "SHP-2002", trackingNumber: "AZM-2024-202", customerName: "عبدالعزيز السالم", customerPhone: "0523456789", district: "الشاطئ", partner: "سلة", size: "متوسط" },
  { id: "SHP-2003", trackingNumber: "AZM-2024-203", customerName: "نوف التميمي", customerPhone: "0534567890", district: "النهضة", partner: "جاهز", size: "كبير" },
  { id: "SHP-2004", trackingNumber: "AZM-2024-204", customerName: "مشاري الفريح", customerPhone: "0545678901", district: "العزيزية", partner: "مرسول", size: "متوسط" },
  { id: "SHP-2005", trackingNumber: "AZM-2024-205", customerName: "ريم الحربي", customerPhone: "0556789012", district: "السليمانية", partner: "مربي", size: "صغير" },
  { id: "SHP-2006", trackingNumber: "AZM-2024-206", customerName: "فيصل الدوسري", customerPhone: "0567890123", district: "النخيل", partner: "نون", size: "متوسط" },
  { id: "SHP-2007", trackingNumber: "AZM-2024-207", customerName: "هيا الزهراني", customerPhone: "0578901234", district: "الحمراء", partner: "سلة", size: "صغير" },
  { id: "SHP-2008", trackingNumber: "AZM-2024-208", customerName: "بندر القحطاني", customerPhone: "0589012345", district: "الرويس", partner: "جاهز", size: "كبير" },
  { id: "SHP-2009", trackingNumber: "AZM-2024-209", customerName: "أمل الشهراني", customerPhone: "0590123456", district: "الملك فهد", partner: "مرسول", size: "صغير" },
  { id: "SHP-2010", trackingNumber: "AZM-2024-210", customerName: "سعود الغامدي", customerPhone: "0501234567", district: "الملقا", partner: "مربي", size: "متوسط" },
];

export const AVAILABLE_AGENTS: AvailableAgent[] = [
  { id: "AG-101", name: "محمد القحطاني", vehicle: "شاحنة صغيرة", currentLoad: 5, maxLoad: 15, status: "متاح" },
  { id: "AG-102", name: "أحمد الزهراني", vehicle: "دراجة نارية", currentLoad: 3, maxLoad: 10, status: "متاح" },
  { id: "AG-103", name: "خالد الدوسري", vehicle: "شاحنة متوسطة", currentLoad: 8, maxLoad: 20, status: "متاح" },
  { id: "AG-104", name: "سعد الحربي", vehicle: "سيارة صغيرة", currentLoad: 2, maxLoad: 12, status: "متاح" },
  { id: "AG-105", name: "فهد البقمي", vehicle: "شاحنة كبيرة", currentLoad: 12, maxLoad: 25, status: "مشغول" },
  { id: "AG-106", name: "يوسف المطيري", vehicle: "دراجة نارية", currentLoad: 0, maxLoad: 10, status: "متاح" },
];

export const IMPORTED_ROWS = [
  { partner: "نون", customerName: "سارة الأحمدي", phone: "0512345678", district: "العليا", valid: true },
  { partner: "سلة", customerName: "عبدالعزيز السالم", phone: "", district: "الشاطئ", valid: false },
  { partner: "جاهز", customerName: "نوف التميمي", phone: "0534567890", district: "النهضة", valid: true },
  { partner: "مرسول", customerName: "مشاري الفريح", phone: "0545678901", district: "العزيزية", valid: true },
  { partner: "مربي", customerName: "ريم الحربي", phone: "", district: "السليمانية", valid: false },
  { partner: "نون", customerName: "فيصل الدوسري", phone: "0567890123", district: "النخيل", valid: true },
  { partner: "سلة", customerName: "هيا الزهراني", phone: "0578901234", district: "الحمراء", valid: true },
  { partner: "جاهز", customerName: "بندر القحطاني", phone: "", district: "الرويس", valid: false },
];

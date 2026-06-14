export interface MissingItem {
  id: string;
  text: string;
  urgency: "urgent" | "warning" | "info";
  category: string;
}

export interface OfficialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface Partner {
  id: string;
  name: string;
  activity: "متجر إلكتروني" | "شركة شحن";
  city: string;
  phone: string;
  contracts: number;
  pickupPoints: number;
  status: "نشط" | "موقوف" | "قيد التجهيز";
}

export const COMPLIANCE_SCORES = [
  { label: "التراخيص والامتثال", score: 100, color: "#22C55E" },
  { label: "جاهزية المناديب", score: 82, color: "#F5A623" },
  { label: "جاهزية المركبات", score: 90, color: "#6C8EF5" },
];

export const MISSING_ITEMS: MissingItem[] = [
  { id: "m1", text: "تأمين مركبة منتهٍ (أحمد خالد)", urgency: "urgent", category: "مركبات" },
  { id: "m2", text: "تحديث رخصة هيئة النقل للناقل الوطني", urgency: "urgent", category: "تراخيص" },
  { id: "m3", text: "عقد متجر نون يحتاج تجديد", urgency: "warning", category: "عقود" },
  { id: "m4", text: "فحص دوري للمركبة رقم 104 غير مكتمل", urgency: "warning", category: "مركبات" },
  { id: "m5", text: "بطاقة مندوب منتهية (سعد الحربي)", urgency: "warning", category: "مندوبين" },
  { id: "m6", text: "تسجيل شركة مربي في المنصة لم يكتمل", urgency: "info", category: "شركاء" },
  { id: "m7", text: "شهادة سلامة مبنى المستودع بحاجة لتجديد", urgency: "info", category: "مرافق" },
];

export const OFFICIAL_LINKS: OfficialLink[] = [
  { id: "l1", name: "بوابة الهيئة العامة للنقل", url: "#", icon: "Truck" },
  { id: "l2", name: "منصة وصل", url: "#", icon: "Globe" },
  { id: "l3", name: "أبشر أعمال", url: "#", icon: "Shield" },
  { id: "l4", name: "وزارة الموارد البشرية", url: "#", icon: "Building2" },
  { id: "l5", name: "منصة اعتماد", url: "#", icon: "FileCheck" },
  { id: "l6", name: "الهيئة العامة للمنشآت الصغيرة", url: "#", icon: "Briefcase" },
];

export const PARTNERS: Partner[] = [
  { id: "p1", name: "متجر نون", activity: "متجر إلكتروني", city: "الرياض", phone: "0112345678", contracts: 3, pickupPoints: 12, status: "نشط" },
  { id: "p2", name: "شركة سلة", activity: "متجر إلكتروني", city: "جدة", phone: "0123456789", contracts: 2, pickupPoints: 8, status: "نشط" },
  { id: "p3", name: "جاهز للتوصيل", activity: "شركة شحن", city: "الدمام", phone: "0134567890", contracts: 1, pickupPoints: 5, status: "قيد التجهيز" },
  { id: "p4", name: "مرسول السريع", activity: "شركة شحن", city: "مكة", phone: "0145678901", contracts: 2, pickupPoints: 6, status: "نشط" },
  { id: "p5", name: "مربي للتجارة", activity: "متجر إلكتروني", city: "الرياض", phone: "0156789012", contracts: 1, pickupPoints: 3, status: "موقوف" },
  { id: "p6", name: "متجر ليف", activity: "متجر إلكتروني", city: "جدة", phone: "0167890123", contracts: 1, pickupPoints: 4, status: "نشط" },
  { id: "p7", name: "شحن السريع", activity: "شركة شحن", city: "الرياض", phone: "0178901234", contracts: 2, pickupPoints: 7, status: "نشط" },
  { id: "p8", name: "متجر ورد", activity: "متجر إلكتروني", city: "الخبر", phone: "0189012345", contracts: 1, pickupPoints: 2, status: "قيد التجهيز" },
  { id: "p9", name: "تمرة للتسوق", activity: "متجر إلكتروني", city: "المدينة", phone: "0190123456", contracts: 2, pickupPoints: 5, status: "نشط" },
  { id: "p10", name: "بساط الرياح", activity: "شركة شحن", city: "جدة", phone: "0201234567", contracts: 1, pickupPoints: 3, status: "موقوف" },
  { id: "p11", name: "متجر شهد", activity: "متجر إلكتروني", city: "القصيم", phone: "0212345678", contracts: 1, pickupPoints: 2, status: "نشط" },
  { id: "p12", name: "نخيل التوصيل", activity: "شركة شحن", city: "الرياض", phone: "0223456789", contracts: 2, pickupPoints: 4, status: "نشط" },
];

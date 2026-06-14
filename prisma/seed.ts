import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("🌱 Seeding database...");

  const existingUser = await prisma.user.findUnique({ where: { username: "admin" } });
  if (existingUser) {
    console.log("⏭️  Database already seeded, skipping.");
    await prisma.$disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: { name: "مدير النظام", username: "admin", phone: "0500000000", password: hashedPassword, role: "SUPER_ADMIN", jobTitle: "مدير عام" },
  });
  console.log(`✅ Admin created: ${admin.name}`);

  const dispatcher = await prisma.user.create({
    data: { name: "منسق التوزيع", username: "coordinator", phone: "0500000001", password: hashedPassword, role: "DISPATCHER", jobTitle: "منسق توزيع" },
  });
  console.log(`✅ Dispatcher created: ${dispatcher.name}`);

  const partnersData = [
    { name: "نون", type: "ECOMMERCE" as const, city: "الرياض", phone: "0111111111" },
    { name: "سلة", type: "ECOMMERCE" as const, city: "جدة", phone: "0122222222" },
    { name: "جاهز", type: "LOGISTICS" as const, city: "الدمام", phone: "0133333333" },
  ];

  const partners = [];
  for (const p of partnersData) {
    const partner = await prisma.partner.create({ data: p });
    partners.push(partner);
    console.log(`✅ Partner created: ${partner.name}`);
  }

  const agentsData = [
    { name: "أحمد خالد", username: "ahmed", phone: "0511111111", role: "AGENT" as const },
    { name: "ياسر محمد", username: "yasser", phone: "0522222222", role: "AGENT" as const },
    { name: "محمد القحطاني", username: "mohammed", phone: "0533333333", role: "AGENT" as const },
    { name: "خالد الدوسري", username: "khaled", phone: "0544444444", role: "AGENT" as const },
    { name: "فيصل الزهراني", username: "faisal", phone: "0555555555", role: "AGENT" as const },
  ];

  const agents = [];
  for (const a of agentsData) {
    const agent = await prisma.user.create({
      data: { ...a, password: await bcrypt.hash("agent123", 12) },
    });
    agents.push(agent);
    console.log(`✅ Agent created: ${agent.name}`);
  }

  const shipmentsData = [
    { trackingNumber: "AZM-2024-001", partnerIdx: 0, agentIdx: 0, customerName: "خالد الأحمد", customerPhone: "0501234567", district: "العليا", status: "DELIVERED" as const },
    { trackingNumber: "AZM-2024-002", partnerIdx: 1, agentIdx: 1, customerName: "نورة السالم", customerPhone: "0512345678", district: "الشاطئ", status: "OUT_FOR_DELIVERY" as const },
    { trackingNumber: "AZM-2024-003", partnerIdx: 2, agentIdx: 2, customerName: "سعد الحربي", customerPhone: "0523456789", district: "النهضة", status: "ASSIGNED" as const },
    { trackingNumber: "AZM-2024-004", partnerIdx: 0, agentIdx: 3, customerName: "ريم التميمي", customerPhone: "0534567890", district: "العزيزية", status: "FAILED" as const },
    { trackingNumber: "AZM-2024-005", partnerIdx: 1, agentIdx: null, customerName: "فيصل الدوسري", customerPhone: "0545678901", district: "السليمانية", status: "READY" as const },
    { trackingNumber: "AZM-2024-006", partnerIdx: 2, agentIdx: null, customerName: "هيا الزهراني", customerPhone: "0556789012", district: "النخيل", status: "NEW" as const },
    { trackingNumber: "AZM-2024-007", partnerIdx: 0, agentIdx: 0, customerName: "بندر القحطاني", customerPhone: "0567890123", district: "الحمراء", status: "DELIVERED" as const },
    { trackingNumber: "AZM-2024-008", partnerIdx: 1, agentIdx: 4, customerName: "أمل الشهراني", customerPhone: "0578901234", district: "الرويس", status: "OUT_FOR_DELIVERY" as const },
    { trackingNumber: "AZM-2024-009", partnerIdx: 2, agentIdx: 2, customerName: "مشاري الفريح", customerPhone: "0589012345", district: "الملك فهد", status: "RETURNED" as const },
    { trackingNumber: "AZM-2024-010", partnerIdx: 0, agentIdx: null, customerName: "سارة الأحمدي", customerPhone: "0590123456", district: "الملقا", status: "NEW" as const },
  ];

  for (const s of shipmentsData) {
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: s.trackingNumber,
        partnerId: partners[s.partnerIdx].id,
        agentId: s.agentIdx !== null ? agents[s.agentIdx].id : null,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
        district: s.district,
        status: s.status,
      },
    });
    console.log(`✅ Shipment created: ${shipment.trackingNumber} [${shipment.status}]`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("📋 Admin login: admin / password123");
  console.log("📋 Agent logins: ahmed / agent123, yasser / agent123, etc.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

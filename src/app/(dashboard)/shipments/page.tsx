import { getPrisma } from "@/lib/prisma";
import ShipmentsClient from "./ShipmentsClient";

export const dynamic = "force-dynamic";

export default async function ShipmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let shipments: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let partners: any[] = [];

  try {
    const prisma = getPrisma();
    shipments = await prisma.shipment.findMany({
      include: { partner: true, agent: true, deliveryAttempts: true },
      orderBy: { createdAt: "desc" },
    });

    partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.warn("[shipments] DB unavailable:", err instanceof Error ? err.message : err);
  }

  const serialized = shipments.map((s) => ({
    id: s.id,
    trackingNumber: s.trackingNumber,
    partner: s.partner.name,
    partnerId: s.partnerId,
    pickupPoint: `${s.partner.city} - ${s.partner.name}`,
    customerName: s.customerName,
    customerPhone: s.customerPhone,
    district: s.district,
    status: s.status,
    agentName: s.agent?.name ?? null,
    agentId: s.agentId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deliveryAttempts: s.deliveryAttempts.map((a: any) => ({
      id: a.id,
      time: a.attemptDate.toISOString(),
      agentName: s.agent?.name ?? "",
      reason: a.failureReason,
      success: a.failureReason === null,
    })),
    createdAt: s.createdAt.toISOString(),
  }));

  const partnerNames = partners.map((p) => p.name);

  return <ShipmentsClient shipments={serialized} partners={partnerNames} />;
}

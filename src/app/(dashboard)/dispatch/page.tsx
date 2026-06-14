import { getPrisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import DispatchClient from "./DispatchClient";

export const dynamic = "force-dynamic";

type ShipmentWithPartner = Prisma.ShipmentGetPayload<{
  include: { partner: true };
}>;

export default async function DispatchPage() {
  let unassigned: ShipmentWithPartner[] = [];
  let agents: { id: string; name: string }[] = [];

  try {
    const prisma = getPrisma();
    unassigned = await prisma.shipment.findMany({
      where: { status: { in: ["NEW", "READY"] }, agentId: null },
      include: { partner: true },
      orderBy: { createdAt: "desc" },
    });

    agents = await prisma.user.findMany({
      where: { role: "AGENT", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  } catch (err) {
    console.warn("[dispatch] DB unavailable:", err instanceof Error ? err.message : err);
  }

  const districts = Array.from(new Set(unassigned.map((s) => s.district))).sort();

  const serializedShipments = unassigned.map((s) => ({
    id: s.id,
    trackingNumber: s.trackingNumber,
    customerName: s.customerName,
    customerPhone: s.customerPhone,
    district: s.district,
    partner: s.partner.name,
  }));

  const serializedAgents = agents.map((a) => ({
    id: a.id,
    name: a.name,
  }));

  return (
    <DispatchClient
      shipments={serializedShipments}
      agents={serializedAgents}
      districts={districts}
    />
  );
}

import { prisma } from "@/lib/prisma";
import DispatchClient from "./DispatchClient";

export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const unassigned = await prisma.shipment.findMany({
    where: { status: { in: ["NEW", "READY"] }, agentId: null },
    include: { partner: true },
    orderBy: { createdAt: "desc" },
  });

  const agents = await prisma.user.findMany({
    where: { role: "AGENT", isActive: true },
    orderBy: { name: "asc" },
  });

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

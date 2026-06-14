"use server";

import { getPrisma } from "@/lib/prisma";

export async function getAllShipments() {
  const prisma = getPrisma();
  const shipments = await prisma.shipment.findMany({
    include: {
      partner: true,
      agent: true,
      deliveryAttempts: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return shipments;
}

export async function getShipmentById(id: string) {
  const prisma = getPrisma();
  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      partner: true,
      agent: true,
      deliveryAttempts: {
        include: { agent: true },
        orderBy: { attemptDate: "desc" },
      },
    },
  });

  return shipment;
}

export async function assignShipments(shipmentIds: string[], agentId: string) {
  const prisma = getPrisma();
  await prisma.shipment.updateMany({
    where: { id: { in: shipmentIds } },
    data: { agentId, status: "ASSIGNED" },
  });
}

export async function getShipmentsByAgent(agentId: string) {
  const prisma = getPrisma();
  const shipments = await prisma.shipment.findMany({
    where: { agentId },
    include: {
      partner: true,
      deliveryAttempts: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return shipments;
}

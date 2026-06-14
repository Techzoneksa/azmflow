"use server";

import { prisma } from "@/lib/prisma";

export async function getAllShipments() {
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
  await prisma.shipment.updateMany({
    where: { id: { in: shipmentIds } },
    data: { agentId, status: "ASSIGNED" },
  });
}

export async function getShipmentsByAgent(agentId: string) {
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

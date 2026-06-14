"use server";

import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type UserSelect = Prisma.UserGetPayload<{
  select: { id: true; name: true; username: true; phone: true; role: true; jobTitle: true; isActive: true; createdAt: true };
}>;

export async function getAllUsers(): Promise<UserSelect[]> {
  const prisma = getPrisma();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, username: true, phone: true, role: true, jobTitle: true, isActive: true, createdAt: true },
  });
}

export async function getUserById(id: string): Promise<UserSelect | null> {
  const prisma = getPrisma();
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, username: true, phone: true, role: true, jobTitle: true, isActive: true, createdAt: true },
  });
}

export async function createUser(data: {
  name: string;
  username: string;
  phone: string;
  password: string;
  role: string;
  jobTitle?: string;
}): Promise<UserSelect> {
  const prisma = getPrisma();
  const hashedPassword = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      phone: data.phone,
      password: hashedPassword,
      role: data.role as Prisma.UserCreateInput["role"],
      jobTitle: data.jobTitle ?? "",
    },
    select: { id: true, name: true, username: true, phone: true, role: true, jobTitle: true, isActive: true, createdAt: true },
  });
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    username?: string;
    phone?: string;
    password?: string;
    role?: string;
    jobTitle?: string;
    isActive?: boolean;
  }
): Promise<UserSelect> {
  const prisma = getPrisma();
  const updateData: Prisma.UserUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.username !== undefined) updateData.username = data.username;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }
  if (data.role) {
    updateData.role = data.role as Prisma.UserUpdateInput["role"];
  }
  return prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, username: true, phone: true, role: true, jobTitle: true, isActive: true, createdAt: true },
  });
}

export async function deleteUser(id: string): Promise<void> {
  const prisma = getPrisma();
  await prisma.user.delete({ where: { id } });
}

export async function toggleUserStatus(id: string, isActive: boolean): Promise<{ id: string; isActive: boolean }> {
  const prisma = getPrisma();
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true, isActive: true },
  });
}

"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function login(username: string, password: string) {
  try {
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash("password123", 12);
      await prisma.user.create({
        data: {
          name: "مدير النظام",
          username: "admin",
          phone: "0500000000",
          password: hashedPassword,
          role: "ADMIN",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

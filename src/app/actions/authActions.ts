"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "يرجى إدخال اسم المستخدم وكلمة المرور" };
  }

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

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return { error: "بيانات الدخول غير صحيحة" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { error: "بيانات الدخول غير صحيحة" };

  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session?.value) return null;
  try {
    return JSON.parse(session.value) as { id: string; name: string; role: string };
  } catch {
    return null;
  }
}

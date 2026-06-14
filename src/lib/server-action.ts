export async function safeAction<T>(
  action: () => Promise<T>
): Promise<{ data?: T; error?: string; stale?: boolean }> {
  try {
    const data = await action();
    return { data };
  } catch (err: unknown) {
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    const msg =
      err instanceof Error ? err.message : "حدث خطأ غير متوقع";

    if (
      msg.includes("Failed to find Server Action") ||
      msg.includes("Server Actions") ||
      msg.includes("actions/")
    ) {
      return { error: "انتهت صلاحية الجلسة. يُرجى تحديث الصفحة.", stale: true };
    }

    return { error: msg };
  }
}

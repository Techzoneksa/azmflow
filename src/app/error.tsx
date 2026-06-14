"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isActionError =
    error.message?.includes("Server Action") ||
    error.message?.includes("Failed to find Server Action") ||
    error.message?.includes("actions") ||
    error.digest?.startsWith("28");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <span className="text-3xl">!</span>
        </div>
        <h1 className="mb-2 text-xl font-bold text-text-primary">
          {isActionError ? "انتهت صلاحية الجلسة" : "حدث خطأ"}
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          {isActionError
            ? "تم تحديث النظام. يُرجى تحديث الصفحة للمتابعة."
            : "عذراً، حدث خطأ غير متوقع."}
        </p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="px-6"
          >
            تحديث الصفحة
          </Button>
          {!isActionError && (
            <Button
              variant="outline"
              onClick={() => reset()}
              className="px-6"
            >
              إعادة المحاولة
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

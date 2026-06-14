"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isActionError =
    error.message?.includes("Server Action") ||
    error.message?.includes("Failed to find Server Action") ||
    error.digest?.startsWith("28");

  return (
    <html dir="rtl">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            background: "#0A0B0F",
            color: "#fff",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "400px",
              padding: "32px",
              borderRadius: "16px",
              background: "#111318",
              border: "1px solid #1E2028",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "20px", marginBottom: "8px" }}>
              {isActionError ? "انتهت صلاحية الجلسة" : "حدث خطأ"}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#8B8E9E",
                marginBottom: "24px",
              }}
            >
              {isActionError
                ? "تم تحديث النظام. يُرجى تحديث الصفحة للمتابعة."
                : "عذراً، حدث خطأ غير متوقع."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                background: "#6C8EF5",
                color: "#fff",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isServerAction =
    request.method === "POST" && url.pathname.startsWith("/");

  if (isServerAction) {
    const response = NextResponse.next();
    response.headers.set("x-action-epoch", String(Date.now()));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

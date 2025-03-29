import { NextRequest, NextResponse, userAgent } from "next/server";
import { getSession } from "@/lib/auth/session";
import { hasAccess } from "@/config/rolePermissions";
// Define role-to-route access mappings

const publicRoutes = [
  "/login",
  "/services",
  "/captain",
  "/customers",
  "/bookings",
  "/dashboard",
  "/settings",
];

// Middleware logic
interface Session {
  user?: {
    role?: string;
  };
}

interface Device {
  type?: string;
}

export default async function middleware(
  request: NextRequest,
): Promise<NextResponse> {
  const path: string = request.nextUrl.pathname;
  const { device }: { device: Device } = userAgent(request);

  const session: Session | null = await getSession();

  // if (!session) return NextResponse.redirect(new URL("/login", request.nextUrl));

  const isPublicRoute: boolean = publicRoutes.includes(path);
  const role: string | undefined = session?.user?.role;

  // Check if the user is on a public route
  if (isPublicRoute) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    return NextResponse.next();
  }

  // Check access for protected routes
  if (session?.user) {
    console.log("User has access to route", path);
    if (role && hasAccess(role, path)) {
      // Set custom headers for additional context
      request.headers.set("x-device-type", device.type || "desktop");
      request.headers.set("x-user-role", role);
      return NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
    } else {
      return NextResponse.redirect(new URL("/unauthorized", request.nextUrl));
    }
  }

  // Redirect unauthenticated users to login with next parameter
  return NextResponse.redirect(new URL(`/login?next=${path}`, request.nextUrl));
}

// Config to exclude specific paths from middleware
export const config = {
  matcher: [
    /*
      Exclude API routes, Next.js static files, public images,
      and files with common static extensions.
    */
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp|gif|css|js|woff|woff2|ttf|eot|otf|json|map|wav)$).*)",
  ],
};

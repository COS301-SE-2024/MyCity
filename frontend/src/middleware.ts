import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });

  //dashboard routes
  const isOnCitizenDashboard = request.nextUrl.pathname.startsWith("/dashboard/citizen");
  const isOnMunicipalityDashboard = request.nextUrl.pathname.startsWith("/dashboard/municipality");
  const isOnServiceProviderDashboard = request.nextUrl.pathname.startsWith("/dashboard/service-provider");

  const isOnCreateTicket = request.nextUrl.pathname.startsWith("/create-ticket");



//   if



//   if (isOnDashboard) {
//     if (!user)
//       return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
//     if (isOnAdminArea && !user.isAdmin)
//       return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
//     return response;
//   } else if (user) {
//     return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
//   }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
import { type NextRequest, NextResponse } from "next/server";
import { authenticate } from "./utils/amplifyServerUtils";

const SUFFIX_COOKIE_NAME = "mycity.net.za.userpathsuffix";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();
  const isAuthenticated = await authenticate({ request, response });


  const isOn = (url: string) => path === url;
  const startsWith = (url: string) => path.startsWith(url);


  //1. IF USER IS LOGGED IN
  if (isAuthenticated) {

    //1.1) and is trying to navigate to dashboard/profile/settings, redirect them to the appropriate page according to their user type
    if (isOn("/dashboard") || isOn("/profile") || isOn("/settings")) {
      const cookie = request.cookies.get(SUFFIX_COOKIE_NAME);
      let userPathSuffix: string = "";

      if (cookie) {
        userPathSuffix = cookie.value;
        return NextResponse.redirect(new URL(`${request.nextUrl.pathname}/${userPathSuffix}`, request.nextUrl));
      }
      else {
        //in the event that user path suffix cookie is null for some reason, redirect to home page for now
        return NextResponse.redirect(new URL("/", request.nextUrl));
        //should later redirect to some other page or log user out and ask them to relogin
      }

    }

    //1.2) and tries to access any of the auth routes, redirect them to homepage
    else if (startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

  }

  //2. IF USER IS NOT LOGGED IN
  else {

    //2.1) and tries to access dashboard/profile/settings, redirect them to login page
    if (startsWith("/dashboard") || startsWith("/profile") || startsWith("/settings")) {
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    }

  }



  return response;

}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
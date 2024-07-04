import { type NextRequest, NextResponse } from 'next/server';
import { authenticate } from './utils/amplifyServerUtils';
import { USER_PATH_SUFFIX_COOKIE_NAME } from './types/custom.types';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();
  const isAuthenticated = await authenticate({ request, response });

  const isOn = (url: string) => path === url;
  const startsWith = (url: string) => path.startsWith(url);

  //bypass middleware if not in production environment
  if (process.env.NODE_ENV != "production") {
    if (isOn("/dashboard") || isOn("/profile") || isOn("/settings")) {
      const cookie = request.cookies.get(USER_PATH_SUFFIX_COOKIE_NAME);
      let userPathSuffix: string = "";

      if (cookie) {
        userPathSuffix = cookie.value;
        return NextResponse.redirect(new URL(`${request.nextUrl.pathname}/${userPathSuffix}`, request.nextUrl));
      }
    }

    return response;

  }



  //1. IF USER IS LOGGED IN
  if (isAuthenticated) {

    //1.1) and is trying to navigate to dashboard/profile/settings, redirect them to the appropriate page according to their user type
    if (isOn("/dashboard") || isOn("/profile") || isOn("/settings")) {
      const cookie = request.cookies.get(USER_PATH_SUFFIX_COOKIE_NAME);
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

    // if (isOn("/dashboard")) {
    //   return NextResponse.redirect(new URL("/dashboard/guest", request.nextUrl));
    // }

    //2.2) and tries to access user dashboard/profile/settings, redirect them to login page
    if (isOn("/dashboard/citizen") || isOn("/dashboard/municipality") || startsWith("/profile") || startsWith("/settings")) {
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

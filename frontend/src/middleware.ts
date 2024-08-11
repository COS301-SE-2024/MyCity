import { type NextRequest, NextResponse } from 'next/server';
import { authenticate } from './utils/amplifyServerUtils';
import { USER_PATH_SUFFIX_COOKIE_NAME } from './types/custom.types';
import { handleSignOut } from './services/auth.service';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();
  const isAuthenticated = await authenticate({ request, response });

  const pathIs = (url: string) => path === url;
  const pathStartsWith = (url: string) => path.startsWith(url);
  const pathEndsWith = (url: string) => path.endsWith(url);

  //bypass middleware if not in production environment
  if (process.env.NODE_ENV != "production") {
    return response;
  }

  //---- IF USER IS LOGGED IN ------
  if (isAuthenticated) {
    const cookie = request.cookies.get(USER_PATH_SUFFIX_COOKIE_NAME);
    let userPathSuffix: string = "";

    if (!cookie) {
      //in the event that user path suffix cookie is null for some reason,
      //display message saying token expired, log the user out and redirect to login page
      handleSignOut();
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    }

    userPathSuffix = cookie.value;

    //RULE 1: and tries to access any of the auth routes,
    if (pathStartsWith("/auth")) {
      //redirect to dashboard
      return NextResponse.redirect(new URL(`/dashboard/${userPathSuffix}`, request.nextUrl));
    }

    //RULE 2: and tries to access an unauthorised page of another user type,
    if (!pathEndsWith(userPathSuffix)) {
      //redirect them to their own equivalent of the page
      const lastSeparator = path.lastIndexOf("/");
      const pathPrefix = path.substring(0, lastSeparator);
      const nextPath = `${pathPrefix}/${userPathSuffix}`;
      return NextResponse.redirect(new URL(nextPath, request.nextUrl));
    }

  }

  //---- IF USER IS NOT LOGGED IN ------
  else {

    //RULE 3: and is trying to access a page that is neither their home, dashboardd, about nor login/signup pages,
    if (!pathStartsWith("/auth") && !pathIs("/") && !pathIs("/dashboard/guest") && !pathIs("/about/guest")) {
      //redirect to guest dashboard
      return NextResponse.redirect(new URL("/dashboard/guest", request.nextUrl));
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

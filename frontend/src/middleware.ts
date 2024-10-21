import { type NextRequest, NextResponse } from "next/server";
import { authenticate } from "./utils/amplify-server.utils";
import { USER_PATH_SUFFIX_COOKIE_NAME } from "./types/custom.types";
import { handleSignOut } from "./services/auth.service";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const response = NextResponse.next();
    const isAuthenticated = await authenticate({ request, response });

    const pathIs = (url: string) => path === url;
    const pathStartsWith = (url: string) => path.startsWith(url);
    const pathEndsWith = (url: string) => path.endsWith(url);

    // bypass middleware if not in production environment
    if (process.env.NODE_ENV != "production") {
        return response;
    }

    //---- IF USER IS AUTHENTICATED ------
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

        //RULE 1: and tries to access guest home page or any of the auth routes,
        if (pathIs("/") || pathStartsWith("/auth")) {
            //redirect to their home page (dashboard)
            return NextResponse.redirect(new URL(`/dashboard/${userPathSuffix}`, request.nextUrl));
        }

        //RULE 2: and tries to access an unauthorised page of another user type (with the exception of the home page),
        if (!pathEndsWith(userPathSuffix)) {
            //redirect them to their own equivalent of the page
            const lastSeparator = path.lastIndexOf("/");
            const pathPrefix = path.substring(0, lastSeparator);
            const nextPath = `${pathPrefix}/${userPathSuffix}`;
            return NextResponse.redirect(new URL(nextPath, request.nextUrl));
        }
    }

    //---- IF SESSION HAS EXPIRED ------
    else if (request.cookies.get(USER_PATH_SUFFIX_COOKIE_NAME)) {
        // force sign out and clear cookies
        handleSignOut();
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    //---- IF USER IS NOT AUTHENTICATED ------
    else {
        // RULE 1: and is trying to access a page that is neither their home, dashboard, about nor login/signup pages,
        if (
            !pathIs("/dashboard/guest") &&
            !pathStartsWith("/guide") && // Allow access to /guide even if the user isn't logged in
            (pathStartsWith("/dashboard") ||
                pathStartsWith("/settings") ||
                pathStartsWith("/create-ticket") ||
                pathStartsWith("/notifications") ||
                pathStartsWith("/search") ||
                pathStartsWith("/tenders") ||
                pathStartsWith("/giveaway"))
        ) {
            return NextResponse.redirect(new URL("/dashboard/guest", request.nextUrl));
        }
    }

    return response;
}

export const config = {
    /*
         * Match all request paths except for:
         * - API routes
         * - Next.js internal routes (_next/static, _next/image)
         * - Public assets like PNGs, service worker, manifest, etc.
         */
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|gif|ico|webp|svg|css|js)$|service-worker\\.js$|manifest\\.json$|favicon\\.ico$|offline\\.html$).*)",
    ],
    
};

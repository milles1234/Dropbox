import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



const isPublicRoute = createRouteMatcher(["/", "sign-in(.*)", "sign-up(.*)"])

export default clerkMiddleware(async (auth,request) => {
    const user = auth()
    const user_id = (await user).userId;
    const url = new URL(request.url);

    if (user_id && isPublicRoute(request) && url.pathname === "/"){
        return NextResponse.redirect(new URL("/dashbord", request.url));
    }
    // protect non_public routes
    if(!isPublicRoute(request)){
        await auth.protect();
    }

});

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with _next, api, and static
    createRouteMatcher("/((?!_next|api|static|.*\\..*).*)"),
    "/(api|trpc)(.*)",
  ],
}

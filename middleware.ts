import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Hadu homa les pages li ay wa7d y-qdr y-choufhom (Public)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)' // Darouri bach l-API ma t-crashich
]);

export default clerkMiddleware(async (auth, req) => {
  // Ila ma kantch page public, 7miha (Protect)
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return Response.redirect("/sign-in");
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
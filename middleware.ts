import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Ila l-page MACHI public, n-vérifiw
  if (!isPublicRoute(req)) {
    // 1. Jib l-userId (b await 7it hiya Promise)
    const { userId, redirectToSignIn } = await auth();

    // 2. Ila ma kanch l-user m-connecté
    if (!userId) {
      // Rddo l page dyal Sign In (Hadi kat-khdm f Vercel w Local)
      return redirectToSignIn();
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
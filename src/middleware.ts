import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isNotProtected = createRouteMatcher(['/api/discord-bot', '/api/cron']);


export default clerkMiddleware(
	async (auth, req) => {
        if (isNotProtected(req)) {
            return;
        }
		await auth.protect();
	},
	// { debug: true },
);

export const config = {
	matcher: [
		// Skip Next.js internals
		"/((?!_next/static|_next/image|favicon.ico).*)",

		// Match all API routes (this will NOT include discord-bot due to the exclusion above)
		"/api/(.*)",
	],
};

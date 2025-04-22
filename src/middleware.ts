import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDiscordRoute = createRouteMatcher(['/api/discord-bot']);


export default clerkMiddleware(
	async (auth, req) => {
        if (isDiscordRoute(req)) {
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

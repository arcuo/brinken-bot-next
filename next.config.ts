import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ["*.ngrok-free.app"],
	experimental: {
		nodeMiddleware: true,
	},
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ["*.ngrok-free.app"],
	experimental: {
		nodeMiddleware: true,
	},
	// webpack: (config) => {
	// 	config.externals = config.externals || {};
	// 	config.externals["zlib-sync"] = "zlib-sync";

	// 	// Add node-loader for .node files
	// 	config.module.rules.push({
	// 		test: /\.node$/,
	// 		use: "node-loader",
	// 	});

	// 	return config;
	// },
};

export default nextConfig;

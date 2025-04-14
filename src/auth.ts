import type { NextRequest } from "next/server";
import nacl from "tweetnacl";

export async function auth(request: NextRequest): Promise<
	| {
			valid: false;
			body: null;
	  }
	| { valid: true; body: any }
> {
	const signature = request.headers.get("X-Signature-Ed25519")!;
	const timestamp = request.headers.get("X-Signature-Timestamp")!;

	if (!signature || !timestamp) {
		return { valid: false, body: null };
	}

	const body = await request.text();
	const valid = nacl.sign.detached.verify(
		new TextEncoder().encode(timestamp + body),
		hexToUint8Array(signature),
		hexToUint8Array(process.env.DISCORD_PUBLIC_KEY!),
	);

	return { valid, body: JSON.parse(body) };
}

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
	return new Uint8Array(
		hex.match(/.{1,2}/g)!.map((val) => Number.parseInt(val, 16)),
	);
}

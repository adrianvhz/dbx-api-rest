export function encodeBasicAuth(key: string, secret: string) {
	const b64auth = Buffer.from(key + ":" + secret).toString("base64");
	return `Basic ${b64auth}`;
}

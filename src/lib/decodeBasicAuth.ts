export function decodeBasicAuth(basicAuthStr: string) {
	const b64auth = basicAuthStr.slice(6);
	const [client_key, client_secret] = Buffer.from(b64auth, "base64").toString().split(":");
	return {
		client_key,
		client_secret
	}
}

import * as crypto from "crypto";

export function generateSecureRandomKey(size: number): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(size, (err, buffer) => {
			if (err) reject(err)
			resolve(buffer.toString("hex"));
		});
	})
}

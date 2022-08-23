import { DropboxAuth } from "dropbox";
import fetch from "node-fetch";

export async function getDropboxOAuth2Url(clientId: string, redirectUriForRegister: string): Promise<string> {
	return await new DropboxAuth({
		clientId,
		fetch
	}).getAuthenticationUrl(
		redirectUriForRegister,
		null,
		"code",
		"offline",
		null,
		"none",
		false
	) as string;
}

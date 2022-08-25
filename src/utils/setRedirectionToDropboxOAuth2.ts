import { getDropboxOAuth2Url } from "src/lib/getDropboxOAuth2Url";

export async function setRedirectionToDropboxOAuth2({ req, res, clientId, action }) {
	var date = new Date();
	date.setMinutes(date.getMinutes() + 5);
	res.cookie("action", action, { httpOnly: true, expires: date });
	res.cookie("redirect_to", req.body.domain, { httpOnly: true, expires: date })
	return res.redirect(await getDropboxOAuth2Url(clientId, `${req.protocol}://${req.get("host")}/auth/register`));
}

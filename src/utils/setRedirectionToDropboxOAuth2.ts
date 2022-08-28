import { getDropboxOAuth2Url } from "src/lib/getDropboxOAuth2Url";

export async function setRedirectionToDropboxOAuth2({ req, res, clientId, action }) {
	var date = new Date();
	date.setMinutes(date.getMinutes() + 5);
	var body = {
		username: req.body.user,
		action: action,
		redirect_to: req.body.domain
	}

	res.cookie("body", JSON.stringify(body), { httpOnly: true, expires: date });
	return res.redirect(await getDropboxOAuth2Url(clientId, `${req.protocol}://${req.get("host")}/auth/register`));
}

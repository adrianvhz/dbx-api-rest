export function disableFavicon(req, res, next) {
	if (req.originalUrl.includes("favicon.ico")) {
		res.status(204).end();
	}
	else {
		next();
	}
}

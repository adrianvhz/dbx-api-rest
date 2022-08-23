export function expiresToken() {
	var date = new Date();
	date.setHours(date.getHours() + 4);
	return date;
}

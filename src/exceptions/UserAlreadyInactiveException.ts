import { HttpException } from "@nestjs/common";

export class AccountAlreadyInactive extends HttpException {
	constructor(response: string | Record<string, any> = "The user's account has already been unlinked and is listed as 'inactive' in the db.") {
		super(response, 418); // I'm a teapot
	}
}

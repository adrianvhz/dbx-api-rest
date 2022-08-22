import { HttpException } from "@nestjs/common";

export class LinkAccountException extends HttpException {
	constructor(error: string | Record<string, any>) {
		super({
			statusCode: 400,
			message: "Bad Request",
			error,
			error_type: "Missing Fields"
		}, 400);
	}
}

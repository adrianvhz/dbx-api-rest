import { HttpException } from "@nestjs/common";

export class LinkAccountException extends HttpException {
	constructor(error: string | Record<string, any>) {
		super({
			statusCode: 400,
			name: LinkAccountException.name,
			error,
			error_type: "Missing Fields",
			timestamp: new Date().toISOString()
		}, 400);
	}
}

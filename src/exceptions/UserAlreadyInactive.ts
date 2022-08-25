import { HttpException } from "@nestjs/common";

export class UserAlreadyInactiveException extends HttpException {
   constructor() {
      super({
			statusCode: 409,
			name: UserAlreadyInactiveException.name,
			error: "The user is already in inactive status.",
			timestamp: new Date().toISOString()
		}, 409);
   }
}

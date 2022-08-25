import { HttpException } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
   constructor() {
      super({
			statusCode: 409,
			name: UserAlreadyExistsException.name,
			error: "The user or client_key already exists in the database.",
			timestamp: new Date().toISOString()
		}, 409);
   }
}

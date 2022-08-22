import { JwtService } from "@nestjs/jwt";
import { HttpException, NotFoundException } from "@nestjs/common";

export function jwtErrorMiddleware(error: Error, token: string, user: string) {
	if (error.message === "missing tk") {
		throw new HttpException("Missing token!", 400)
	}
	else if (error.message === "invalid token") {
		throw new HttpException("Invalid token!", 400)
	}
	else if (error.name === "SyntaxError") {
		throw new HttpException("Corrupt token. Payload is not a valid JSON object.", 400)
	}
	else if (error.message === "invalid signature") {
		let originalPayload = new JwtService().decode(token);
		throw new HttpException({ statusCode: 401, error: "Invalid signature or token doesn't match provided user!", desc: { opt1: "Invalid signature.", opt2: `Token belongs to the user: '${originalPayload["user"]}' and the '${user}' user has been provided.` } }, 401);
	}
	else if (error.message === "jwt malformed") {
		throw new HttpException("Malformed token!", 400);
	}
	else if ((error as any).response.error.startsWith("User couldn't")) {
		throw new NotFoundException("Not Found", "User couldn't be found in the database!");
	}
	else {
		throw new HttpException(error.message, 600)
	}
}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { Strategy } from "passport-custom";
import { UsersService } from "src/modules/users/users.service";
import { jwtErrorMiddleware } from "src/middlewares";
import { UserDoc } from "src/modules/users/schemas/user.schema";
import type { Request } from "express";

@Injectable()
export class JwtCustomStrategy extends PassportStrategy(Strategy, "jwt-custom")
{
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService
	) {
		super();
	}

	async validate(req: Request): Promise<UserDoc> | never {
		try {
			var token = req.headers.authorization && req.headers.authorization.slice(7);
			if (!token) throw new Error("missing tk");

			/* -START- only for api swagger */
			if (req.params.user === "," || req.params.user === "{user}") {
				var originalPayload = new JwtService().decode(token);
				var user = await this.usersService.findOne(originalPayload["user"]);
				return user;
			}
			/* -END- only for api swagger */

			var user = await this.usersService.findOne(req.params.user);
			this.jwtService.verify(token, { secret: user.client_secret }); // pass or error
			return user;
		}
		catch (err) {
			/**
			 * when the try fails, the error is caught by passport's error handler in the
			 * dropbox-auth.middleware and then next(err) is called there so errors are
			 * handled by this catch.
			 */
			jwtErrorMiddleware(err, token, req.params.user);
		}
	}
}

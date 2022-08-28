import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../modules/auth/auth.service";
import type { Request } from "express"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
	constructor(private authService: AuthService) {
		super({
		usernameField: "user",
		passwordField: "user",
		passReqToCallback: true,
		session: false,
		});
	}

	async validate(req: Request, usernameField: string): Promise<any> {
		req.username = usernameField;
		// Return the user data or "null". Saved to req.user
		return await this.authService.validateUser(usernameField);
	}
}

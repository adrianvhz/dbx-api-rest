import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../modules/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
	constructor(private authService: AuthService) {
		super({
		usernameField: "user",
		passwordField: "user",
		session: false,
		// passReqToCallback: true
		});
	}

	async validate(usernameField: string): Promise<any> {
		// Return the user data or "null". Saved to req.user
		return await this.authService.validateUser(usernameField);
	}
}

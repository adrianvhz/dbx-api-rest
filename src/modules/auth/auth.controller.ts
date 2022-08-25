import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { Controller, Post, UseGuards, Req, Res, Put, Body, Get, UseFilters } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";
import { LocalAuthGuard } from "../../guards/local-auth.guard";
import { LinkAccountSwagger, UnlinkAccountSwagger } from "src/decorators/swagger/auth";
import type { Request, Response } from "express";
import url from "whatwg-url"
import { ClientRegisterFilter } from "src/filters/client-register.filter";


@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@LinkAccountSwagger()
	@UseGuards(LocalAuthGuard)
	@Post("link_account")
	async linkDbxAccount(@Req() req: Request, @Res() res: Response) {
		this.authService.linkDbxAccount(req, res);
	}

	@UnlinkAccountSwagger()
	@Put("unlink_account")
	async unlinkAccount(@Res() res: Response, @Body() body: any) {
		return this.authService.unlinkAccount(res, body)
	}


	/** SECOND METHOD
	 * LINK DROPBOX ACCOUNT FROM API
	 * HIDDEN ENDPOINT BECAUSE IT IS USED AS A HELPER BY THE APPLICATION ITSELF
	 * 
	 * - The method has to be GET because it receives the oauth2 redirect.
	 */
	@ApiExcludeEndpoint()
	@Get("register")
	async apiRegister(@Req() req: Request, @Res() res: Response) {
		return this.authService.apiRegister(req, res);
	}

	@Post("client_register")
	@UseFilters(ClientRegisterFilter)
	clientRegister(@Req() req: Request) {
		return this.authService.clientRegister({
			user: req.body.user,
			code: req.body.code,
			redirect_uri: req.body.redirect_uri
		});
	}
}

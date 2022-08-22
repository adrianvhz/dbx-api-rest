import { ApiTags } from "@nestjs/swagger";
import { Controller, Post, UseGuards, Req, Res, Put, Body } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";
import { LocalAuthGuard } from "../../guards/local-auth.guard";
import { LinkAccountSwagger, UnlinkAccountSwagger } from "src/decorators/swagger/auth";
import type { Request, Response } from "express";


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


	/** -INACTIVE-
	* SECOND METHOD
	*/
	// @ApiExcludeEndpoint()
	// @Get("register")
	// async register(@Req() req: Request, @Res() res: Response) {
	//   this.authService.register(req, res);
	// }
}

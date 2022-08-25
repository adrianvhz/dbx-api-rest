import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ModifyCredentialsDto, CredentialsBodyDto } from './common/dto';
import {
	Controller,
	Post,
	Patch,
	Req,
	Body, 
	Get} from '@nestjs/common';
	import {
		GetTokenSwagger,
		ModifyCredentialsSwagger,
		RefreshDbxTokenSwagger } from './decorators/swagger/app';
import type { Request } from "express"
		

@ApiTags("app")
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService
	) {}

	getHello() {
		return "Hello World!";
	}

	/**
	 * get token with credentials in body or Authorization header (Basic Scheme).
	 */
	@GetTokenSwagger()
	@Post("get_token_app")
	async generateToken(@Req() req: Request, @Body() body: CredentialsBodyDto) {
		return this.appService.generateToken(req.headers.authorization, body)
	}

	@RefreshDbxTokenSwagger()
	@Post("refresh_dbx_access_token")
	async refreshDbxToken(@Body("user") user: string) {
		return this.appService.refreshDbxToken(user);
	}

	@ModifyCredentialsSwagger()
	@Patch("modify_credentials")
	async modifyCredentials(@Body() body: ModifyCredentialsDto) {
		return this.appService.modifyCredentials(body);
	}

	/** THIS IS A EXAMPLE VIEW FOR AUTH REGISTER REDIRECT - SECOND METHOD - DELETE IT IN PRODUCTION */
	@ApiExcludeEndpoint()
	@Get("dashboard")
	dashboardView() {
		return `
			<div>
				<p>Aca seria donde se redirigio según el parametro 'domain' proporcionado en el body.</p>
				<button><a href="/">Ir a Home</a></button>
			</div>
		`
	}
}

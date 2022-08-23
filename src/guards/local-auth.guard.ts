import { Injectable, ExecutionContext, HttpException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Observable } from "rxjs";
import { LinkAccountException } from "src/exceptions/LinkAccountException";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
	handleRequest<TUser = any>(err: any, user: any, info: any, ctx: ExecutionContext, status?: any): TUser {
		if (err) {
			console.log(err)
			throw new HttpException("Undocumented Error, please contact us.", 500);
		}
		const req: Request = ctx.switchToHttp().getRequest();
		
		if (!req.body.user) {
			throw new LinkAccountException("user field missing.");
		}
		// if (!req.body.domain) {
		// 	req.body.domain = "default domain"
		// }
		return user
	}
}

import { Injectable, ExecutionContext, HttpException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LinkAccountException } from "src/exceptions/LinkAccountException";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
	handleRequest<TUser = any>(err: any, user: any, info: any, ctx: ExecutionContext, status?: any): TUser {
		if (err) {
			console.log(err)
			throw new HttpException("Undocumented Error, please contact us.", 500);
		}
		const request = ctx.switchToHttp().getRequest();
		if (!request.body.user) {
			throw new LinkAccountException("user field missing.");
		}
		if (!request.body.domain) {
			throw new LinkAccountException("domain field missing.");
		}
		return user
	}
}

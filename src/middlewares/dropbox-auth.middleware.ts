import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Dropbox, DropboxAuth } from "dropbox";
import { UserDoc } from "src/modules/users/schemas/user.schema";
import { Request, Response, NextFunction } from "express";
import * as passport from "passport"
import node_fetch from "node-fetch"
import type { IDropboxConfig } from "src/common/interfaces/IDropboxConfig";
import { expiresToken } from "src/lib/expiresToken";

@Injectable()
export class DropboxAuthMiddleware implements NestMiddleware {
	private readonly _configDbx: IDropboxConfig;
	private readonly _auth: DropboxAuth;

	constructor(
		private readonly configService: ConfigService
		) {
		this._configDbx = this.configService.get<IDropboxConfig>("dropbox");
		this._auth = new DropboxAuth({
			clientId: this._configDbx.clientId,
			clientSecret: this._configDbx.clientSecret,
			fetch: node_fetch
		});
	}

	use(req: Request, res: Response, next: NextFunction) {
		passport.authenticate("jwt-custom", { session: false }, async (err, user: UserDoc, info) => {
			if (err) {
				/**
				 * catch error and return it with next(error) to be handled at
				 * the source where the error was thrown. (jwt-custom.strategy.ts)
				 */
				return next(err)
			}
			// req.user = user;
			this._auth.setAccessToken(user.tk_acs);
			this._auth.setRefreshToken(user.tk_rfsh);

			var expired = user.tk_acs_expires < new Date();
			if (expired) await this._auth.refreshAccessToken();

			req.dbx = new Dropbox({
				auth: this._auth
			})
			next();

			/** Update access_token in db */
			if (expired) {
				user.tk_acs = this._auth.getAccessToken();
				user.tk_acs_expires = expiresToken();
				user.save().then(() => {
					console.log(`The access token of the user ${user.user} has been refreshed and updated in the database.`)
				});
			}
		})(req, res);
	}
}

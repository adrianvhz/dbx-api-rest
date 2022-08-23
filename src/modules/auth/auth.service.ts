import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/users/users.service";
import { getDropboxOAuth2Url } from "src/lib/getDropboxOAuth2Url";
import { generateSecureRandomKey } from "src/lib/generateSecureRandomKey";
import { Dropbox, DropboxAuth } from "dropbox";
import { AccountAlreadyInactive } from "src/exceptions/UserAlreadyInactiveException";
import node_fetch from "node-fetch";
import { expiresToken } from "src/lib/expiresToken";
import type { IDropboxConfig } from "src/common/interfaces/IDropboxConfig";
import type { Request, Response } from "express"


@Injectable()
export class AuthService {
	private readonly _configDbx: IDropboxConfig;
	private readonly _dbx: (access_token: string) => Dropbox;
	private readonly _dbx_auth: DropboxAuth
	
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService
	) {
		this._configDbx = this.configService.get<IDropboxConfig>("dropbox");
		this._dbx = (access_token) => new Dropbox({ accessToken: access_token });
		this._dbx_auth = new DropboxAuth({
			clientId: this._configDbx.clientId,
			clientSecret: this._configDbx.clientSecret,
			fetch: node_fetch
		})
	}

	async validateUser(userField: string) {
		/**
		 * @returns string "null" to be able to handle the response and not throw UnauthorizedException.
		 * saved in req.user
		 */
		return await this.usersService.findOne(userField, { throwError: false }) || "null";
	}

	async linkDbxAccount(req: Request, res: Response) {
		var user = req.user;
		var isNew = false;
	
		/**
		 * For accounts registered in inactive status
		 */
		// Create user if not exists
		/** FOR SECOND METHOD - API SENDS DBX FORM */ // @ts-ignore
		if (user === "null") {
			if (req.body.register) {
				var date = new Date();
				date.setMinutes(date.getMinutes() + 5);
				res.cookie("action", "create", { httpOnly: true, expires: date });
				res.cookie("redirect_to", req.body.domain, { httpOnly: true, expires: date })
				return res.redirect(await getDropboxOAuth2Url(this._configDbx.clientId, `${req.protocol}://${req.get("host")}/auth/register`));
			}
			/** PRINCIPAL METHOD */
			user = await this.usersService.create({
				user: req.body.user,
				client_key: await generateSecureRandomKey(9),
				client_secret: await generateSecureRandomKey(9),
				status: "inactive"
			})
			isNew = true;
		} else { // if user exists - inactive status 
			if (req.body.register && user.status === "inactive") {
				var date = new Date();
				date.setMinutes(date.getMinutes() + 5);
				res.cookie("action", "update", { httpOnly: true, expires: date });
				res.cookie("redirect_to", req.body.domain, { httpOnly: true, expires: date })
				return res.redirect(await getDropboxOAuth2Url(this._configDbx.clientId, `${req.protocol}://${req.get("host")}/auth/register`));
			}
		}

		res.status(200).json({
			credentials: {
				client_key: user.client_key,
				client_secret: user.client_secret
			},                                                                       
			status: user.status,
			OAUTH2_AUTHORIZE: user.status === "inactive" && !req.body.register ? await getDropboxOAuth2Url(this._configDbx.clientId, req.body.domain) : undefined,
			isNew: isNew || undefined
		})
	}

	/**
	 * possible improvement: inject usersHistoryService and exists validate or update from here.
	 * would also work for linkDbxAccount()
	 */
	/** ACTION
	* When this is executed:
	* - Dropbox tokens are removed. `tk_acs` - `tk_rfsh` - `tk_acs_expires`
	* - The current `dbx_email` field is pushed to the `dropbox_emails` array field in `history`.
	* - The `status` changes to "inactive" in `history`.
	* - The `dbx_email` field is removed.
	* - Revokes the refresh token and all generated access tokens from Dropbox.
	*/
	async unlinkAccount(res: Response, body: any) {
		var user = await this.usersService.findOne(body.user)
		if (user.status === "inactive") throw new AccountAlreadyInactive();
		await user.updateOne({
			$set: {
				status: "inactive",
			},
			$addToSet: {
				dropbox_emails: user.dbx_email
			}
		});
		await user.updateOne({
			$unset: {
				tk_acs: null,
				tk_rfsh: null,
				tk_acs_expires: null,
				dbx_email: null
			}
		});
		await this._dbx(user.access_token).authTokenRevoke();
		res.status(200).json({
			statusCode: 200,
			message: "The account has been successfully unlinked and placed in inactive status."
		})
	}



   async apiRegister(req: Request, res: Response) {
		var username = JSON.parse(req.cookies.SESSION_ID).user;
		var code = req.query.code as string;
		var tokens = (await this._dbx_auth.getAccessTokenFromCode(`${req.protocol}://${req.get("host")}${req.path}`, code)).result as any
		var email = (await this._dbx(tokens.access_token).usersGetCurrentAccount()).result.email;

		if (req.cookies.action === "update") {
			await this.usersService.update(username, {
				dbx_account_id: tokens.account_id,
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				access_token_expires: expiresToken(),
				dbx_email: email,
				status: "active",
				history_dbx_emails: [email]
			})
		}
	// if req.cookie.action === "create"
		else {
			await this.usersService.create({
				user: username,
				dbx_account_id: tokens.account_id,
				client_key: await generateSecureRandomKey(9),
				client_secret: await generateSecureRandomKey(9),
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				access_token_expires: expiresToken(),
				dbx_email: email,
				history_dbx_emails: [email]
			});
		}
		return res.redirect(308, req.cookies.redirect_to)
	}
}

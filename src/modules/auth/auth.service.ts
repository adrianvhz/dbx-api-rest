import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/users/users.service";
import { getDropboxOAuth2Url } from "src/lib/getDropboxOAuth2Url";
import { generateSecureRandomKey } from "src/lib/generateSecureRandomKey";
import { Dropbox, DropboxAuth } from "dropbox";
import { expiresToken } from "src/lib/expiresToken";
import { setRedirectionToDropboxOAuth2 } from "src/utils/setRedirectionToDropboxOAuth2";
import { UserDoc } from "../users/schemas/user.schema";
import node_fetch from "node-fetch";
import type { IDropboxConfig } from "src/common/interfaces/IDropboxConfig";
import type { Request, Response } from "express"
import { UserAlreadyInactiveException } from "src/exceptions/UserAlreadyInactive";


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

	/** endpoint: /auth/link_account */
	async linkDbxAccount(req: Request, res: Response) {
		var user = req.user;
		var isNew = false;
		const { user: username, domain, init: initDbxForm } = req.body;

		/** Create user if not exists */ // @ts-ignore
		if (user === "null") {
			/** FOR SECOND METHOD - API SENDS DBX FORM */ 
			if (initDbxForm) {
				return setRedirectionToDropboxOAuth2({ req, res, clientId: this._configDbx.clientId, action: "create" })
			}
			/** PRINCIPAL METHOD */
			user = await this.usersService.create({
				user: username,
				client_key: await generateSecureRandomKey(9),
				client_secret: await generateSecureRandomKey(9),
				status: "inactive"
			})
			isNew = true;
		} 
		
		/* Update user  */
		else { // if user exists and is in inactive status
			if (initDbxForm && user.status === "inactive") {
				return setRedirectionToDropboxOAuth2({ req, res, clientId: this._configDbx.clientId, action: "update" });
			}
		}

		res.status(200).json({
			credentials: {
				client_key: user.client_key,
				client_secret: user.client_secret
			},                                                                       
			status: user.status.toUpperCase(),
			OAUTH2_AUTHORIZE: user.status === "inactive" && !initDbxForm ? await getDropboxOAuth2Url(this._configDbx.clientId, domain) : undefined,
			message: user.status === "active" ? "The user exists and has a linked dropbox account." : "The user exists BUT doesn't have a linked dropbox account.",
			user_created_msg: isNew ? "The user has been successfully created!" : undefined,
			isNew: isNew || undefined
		})
	}

	/**
	 * possible improvement: inject usersHistoryService and exists validate or update from here.
	 * would also work for linkDbxAccount()
	 */
	/** ACTION
	* When this is executed:
	* - Dropbox tokens are removed. `access_token` - `refresh_token` - `access_token_expires`
	* - The current `dbx_email` field is pushed to the `history_dropbox_emails` array field.
	* - The `status` changes to "inactive".
	* - The `dbx_email` field is removed.
	* - Revokes the refresh token and all generated access tokens from Dropbox.
	*/
	async unlinkAccount(res: Response, body: any) {
		var user = await this.usersService.findOne(body.user);

		if (user.status === "inactive") throw new UserAlreadyInactiveException();

		await user.updateOne({
			$set: {
				status: "inactive"
			},
			$addToSet: {
				history_dbx_emails: user.dbx_email
			},
			$unset: {
				dbx_account_id: null,
				access_token: null,
				refresh_token: null,
				access_token_expires: null,
				dbx_email: null
			}
		});
		this._dbx(user.access_token).authTokenRevoke();
		res.status(200).json({
			statusCode: 200,
			message: "The account has been successfully unlinked and placed in inactive status."
		});
	}


	/** endpoint: /auth/register */
   async apiRegister(req: Request, res: Response) {
		var { username, action, redirect_to } = JSON.parse(req.cookies.body);
		var code = req.query.code as string;
		var tokens = (await this._dbx_auth.getAccessTokenFromCode(`${req.protocol}://${req.get("host")}${req.path}`, code)).result as any
		var accountData = (await this._dbx(tokens.access_token).usersGetCurrentAccount()).result;
		var dbx_data = {
			dbx_account_id: tokens.account_id,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			access_token_expires: expiresToken(),
			dbx_email: accountData.email
		}

		// If req.cookie.action === "update"
		if (action === "update") {
			await this.usersService.update(username, {
				...dbx_data,
				status: "active"
			})
		}
		
		// If req.cookie.action === "create"
		else {
			await this.usersService.create({
				user: username,
				client_key: await generateSecureRandomKey(9),
				client_secret: await generateSecureRandomKey(9),
				...dbx_data,
			});
		}

		res.status(200).end(`
			<html>
				<head>
					<style>
						button {
							display: inline-block;
							font-weight: 400;
							color: #212529;
							text-align: center;
							border: 1px solid transparent;
							padding: .375rem .75rem;
							font-size: 1rem;
							line-height: 1.5;
							color: #fff;
							border-radius: .25rem;
							background-color: #007bff;
						}

						button:hover{
							background-color: #0069d9;
							cursor: pointer;
					 	}

						a {
							text-decoration: none;
						}
					</style>
				</head>
			<body>
				<div>
					<p>La cuenta se vinculo correctamente!</p>
					<a href=${redirect_to}>${redirect_to && `<button>Home</button></a>`}
				</div>
			</body>
			</html>
	`)
	}

	/** endpoint: /auth/client_register */

	/**
	 * body: (application/json OR application/x-www-form-urlencoded)
	 * 	- user
	 * 	- code
	 *  	- redirect_uri (el redirect_uri que se uso para obtener el code)
	 * 
	 * @returns 
	 * 	credentials: {
	 * 		client_key: ...,
	 * 		client_secret ...,
	 * 	},
	 * 	message: ..,
	 * 	status: ..,
	 * 	isNew: ..
	 */
	async clientRegister({ user: username, code, redirect_uri }) {
		var tokens = (await this._dbx_auth.getAccessTokenFromCode(redirect_uri, code)).result as any
		var accountData = (await this._dbx(tokens.access_token).usersGetCurrentAccount()).result;
		var dbx_data = {
			dbx_account_id: accountData.account_id,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			access_token_expires: expiresToken(),
			dbx_email: accountData.email
		}

		var user = await this.usersService.findOne(username, { throwError: false });
		var userNewOrUpdated: UserDoc;
		var isNew = false;

		/** UPDATE USER */
		if (user) {
			userNewOrUpdated = await this.usersService.update(username, {
				...dbx_data,
				status: "active"
			})
		}
		
		/** CREATE USER */
		else {
			userNewOrUpdated = await this.usersService.create({
				user: username,
				...dbx_data,
				client_key: await generateSecureRandomKey(9),
				client_secret: await generateSecureRandomKey(9),
			});
			isNew = true;
		}

		return {
			credentials: {
				client_key: userNewOrUpdated.client_key,
				client_secret: userNewOrUpdated.client_secret
			},
			message: isNew ? "User has been successfully CREATED!" : "User has been successfully UPDATED!",
			status: userNewOrUpdated.status,
			isNew: isNew || undefined
		}
	}
}

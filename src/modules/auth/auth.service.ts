import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/users/users.service";
import { getDropboxOAuth2Url } from "src/lib/getDropboxOAuth2Url";
import { generateSecureRandomKey } from "src/lib/generateSecureRandomKey";
import { Dropbox } from "dropbox";
import { AccountAlreadyInactive } from "src/exceptions/UserAlreadyInactiveException";
import fetch from "node-fetch";
import type { IDropboxConfig } from "src/common/interfaces/IDropboxConfig";
import type { Request, Response } from "express"


@Injectable()
export class AuthService
{
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		// private readonly usersHistoryService: UsersHistoryService
	) {}

	async validateUser(userField: string) {
		/**
		 * @returns string "null" to be able to handle the response and not throw UnauthorizedException.
		 * saved in req.user
		 */
		var user = await this.usersService.findOne(userField, { throwError: false });
		if (!user) return "null";
		return await user.populate({
			path: "history",
			select: "status"
		})
	}

	async linkDbxAccount(req: Request, res: Response) {
		const dropboxConfig = this.configService.get<IDropboxConfig>("dropbox");
		var user = req.user;
		var isNew = false;
		
		// Create user if not exists
		// @ts-ignore
		if (req.user === "null") {
			user = await this.usersService.create({
				user: req.body.user,
				client_key: await generateSecureRandomKey(9),
				client_secret: await generateSecureRandomKey(9)
			})
			isNew = true;
		}

		/**
		 * For accounts registered in inactive status
		 */
		if (user.history.status === "inactive") {
			user.history.status = "active";
			/**
			 * 'await' is not necessary, and a response is received faster.
			 */
			user.history.save();
		}
		res.status(200).json({
			credentials: {
				client_key: user.client_key,
				client_secret: user.client_secret
			},                                                                       
			OAUTH2_AUTHORIZE: isNew ? await getDropboxOAuth2Url(dropboxConfig.clientId, req.body.domain) : undefined,
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
		var user = await (await this.usersService
			.findOne(body.user))
			.populate({
				path: "history"
			});
		if (user.history.status === "inactive") throw new AccountAlreadyInactive();
		
		await user.history.updateOne({
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
		await new Dropbox({ accessToken: user.tk_acs }).authTokenRevoke();
		res.status(200).json({
			statusCode: 200,
			message: "The account has been successfully unlinked and placed in inactive status."
		})
	}




   /** CURRENTLY INACTIVE
   * FOR REGISTER, IS FOR SECOND METHOD WHERE API SEND DROPBOX FORM.
   * It has to be adapted to the current system that I'm not familiar with.
   */
   async apiRegister(req: Request, res: Response) {
      var data = await fetch(process.env.SIGN_IN_URI, {
         method: "POST",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded"
         },
         body: new URLSearchParams({
            user: req.cookies.user,
            code: req.query.code as string
         })
      })
      res.json(await data.json());
	}
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/users/users.service";
import { getDropboxOAuth2Url } from "src/lib/getDropboxOAuth2Url";
import { generateSecureRandomKey } from "src/lib/generateSecureRandomKey";
import { Dropbox, DropboxAuth } from "dropbox";
import { expiresToken } from "src/lib/expiresToken";
import * as path from "path";
import { setRedirectionToDropboxOAuth2 } from "src/utils/setRedirectionToDropboxOAuth2";
import { UserDoc } from "../users/schemas/user.schema";
import node_fetch from "node-fetch";
import { UserAlreadyInactiveException } from "src/exceptions/UserAlreadyInactive";
import type { IDropboxConfig } from "src/common/interfaces/IDropboxConfig";
import type { Request, Response } from "express";


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
		
		// res.status(200).sendFile(path.join(__dirname, "..", "..", "..", "views", "success_response.html"));
		res.status(200).end(`
		<!doctype html>
		<html lang="en">
			<head>
				<title>Dropbox</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
				<link rel="icon" type="image/png" href="https://proeducative.com/favicon.png">
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
				<style>
					html { height: 100%;}
					body { background: linear-gradient(rgba(255, 255, 255, 0.70), rgba(255, 255, 255, 0.70)),  url('http://gypa.ge/wp-content/uploads/2014/11/empresarial.jpg');background-size: cover; }
					.container { display: flex;flex-flow: row wrap;}
					.item { flex: 1 1 15rem; }
					h1 { color: white; text-align: center; font-family: Arial; font-weight: bold; background-color:#007EE5; margin-bottom: 30px;padding: 15px;margin-left: -12px;margin-right: -12px;}
					h2 { text-align: center;  font-family: Arial; }
					h3 { font-family: Arial; font-size: 2rem }
					.btn-primary { background-color: #007EE5;font-weight: 600; }
				</style>
			</head>
			<body>
				<div class="container-fluid">
					<div Class="item">
						<h1>VINCULACIÓN EXITOSA</h1>
						<div>
							<h2>
								<img src="http://im.pcmag.com/pcmagus/photo/default/dropbox-logo_34k8.png" style="width: 30%">
							</h2>
						</div>
						<div class="mb-4">
							<h2><img src="https://proeducative.com/images/logo-proeducative.png" height="50px"></h2>
						</div>
						<div class="col-lg-12">
							<div class="row justify-content-md-center">
								<div class="col-lg-12 text-center mb-3">
									<a href="${ redirect_to ? redirect_to : 'https://proeducative.com' }" id="reload" type="button" class="btn btn-lg btn-primary col-lg-2">Ir a la Plataforma</a>
									<h6 class="mt-3">Redirigiendo en <span id="counter"></span></h6> 
								</div>
								<div class="col-lg-5">
									<p class="text-justify">Reúne archivos tradicionales, contenido en la nube, documentos de Dropbox Paper y accesos directos web en un solo lugar, para que puedas organizarte y abordar tu trabajo de manera eficiente. Almacena tus archivos en un lugar seguro al que puedas acceder desde tu computadora, teléfono o tablet..</p>
									<p><a href="https://www.dropbox.com" target="_blank">Haga clic aquí para visitar el sitio de Dropbox</a></p>
									<h4>Lo mejor de usar dropbox</h4>
									<ul>
										<li>Disponible las 24 horas.</li>
										<li>Comparte carpetas y archivos usando links.</li>
										<li>Mejor gestión de documentos laborales.</li>
										<li>Admite variedad de formatos y sistemas.</li>
										<li>Respaldo en todo momento.</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script>
				<script>
				var count = 5;
				function counter() {
					document.getElementById("counter").innerHTML = count;
					count = count - 1;      
					setTimeout(counter, 1000);
					if (count == 0) {
						document.getElementById("reload").click();
					}
				}
				counter();
				</script>
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

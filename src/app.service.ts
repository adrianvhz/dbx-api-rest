import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { encodeBasicAuth } from './lib/encodeBasicAuth';
import { decodeBasicAuth } from './lib/decodeBasicAuth';
import { expiresToken } from './lib/expiresToken';
import { CredentialsBodyDto, ModifyCredentialsDto } from './common/dto';
import fetch from "node-fetch";
import type { IDropboxConfig } from './common/interfaces/IDropboxConfig';

@Injectable()
export class AppService {

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly configSerice: ConfigService
	) {}

	getHello(): string {
		return "";
	}

	async generateToken(authorization: string, body: CredentialsBodyDto) {
		var credentials: CredentialsBodyDto;	
 
		if (authorization) {
			credentials = decodeBasicAuth(authorization);
		}
		else if (body.client_key && body.client_secret) {
			credentials = body
		}
		else {
			throw new BadRequestException("Bad Request", "You must provide your credentials.");
		}

		var user = await this.usersService.findOneByClientKey(credentials.client_key);
		if (credentials.client_secret !== user.client_secret) {
			throw new UnauthorizedException("Unauthorized", "client_secret mismatch the database client_secret!")
		}
		var payload = {
			user: user.user,
			client_key: credentials.client_key
		}
		return {
			token: this.jwtService.sign(payload,
				{
					algorithm: "HS256",
					secret: credentials.client_secret,
					expiresIn: "15d"
				}
			)
		}
	}

	async refreshDbxToken(userBody: string) {
		const config = this.configSerice.get<IDropboxConfig>("dropbox");
		var user = await this.usersService.findOne(userBody);
		var data = await (await fetch("https://api.dropboxapi.com/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": encodeBasicAuth(config.clientId, config.clientSecret)
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: user.tk_rfsh
			})
		})).json();
		var exp_date = expiresToken();
		user.tk_acs = data.access_token;
		user.tk_acs_expires = exp_date;
		user.save()
		return {
			message: "access_token has been successfully refreshed!",
			expires: exp_date
		}
	}

	async modifyCredentials(body: ModifyCredentialsDto) {
		return await this.usersService.update(body.user, {
			user: body.new_user_name,
			client_key: body.client_key,
			client_secret: body.client_secret
		});
	}
}

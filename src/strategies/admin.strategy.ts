import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
	constructor() {
		super();
	}

	validate(@Req() req: Request) {
		if (!req.headers["x-admin"]) {
			throw new BadRequestException("Bad Request", "User is not admin or an 'x-admin' Header was not set.");
		}
		if (req.headers["x-admin"] && (req.headers["x-admin"] !== "123")) {
			throw new UnauthorizedException("Unauthorized", "Wrong key!")
		}
		else {
			return true
		}
	}
}

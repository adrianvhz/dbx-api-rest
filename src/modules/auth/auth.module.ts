import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtCustomStrategy } from "../../strategies/jwt-custom.strategy";
import { LocalStrategy } from "../../strategies/local.strategy";
import { AdminStrategy } from "../../strategies/admin.strategy";

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtCustomStrategy,
		AdminStrategy
	],
	exports: [AuthService]
})
export class AuthModule {}

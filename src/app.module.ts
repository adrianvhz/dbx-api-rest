import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ServicesModule } from "./modules/services/services.module";
import { DatabaseModule } from "./database/database.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtService } from "@nestjs/jwt";
import appConfig from "./config/app.config";
import * as path from "path";


@Module({
	imports: [
		ConfigModule.forRoot(
			{
				envFilePath: ".env",
				isGlobal: true,
				cache: true,
				load: [appConfig]
			}
		),
		AuthModule,
		UsersModule,
		ServicesModule,
		DatabaseModule,
		ServeStaticModule.forRoot(
			{
				rootPath: path.join(__dirname, "..", "examples"),
				exclude: ["/docs", "/auth", "/users", "/users-history", "/services"],
				serveStaticOptions: {
					fallthrough: false
				}
			}
		)
	],
	controllers: [AppController],
	providers: [AppService, JwtService]
})
export class AppModule {}

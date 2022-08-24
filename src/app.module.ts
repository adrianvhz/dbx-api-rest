import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ServicesModule } from "./modules/services/services.module";
import { DatabaseModule } from "./database/database.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtService } from "@nestjs/jwt";
import { CastArrayMiddleware } from "./middlewares/cast-array.middleware";
import appConfig from "./config/app.config";
import * as path from "path";

const imports = [
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
	DatabaseModule
]

if (process.env.NODE_ENV === "DEVELOPMENT") {
	imports.push(ServeStaticModule.forRoot({
		rootPath: path.join(__dirname, "..", "examples"),
		exclude: ["/docs", "/auth", "/users", "/users-history", "/services"],
		serveStaticOptions: {
			fallthrough: false
		}
	}))
}

@Module({
	imports,
	controllers: [AppController],
	providers: [AppService, JwtService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(CastArrayMiddleware)
			.forRoutes(
				{ path: ":user/files/search", method: RequestMethod.GET },
				{ path: ":user/sharing/add_file_member", method: RequestMethod.POST }
			)
	}
}

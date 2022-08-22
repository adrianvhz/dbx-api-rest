import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/modules/users/users.module";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";
import { DropboxAuthMiddleware } from "src/middlewares";

@Module({
	imports: [
		UsersModule,
		JwtModule,
		ConfigModule
	],
	controllers: [ServicesController],
	providers: [ServicesService]
})
export class ServicesModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(DropboxAuthMiddleware)
			.forRoutes(ServicesController)
	}
}

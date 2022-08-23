import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { usersEntityMiddleware } from "src/middlewares";
import { User } from "./schemas/user.schema";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				imports: [UsersModule],
				inject: [],
				name: User.name,
				collection: "users",
				useFactory: () => {
					return usersEntityMiddleware();
				}
			}
		])
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}

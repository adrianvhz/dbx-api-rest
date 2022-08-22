import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersHistoryController } from "./users-history.controller";
import { UsersService } from "./users.service";
import { UsersHistoryService } from "./users-history.service";
import { usersEntityMiddleware } from "src/middlewares";
import { usersHistoryEntityMiddleware } from "src/middlewares/users-history-entity.middleware";
import { User } from "./schemas/user.schema";
import { UserHistory } from "./schemas/user-history.schema";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				imports: [UsersModule],
				inject: [UsersHistoryService],
				name: User.name,
				collection: "users",
				useFactory: (usersHistoryService: UsersHistoryService) => {
					return usersEntityMiddleware(usersHistoryService);
				}
			},
			{
				name: UserHistory.name,
				collection: "user_history",
				useFactory: () => {
					return usersHistoryEntityMiddleware();
				}
			}
		])
	],
	controllers: [UsersController, UsersHistoryController],
	providers: [UsersService, UsersHistoryService],
	exports: [UsersService, UsersHistoryService]
})
export class UsersModule {}

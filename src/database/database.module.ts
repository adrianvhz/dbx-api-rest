import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { databaseConfig } from "./database.config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return databaseConfig(configService);
			},
			inject: [ConfigService]
		})
	]
})
export class DatabaseModule {
	constructor(@InjectConnection() connection: Connection) {
		if (connection.readyState === 1) {
			console.log("Connected database!\nHOST:", connection.host);
		}
	}
}

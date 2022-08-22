import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import type { IDatabase } from "src/common/interfaces/IDatabase";

export function databaseConfig(configService: ConfigService) {
	const configDB = configService.get<IDatabase>("database");
	const options: MongooseModuleOptions = {
		uri: configDB.mongodb.uri,
		dbName: configDB.mongodb.dbName
	}
	return options;
}

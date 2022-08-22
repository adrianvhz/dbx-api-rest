interface IMongoDBoptions {
	uri: string;
	dbName: string;
}

export interface IDatabase {
	mongodb: IMongoDBoptions;
}

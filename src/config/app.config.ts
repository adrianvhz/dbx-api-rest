export default () => ({
	http: {
		host: process.env.APP_HOST || "0.0.0.0",
		port: process.env.APP_PORT || process.env.PORT || "5000"
	},

	database: {
		mongodb: {
			uri: process.env.MONGO_URI,
			dbName: process.env.DB_NAME
		}, // second option
		typeorm: {
			uri: "..",
			dbName: ".."
		}
	},

	dropbox: {
		clientId: process.env.APP_KEY,
		clientSecret: process.env.APP_SECRET,
		redirectUri: process.env.REDIRECT_URI,
		// redirectUriForRegister: process.env.REDIRECT_URI_FOR_REGISTER
	},

	enviroment: process.env.NODE_ENV,

	swagger: {
		url_app: process.env.URL_SWAGGER_APP,
		url_server: process.env.URL_SWAGGER_SERVER
	}
})

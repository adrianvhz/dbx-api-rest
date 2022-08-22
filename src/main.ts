import { AppModule } from "src/app.module";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as multer from "multer"
import initSwagger from "./app.swagger";
import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { disableFavicon } from "./middlewares/disable-favicon";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config = app.get(ConfigService);
	const NODE_ENV = config.get<string>("enviroment");
	const HOST = config.get<string>("http.host");
	const PORT = parseInt(config.get<string>("http.port"), 10) 

	const corsOptions: CorsOptions = {
		origin: '*',
		methods: ["GET", "POST", "PATCH", "HEAD", "PUT", "DELETE"]
		// credentials: true,
		// preflightContinue: false
	};

	app.enableCors(corsOptions);
	app.useGlobalPipes(new ValidationPipe())
	app.use(multer().single("file"))
	app.use(cookieParser());
	app.use(disableFavicon)

	initSwagger(app);

	await app.listen(PORT, HOST, async () => {
		console.log("App running in", (NODE_ENV), "mode")
		console.log(`Running on: ${await app.getUrl()}`)
	});
}
bootstrap();
 
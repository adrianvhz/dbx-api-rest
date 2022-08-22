import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { UserDocDto } from "src/common/dto/user-doc.dto";
import { CreateUserDto } from "./modules/users/dto/create-user.dto";


const initSwagger = (app: NestExpressApplication) => {
	var config = new DocumentBuilder()
	.setTitle("DBX-API")
	.setDescription("")
	.setVersion("v1.0.0")
	.addBasicAuth({
		type: "apiKey",
		scheme: "basic",
		name: "x-admin",
		in: "header",
		description: "Provides a secret key to manage users."
	}, "manage-users")
	.addBearerAuth({
		type: "http",
		scheme: "Bearer",
		bearerFormat: "JWT",
		name: "auth_services",
		in: "header",
		description: "Set the token to use for service endpoints.<br />If you don't have a token, get it <a href='/'>here</a>."
	}, "services")
	.addTag("app", "")
	.addTag("auth", "")
	.addTag("manage users", "Key is required, provide it at the top right (x-admin header). Or else, you can also provide an x-admin header for each endpoint.")
	.addTag("services", "Services for users. A token is required, provide it at the top right.")
	.build();

	var document = SwaggerModule.createDocument(app, config, {
		extraModels: [
			CreateUserDto,
			UserDocDto
		]
	});

	SwaggerModule.setup("/docs", app, document);
}

export default initSwagger

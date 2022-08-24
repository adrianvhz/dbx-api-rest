import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { UserDocDto } from "src/common/dto/user-doc.dto";
import { CreateUserDto } from "./modules/users/dto/create-user.dto";


const initSwagger = (app: NestExpressApplication) => {
	var config = new DocumentBuilder()
	.setTitle("DBX-APIREST")
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
		scheme: "bearer",
		bearerFormat: "JWT",
		name: "auth_services",
		in: "header",
		description: "Set the token to use for service endpoints."
	}, "services")
	.addTag("app", "")
	.addTag("auth", "")
	.addTag("manage users", "")
	.addTag("services", "")
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

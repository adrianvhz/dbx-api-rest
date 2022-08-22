import { IsNotEmpty } from "class-validator";

export class ModifyCredentialsDto {
	@IsNotEmpty()
	user: string;

	@IsNotEmpty()
	new_user_name: string;

	client_key: string;

	client_secret: string;
}

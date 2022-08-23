import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator"

export class CreateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	user: string;

	@ApiProperty()
	dbx_account_id?: string;

	@IsNotEmpty()
	@ApiProperty()
	client_key?: string;

	@IsNotEmpty()
	@ApiProperty()
	client_secret?: string;

	@ApiProperty()
	access_token?: string;

	@ApiProperty()
	refresh_token?: string;

	@ApiProperty({ type: "string" })
	access_token_expires?: Date;

	@ApiProperty()
	dbx_email?: string;
}

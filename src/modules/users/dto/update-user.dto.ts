import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
	@ApiProperty()
	user: string;

	@ApiProperty()
	dbx_account_id?: string;

	@ApiProperty()
	client_key?: string;

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

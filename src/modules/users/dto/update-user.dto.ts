import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
	@ApiProperty()
	user: string;

	@ApiProperty()
	client_key?: string;

	@ApiProperty()
	client_secret?: string;

	@ApiProperty()
	tk_acs?: string;

	@ApiProperty()
	tk_rfsh?: string;

	@ApiProperty()
	dbx_email?: string;
}

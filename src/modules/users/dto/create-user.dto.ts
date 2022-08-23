import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator"

export class CreateUserDto
{
	@IsNotEmpty()
	@ApiProperty({ type: "string", example: "test" })
	user: string;

	@ApiProperty({ type: "string", example: "dbid:AABtkbpNybe_XSwvzm-KvwOItE_Zw53J3WM" })
	dbx_account_id?: string;

	@IsNotEmpty()
	@ApiProperty({ type: "string", example: "tl95hoxt6ris6r0" })
	client_key?: string;

	@IsNotEmpty()
	@ApiProperty({ type: "string", example: "qtesje5gvi80xdt" })
	client_secret?: string;

	@ApiProperty({ type: "string", example: "sl.BM9MXDvKZ-WmMOm4OX_EdtHLkOFgagj1fwD9QIj4XZ0tnqSu2nqXeTOnNiwaQX3Tk_I-5o4spqyPNsqUr8Xt1I2dzjM8RzqsmjQDF6qOMQDXprc3W2gPWDSAZhkF0tAWkM6IsFfa_bwL" })
	tk_acs?: string;

	@ApiProperty({ type: "string", example: "LXomUFN9igIAAAAAAAAAATEPcylRcua4VyBBq3qOZKWqHoZLrJKsTEcOM2l-pV9I" })
	tk_rfsh?: string;

	@ApiProperty({ type: "string" })
	tk_acs_expires?: Date;

	@ApiProperty({ type: "string", example: "test@yahoo.com" })
	dbx_email?: string;
}

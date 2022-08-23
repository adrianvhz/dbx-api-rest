import { ApiProperty } from "@nestjs/swagger";

export class UserDocDto {
	@ApiProperty({ example: "12f16cc063606b3e28ew68a3" })
	id: string;

	@ApiProperty({ example: "test" })
	user: string;

	@ApiProperty({ example: "tl95hoxt6ris6r0" })
	client_key: string;

	@ApiProperty({ example: "qtesje5gvi80xdt" })
	client_secret: string;

	@ApiProperty({ example: "sl.BM9MXDvKZ-WmMOm4OX_EdtHLkOFgagj1fwD9QIj4XZ0tnqSu2nqXeTOnNiwaQX3Tk_I-5o4spqyPNsqUr8Xt1I2dzjM8RzqsmjQDF6qOMQDXprc3W2gPWDSAZhkF0tAWkM6IsFfa_bwL" })
	access_token: string;

	@ApiProperty({ example: "LXomUFN9igIAAAAAAAAAATEPcylRcua4VyBBq3qOZKWqHoZLrJKsTEcOM2l-pV9I" })
	token_refresh: string;

	@ApiProperty({ example: "test@yahoo.com" })
	dbx_email: string;
}

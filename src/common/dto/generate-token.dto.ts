import { ApiProperty } from "@nestjs/swagger";

export class GenerateTokenDto {
	@ApiProperty()
	client_key: string;

	@ApiProperty()
	client_secret: string;
}

export class ResponseGenerateTokenDto {
	@ApiProperty()
	token: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateUserHistoryDto
{
	@IsNotEmpty()
	@ApiProperty({ type: "string" })
	user: string;

	@ApiProperty({ type: "string" })
	status?: string;
	
	@ApiProperty({ type: "array", items: { type: "string" } })
	dropbox_emails?: string[];
}

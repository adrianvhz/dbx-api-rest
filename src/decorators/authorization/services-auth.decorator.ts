import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export function ServicesAuth() {
	return applyDecorators(
		ApiBearerAuth("services")
	)
}

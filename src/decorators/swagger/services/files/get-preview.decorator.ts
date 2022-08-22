import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function FilesGetPreviewSwagger() {
	return applyDecorators(
		ApiQuery({
			name: "path",
			description: "The path of the file to view. <b>[path - id - rev]</b>",
			schema: {
				type: "string"
			}
		})
	)
}
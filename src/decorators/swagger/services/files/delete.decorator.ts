import { applyDecorators } from "@nestjs/common"
import { ApiQuery } from "@nestjs/swagger"

export function FilesDeleteSwagger() {
	return applyDecorators(
		ApiQuery({
			name: "path",
			description: "Path in the user's Dropbox to delete. <b>[path - id]</b>",
			schema: {
				type: "string"
			}
		})
	)
}

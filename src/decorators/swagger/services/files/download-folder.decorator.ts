import { applyDecorators } from "@nestjs/common"
import { ApiQuery } from "@nestjs/swagger"

export function FilesDownloadFolderSwagger() {
	return applyDecorators(
		ApiQuery({
			name: "path",
			description: "The path of the folder to download. <b>[path - id]</b>",
			schema: {
				type: "string"
			}
		})
	)
}
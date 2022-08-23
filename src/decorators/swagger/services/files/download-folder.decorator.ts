import { applyDecorators } from "@nestjs/common"
import { ApiParam, ApiQuery } from "@nestjs/swagger"

export function FilesDownloadFolderSwagger() {
	return applyDecorators(
		ApiQuery({
			name: "path",
			description: "The path of the folder to download. <b>[path - id]</b>",
			schema: {
				type: "string"
			}
		}),
		ApiParam({
			name: "user",
			description: "<strike>user path is not required in swagger</strike><br />(leave it blank)",
			deprecated: true,
			schema: { type: "string" },
			required: false
		})
	)
}
import { applyDecorators } from "@nestjs/common"
import { ApiQuery } from "@nestjs/swagger"

export function FilesUploadFromUrlSwagger() {
	return applyDecorators(
		ApiQuery({
			name: "url",
			description: "The URL to be saved.",
			schema: {
				type: "string"
			},
		}),
		ApiQuery({
			name: "path",
			description: "The path in Dropbox where the URL will be saved to.<br /><b>Example:</b> /images/cat.jpg",
			schema: {
				type: "string"
			},
			required: false
		})
	)
}

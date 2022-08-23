import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"

export function FilesDownloadSwagger() {
	return applyDecorators(
		ApiResponse({
			status: HttpStatus.OK,
			description: "Successful operation!"
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: "Error: Bad Request"
		}),
		ApiResponse({
			status: HttpStatus.CONFLICT,
			description: "Error: Conflict"
		}),
		ApiQuery({
			name: "path",
			description: "The path of the file to download. <b>[path - id - rev]</b>",
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

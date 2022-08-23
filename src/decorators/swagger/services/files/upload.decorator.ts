import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"

export function FilesUploadSwagger() {
	return applyDecorators(
		ApiResponse({
			status: HttpStatus.OK,
			description: "Successful operation!"
		}),
		ApiResponse({
			status: HttpStatus.CONFLICT,
			description: "Error: Conflict"
		}),
		ApiConsumes("multipart/form-data"),
		ApiBody({
			schema: {
				type: "object",
				properties: {
					file: {
						type: "string",
						format: "binary"
					}
				}
			}
		}),
		ApiQuery({
			name: "path",
			description: "Folder path in the user's Dropbox to save the file. <b>[path - id]</b><br /><b>If empty it points to the root folder.</b>",
			schema: {
				type: "string"
			},
			required: false
		}),
		ApiQuery({
			name: "mode",
			description: "Selects what to do if the file already exists.<br /><b>Default: add</b>",
			schema: {
				type: "string",
				enum: ["add", "overwrite"],
			},
			required: false
		}),
		ApiQuery({
			name: "autorename",
			description: "If there's a conflict, as determined by `mode`, have the Dropbox server try to autorename the file to avoid conflict error.<br /><b>Default: false</b>",
			type: "boolean",
			required: false
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

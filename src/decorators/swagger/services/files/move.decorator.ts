import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"

export function FilesMoveSwagger() {
	return applyDecorators(
		ApiQuery({
			name: "from_path",
			description: "Path in the user's Dropbox to be copied or moved. <b>[path - id - rev]</b>",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "to_path",
			description: "Path in the user's Dropbox that is the destination. <b>[path - id - rev]</b>",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "autorename",
			description: "If there's a conflict, have the Dropbox server try to autorename the file to avoid the conflict.<br /><b>Default: false</b>",
			schema: {
				type: "boolean"
			},
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
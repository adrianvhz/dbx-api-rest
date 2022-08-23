import { applyDecorators } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger"

export function SharingListFoldersSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Return the list of all shared folders the current user has access to."
		}),
		ApiQuery({
			name: "limit",
			description: "The maximum number of results to return per request.<br /><b>Default: 1000</b>",
			schema: {
				type: "string"
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

// @ApiQuery({
//     name: "just_one", // algo asi, implementar dps
//     description: "s",
//     schema: { type: "string" },
//     required: false
// })
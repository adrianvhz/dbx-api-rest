import { applyDecorators } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger"

export function SharingListSharedLinksSwagger() {
	return applyDecorators(
		ApiOperation({
			summary: "TIP: 'content_url' which can be used to embed content, can be obtained on this endpoint.",
			description: "Returns the shared link of a file or folder if `direct_only` is true. Otherwise, returns a list of all shared links that<br /> allow access to the given path - direct links to the given path and links to parent folders of the given path.<br />Links to parent folders can be suppressed by setting `direct_only` to true.<br /><br />For a file to be previewed with the url of <b>content_url</b> it has to be shared and have the access level set to <b>public</b>.",
		}),
		ApiQuery({
			name: "path",
			description: "The path to the file or folder to get the link(s). <b>[path - id - rev]<br />If empty, returns a list of all shared links for the current user.</b>",
			schema: {
				type: "string"
			},
			required: false
		}),
		ApiQuery({
			name: "direct_only",
			description: "<u>true:</u> Only the given file or folder shared link will be returned.<br /><u>false:</u> An array containing the shared link and also the shared links to the parent folders.<br /><b>Default: false</b>",
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
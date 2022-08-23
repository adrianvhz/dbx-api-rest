import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

export function FilesGetMetadataSwagger() {
	return applyDecorators(
		ApiOperation({
			summary: "TIP: 'shared_folder_id' can be obtained on this endpoint.",
			description: "Returns the metadata for a file or folder."
		}),
		ApiQuery({
			name: "path",
			description: "The path of a file or folder on Dropbox. <b>[path - id - rev]</b>",
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
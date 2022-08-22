import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";

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
		})
	)
}
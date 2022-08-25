import { applyDecorators } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger"

export function FilesGetThumbnailSwagger() {
	return applyDecorators(
		ApiOperation({
			summary: "ii ..."
		}),
		ApiQuery({
			name: "resource",
			description: "Identification type for the file.",
			schema: {
				type: "string",
				enum: ["path", "link"]
			}
		}),
		ApiQuery({
			name: "PathOrLink",
			description: "<u>OPTIONS</u>: A path or a shared_link depending on the option chosen in `resource`.<br />- A path to a file.<b>[path - id - rev]</b><br />- A shared link pointing to a file or folder, with a relative path.",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "format",
			description: "The format for the thumbnail image, jpeg (default) or png. For images that are photos, jpeg should be preferred, while png is better for screenshots and digital arts.<br /><b>Default: jpeg</b>",
			schema: {
				type: "string",
				enum: ["jpeg", "png"]
			},
			required: false
		}),
		ApiQuery({
			name: "size",
			description: "The size for the thumbnail image.<br /><b>Default: w64h64</b>",
			schema: {
				type: "string",
				enum: ["w32h32", "w64h64", "w128h128", "w256h256", "w480h320", "w640h480", "w960h640", "w1024h768", "w2048h1536"]
			},
			required: false
		}),
		ApiQuery({
			name: "mode",
			description: "How to resize and crop the image to achieve the desired size.<br /><b>Default: strict</b>",
			schema: {
				type: "string",
				enum: ["strict", "bestfit", "fitone_bestfit"]
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
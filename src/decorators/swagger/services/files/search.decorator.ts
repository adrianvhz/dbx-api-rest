import { applyDecorators } from "@nestjs/common"
import { ApiOperation, ApiQuery } from "@nestjs/swagger"

export function FilesSearchSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Query files and folders."
		}),
		ApiQuery({
			name: "query",
			description: "The string to search for. May match across multiple fields based on the request arguments.",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "path",
			description: "Scopes the search to a path in the user's Dropbox. <b>[path - id]</b><br /><b>Searches the entire Dropbox if not specified.</b>",
			schema: {
				type: "string"
			},
			required: false
		}),
		ApiQuery({
			name: "filename_only",
			description: "Restricts search to only match on filenames.<br /><b>Default: false</b>",
			schema: {
				type: "boolean"
			},
			required: false
		}),
		ApiQuery({
			name: "order_by",
			description: "Specified property of the order of search results.<br /><b>Default: relevance</b>",
			schema: {
				type: "string",
				enum: ["relevance", "last_modified_time"],
			},
			required: false
		}),
		ApiQuery({
			name: "max_results",
			description: "The maximum number of search results to return.<br /><b>Default: 100</b>",
			schema: {
				type: "integer",
				format: "int64"
			},
			required: false
		}),
		ApiQuery({
			name: "file_extensions",
			description: "Restricts search to only the extensions specified.",
			schema: {
				type: "array",
				items: {
					type: "string",
					example: ""
				}
			},
			required: false
		})
	)
}

// @ApiQuery({
//     name: "file_categories",
//     description: "Restricts search to only the file categories specified.<br /><b>Examples: image - audio - video - folder - document - pdf - spreadsheet - others</b>",
//     schema: {
//         type: "array",
//         items: {
//             type: "string",
//             enum: ["file", "asd", "1", "32", "dsad", "dsa34"]
//         }
//     },
//     // explode: false,
//     required: false,
// })
import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"

export function FilesListFolderSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Return the contents of a folder."
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "Successful operation!"
		}),
		ApiResponse({
			status: HttpStatus.CONFLICT,
			description: "Error: Conflict"
		}),
		ApiQuery({
			name: "path",
			description: "A unique identifier for the file. <b>[path - id]</b><br /><b>If empty it points to the root folder.</b>",
			schema: {
				type: "string"
			},
			required: false
		}),
		ApiQuery({
			name: "recursive",
			description: "If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders.<br /><b>Default: false</b>",
			schema: {
				type: "boolean"
			},
			required: false
		}),
		ApiQuery({
			name: "limit",
			description: "The maximum number of results to return per request.",
			schema: {
				type: "integer",
				format: "int32"
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


/**
     @ApiResponse({ status: 200, schema: { example: [
    {
        ".tag": "folder",
        "name": "Apps",
    "path_lower": "/apps",
    "path_display": "/Apps",
    "id": "id:vuLp91tM2jAAAAJJAAAAGQ"
},
{
    ".tag": "folder",
    "name": "Documents",
    "path_lower": "/documents",
    "path_display": "/Documents",
    "id": "id:vuLq91tM2jAAAAJAAAAABw",
    "shared_folder_id": "2749120513",
    "sharing_info": {
        "read_only": false,
        "shared_folder_id": "2749120513",
        "traverse_only": false,
        "no_access": false
    }
},
{
    ".tag": "folder",
    "name": "Images",
    "path_lower": "/images",
    "path_display": "/Images",
    "id": "id:vuLp91tM2jAAAAWWAAAAfg"
}
    ]}})
    */
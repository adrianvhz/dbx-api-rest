import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"

export function FilesListFolderContinueSwagger() {
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
			name: "cursor",
			description: "The cursor returned by the previous API call.",
			schema: {
				type: "string"
			},
			required: true
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

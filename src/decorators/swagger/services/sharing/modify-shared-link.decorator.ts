import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger"

export function SharingModifySharedLinkSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Modify the shared link's settings."
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: "Successful operation!"
		}),
		ApiQuery({
			name: "url",
			description: "URL of the shared link to change its settings.",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "access",
			description: "Requested access level you want the audience to gain from this link.<br /><b><i>Note: modifying access level for an existing link is not supported. Omit this field if it is the case.</i></b>",
			schema: {
				type: "string",
				enum: ["viewer", "editor", "max"]
			},
			required: false
		}),
		ApiQuery({
			name: "audience",
			description: "The new audience who can benefit from the access level specified by the link's access level specified in the `access` field.<br /><b>Default: public</b>",
			schema: {
				type: "string",
				enum: ["public", "no_one", "team"]
			},
			required: false
		}),
		ApiQuery({
			name: "allow_download",
			description: "<u>For Dropbox Professional y Dropbox Business:</u><br />Boolean flag to allow or not download capabilities for shared links.",
			schema: {
				type: "boolean"
			},
			required: false
		}),
		ApiQuery({
			name: "expires",
			description: "<u>For Dropbox Professional y Dropbox Business:</u><br />Expiration time of the shared link. Format: %Y-%m-%dT%H:%M:%SZ<br /><b>By default the link won't expire</b>",
			schema: {
				type: "date"
			},
			required: false
		}),
		ApiQuery({
			name: "require_password",
			description: "<u>For Dropbox Professional y Dropbox Business:</u><br />Boolean flag to enable or disable password protection.",
			schema: {
				type: "boolean"
			},
			required: false
		}),
		ApiQuery({
			name: "link_password",
			description: "<u>For Dropbox Professional y Dropbox Business:</u><br />If `require_password` is true, this is needed to specify the password to access the link.",
			schema: {
				type: "string"
			},
			required: false
		})
	)
}
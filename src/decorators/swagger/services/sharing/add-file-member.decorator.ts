import { applyDecorators } from "@nestjs/common"
import { ApiOperation, ApiQuery } from "@nestjs/swagger"

export function SharingAddFileMemberSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Adds specified members to a file."
		}),
		ApiQuery({
			name: "file",
			description: "File to which to add members. <b>[path - id]</b>",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "members",
			description: "Members to add. Two different ways to identify a member:<br /><b>dropbox_id:</b> Dropbox account, team member, or group ID of member.<br /><b>email:</b> Email of member.",
			schema: {
				type: "array",
				items: {
					type: "string",
					example: ""
				}
			}
		}),
		ApiQuery({
			name: "access_level",
			description: "describing what access level we want to give new members.<br /><b>Default: viewer</b>",
			schema: {
				type: "string",
				enum: ["viewer", "editor"]
			},
			required: false
		})
	)
}
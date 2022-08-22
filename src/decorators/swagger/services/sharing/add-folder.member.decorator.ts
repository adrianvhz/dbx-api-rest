import { applyDecorators } from "@nestjs/common"
import { ApiOperation, ApiQuery } from "@nestjs/swagger"

export function SharingAddFolderMemberSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Allows to add members to a shared folder."
		}),
		ApiQuery({
			name: "shared_folder_id",
			description: "The ID for the shared folder.<br /><i>pattern='[-_0-9a-zA-Z:]+'</i>",
			schema: {
				type: "string"
			}
		}),
		ApiQuery({
			name: "members",
			description: "The intended list of members to add.<br /><u>Properties:</u><br /><div>`member` Two different ways to identify a member:<br /><br /><b>dropbox_id:</b> Dropbox account, team member, or group ID of member. <u>Example</u>: dbid:AAEufNrMPSPe0dMQijRP0N_aZtBJRm26W4Q<br /><b>email:</b> Email of member. <u>Example</u>: test@example.com</div><br /><div>`access_level` Options for the level of access to grant the member to the shared folder.<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Default: viewer</b><br /><ul><li>viewer</li><li>editor</li></ul></div>",
			schema: {
				type: "array",
				items: {
					type: "object",
					properties: {
						"member": {
							type: "string",
							example: "change_me"
						},
						"access_level": {
							type: "string",
							example: "change_me"
						}
					}
				}
			}
		}),
		ApiQuery({
			name: "quiet",
			description: "Whether added members should not be notified via email and device notifications of your invite.<br /><b>Default: false</b>",
			schema: {
				type: "string"
			},
			required: false
		}),
		ApiQuery({
			name: "custom_message",
			description: "Optional message to display to added members in their invitation.",
			schema: {
				type: "string"
			},
			required: false
		})
	)
}
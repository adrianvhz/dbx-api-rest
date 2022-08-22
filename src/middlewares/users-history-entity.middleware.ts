import { Dropbox } from "dropbox";
import { IDropboxConfig } from "src/common/interfaces/IDropboxConfig";
import { UserHistorySchema } from "src/modules/users/schemas/user-history.schema";
import { UsersService } from "src/modules/users/users.service";

export function usersHistoryEntityMiddleware() {
	const schema = UserHistorySchema;

	// schema.pre("updateOne", { document: true, query: false }, async function() {
	// 	// var user = await usersService.findOne(this.user);
	// 	// console.log(user)
	// 	console.log(this)
	// 	new Dropbox({
	// 		accessToken: "sl.daskdiasjd21ind2jnd2kjd"
	// 	})
	// 		.authTokenRevoke().catch(err => console.log(err))
	// })
	return schema;
}

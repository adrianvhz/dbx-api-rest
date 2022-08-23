import { UserSchema } from "src/modules/users/schemas/user.schema";

// if (process.env.mode === "DEVELOPMENT") {}
export function usersEntityMiddleware() {
	const schema = UserSchema;

	// schema.post("remove", function(doc) {
	// 	console.log("user / user-history " + doc.user + " removed!")
	// 	usersHistoryService.delete(doc.user);
	// 	// next()
	// });

	schema.post("findOneAndUpdate", async function(doc) {
		if (!doc) return;
		console.log("user has been updated!")
		
		// /**
		// * when ["$unset"]
		// * for user field sync with user-history. `unlink_account`
		// */

		// if (this.getUpdate()["$unset"]) {
		// 	console.log(this.getQuery())
		// 	console.log(doc);
		// 	console.log(this.getUpdate())
		// 	usersHistoryService.update(doc.user, {
		// 		$set: {
		// 			status: "inactive"
		// 		},
		// 		$addToSet: {
		// 			dropbox_emails: doc.dbx_email
		// 		}
		// 	})
		// 	/** 
		// 	 * - Push to nested field - dot notation -
		// 	 * $push: {
		// 	 *   "history.dropbox_emails": "something"
		// 	 * }
		// 	 */
		// }

		/**
		* when ["$set"]
		* for user field sync with user-history. regular `update` and `modify_credentials`.
		*/
		if (this.getUpdate()["set"]) {
			var oUpdate = this.getUpdate()["$set"];
			
			if (!oUpdate) return;
			if (oUpdate.tk_acs) {
				console.log("access_token expires updated!")
				var date = new Date();
				date.setHours(date.getHours() + 4);
				doc.tk_acs_expires = date;
				doc.save();
			}

			// var oldUser = this.getQuery().user;
			// var newUser = oUpdate.user;
			// // if (oldUser !== newUser) {
			// // 	console.log("user-history has been updated!")
			// // 	await usersHistoryService.update(oldUser, { user: newUser })
			// // }
		}
	});

	// schema.post("updateOne", function() {
	// 	"middleare post updateOne()"
	// 	console.log(this.getChanges())
	// 	console.log(this.$getPopulatedDocs())
	// })

	return schema;
}

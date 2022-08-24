import { UserDoc } from "src/modules/users/schemas/user.schema";
import { Dropbox, files } from "dropbox";

declare global {
	namespace Express {
		interface User extends UserDoc {}
	
		interface Request {
			query: any
			dbx: Dropbox
		}
	}
	
	interface resultOptions {
		/**
		* Whether it should throw an error when a user is not found.
		* 
		* Default: `true`
		*/
		throwError?: boolean;
	}

	interface IQuery {
		[key: string]: string | any
	}
}

export interface FileMetada extends files.FileMetadata {
	fileBinary: string
}

import { HttpException } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
	/**
	 * Instantiate a `UserNotFoundException` Exception.
	 * ```
	 * {
	 *    "statusCode": 404,
	 *    "message": "User couldn't be found in the database!"
	 * }
	 * ```
	 * @param response Optional response parameter to replace default.
	 */
	constructor(response: string | Record<string, any> = "User couldn't be found in the database!") {
		super(response, 404);
	}
}

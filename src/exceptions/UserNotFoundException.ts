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
		super({
			statusCode: 404,
			name: UserNotFoundException.name,
			error: response,
			timestamp: new Date().toISOString()
		}, 404);
	}
}

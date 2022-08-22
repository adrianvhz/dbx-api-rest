import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";

export function RefreshDbxTokenSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Manual refresh dropbox access_token and save it to the database."
		}),
		ApiConsumes(
			"application/x-www-form-urlencoded",
			"application/json"
		),
		ApiBody({
			schema: {
				type: "object",
				properties: {
					"user": {
						type: "string"
					}
				}
			},
			required: true
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "Successful operation!"
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: "Error: Bad Request",
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: "Error: Unauthorized",
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: "Error: Not Found"
		})
	)
}

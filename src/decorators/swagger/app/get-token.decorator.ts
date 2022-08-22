import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";

export function GetTokenSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Obtain a token with credentials, they can be provided in the authorization header or in the body."
		}),
		ApiConsumes(
			"application/x-www-form-urlencoded",
			"application/json"
		),
		ApiBody({
			schema: {
					type: "object",
					properties: {  // @ApiProperty() can be used in dto i guess.
						"client_key": {
							type: "string"
						},
						"client_secret": {
							type: "string"
						}
					}
			},
			required: false
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



/**  content: {
    "application/json": {
        schema: {
        properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImNsaWVudF9rZXkiOiJkZDMwZWY0ODA5Yzc1MmNkIiwiaWF0IjoxNjYwMTc1NjEyLCJleHAiOjE2NjE0NzE2MTJ9.4_xPvyJFGlHhdwV5RB_BJHAYez62Acx_hAOIsDvM780" }
        }
        }
    },
    "application/xml": {
        schema: {
        properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkqXVCJ9.eyJ1c2VyIjoidGVzdCIsImNsaWVudF9rZXkiOiJkZDMwZWY0ODA5Yzc1MmNkIiwiaWF0IjoxNjYwMTc1NjEyLCJleHAiOjE2NjE0NzE2MTJ9.4_xPvyJFGlHhdwV5RB_BJHAYez62Acx_hAOIsDvM780" }
        },
        xml: {
            name: "response"
        }
        }
    }
    } */
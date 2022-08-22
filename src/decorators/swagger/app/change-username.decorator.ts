import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";

export function ModifyCredentialsSwagger() {
    return applyDecorators(
        ApiConsumes(
            "application/x-www-form-urlencoded",
            "application/json", "application/xml"
        ),
        ApiBody({
            schema: {
                type: "object",
                properties: {
                    "user": {
                        type: "string"
                    },
                    "new_user_name": {
                        type: "string"
                    },
                    "client_key": {
                        type: "string"
                    },
                    "client_secret": {
                        type: "string"
                    }
                },
                required: ["user"],
                xml: {
                    name: "body",

                }
            }
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

// The new username to replace the existing one.

// The user to modify.
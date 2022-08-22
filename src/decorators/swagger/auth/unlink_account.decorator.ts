import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";

export function UnlinkAccountSwagger() {
    return applyDecorators(
        ApiOperation({
            description: "Unlink account"
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: "Successful operation!"
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: "Error: Bad Request"
        }),
        ApiConsumes(
            "application/x-www-form-urlencoded",
            "application/json"
        ),
        ApiBody({
            schema: {
                type: "object",
                properties: {
                    user: {
                        type: "string"
                    }
                }
            },
            required: false   
        })
    )
}
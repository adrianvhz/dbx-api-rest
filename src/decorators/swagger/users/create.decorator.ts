import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, getSchemaPath } from "@nestjs/swagger";

export function UserCreateSwagger() {
    return applyDecorators(
        ApiOperation({ summary: "Create user" }),
        ApiBody({
          schema: {
            type: "object",
            $ref: getSchemaPath("CreateUserDto"),
          }
        }),
        ApiResponse({ status: 201, description: "Successful operation! (User has been created)." }),
        ApiResponse({ status: 400, description: "Error: Bad Request" }),
        ApiResponse({ status: 401, description: "Error: Unauthorized" })
    )
}
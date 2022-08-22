import { applyDecorators } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"

export function UsersFindOneSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: "Get user"
        })
    )
}
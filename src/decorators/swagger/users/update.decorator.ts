import { applyDecorators } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"

export function UsersUpdateSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: "Update user"
        })
    )
}
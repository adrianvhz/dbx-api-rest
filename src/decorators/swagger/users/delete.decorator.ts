import { applyDecorators } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"

export function UsersDeleteSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: "Delete user"
        })
    )
}
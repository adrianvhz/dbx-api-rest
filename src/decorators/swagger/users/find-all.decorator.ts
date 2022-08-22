import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

export function UsersFindAllSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: "Get all users"
        }),
        ApiResponse({
            status: 400,
            description: "Error: Bad Request"
        }),
        ApiResponse({
            status: 200,
            description: "Successful operation!"
        }),
        ApiResponse({
            status: 401,
            description: "Error: Unauthorized"
        }),
        ApiQuery({
            name: "history",
            description: "Obtener el registro del usuario.<br /><b>Default: false</b>",
            schema: {
                type: "boolean",
                default: false
            },
            required: false
        })
    )
}




  // content: {
    //   "application/json": {
      //     schema: {
        //       type: "array",
        //       items: {
          //         oneOf: [
            //           { $ref: getSchemaPath(UserDocDto) },
            //           { $ref: getSchemaPath(UserDocDto) }
            //         ]
            //       }
            //     }
    //   }
    // }
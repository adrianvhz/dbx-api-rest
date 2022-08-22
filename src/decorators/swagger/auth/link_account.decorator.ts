import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";

export function LinkAccountSwagger() {
	return applyDecorators(
		ApiOperation({
			description: "Link account"
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "Successful operation!"
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: "Successful operation! (User has been created).",
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
						},
						domain: {
							type: "string"
						}
					}
			},
			required: false   
		})
	)
}


/** @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful operation! <br /><b>This is an example response.</b><br />To get your credentials use the <a href='https://dbx-api-app.herokuapp.com/'>main page.</a>",
    content: {
      "application/json": {
        schema: {
          properties: {
            "token": { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImNsaWVudF9rZXkiOiJkZDMwZWY0ODA5Yzc1MmNkIiwiaWF0IjoxNjYwMjI4OTY3LCJleHAiOjE2NjE1MjQ5Njd9.xCEFKGiqb0f4EUtFFzPGI89So6Q7d98Mz4Jb7GMPJgI" },
            "credentials": { type: "string", example: "Zm9vYmFyOmZvb2Jhcg==" }
          }
        }
      },
      "application/xml": {
        schema: {
          properties: {
            "token": { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImNsaWVudF9rZXkiOiJkZDMwZWY0ODA5Yzc1MmNkIiwiaWF0IjoxNjYwMjI4OTY3LCJleHAiOjE2NjE1MjQ5Njd9.xCEFKGiqb0f4EUtFFzPGI89So6Q7d98Mz4Jb7GMPJgI" },
            "credentials": { type: "string", example: "Zm9vYmFyOmZvb2Jhcg==" }
          },
          xml: {
            name: "response"
          }
        }
      }
    }
  })*/
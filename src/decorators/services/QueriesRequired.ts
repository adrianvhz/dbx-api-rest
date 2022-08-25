import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { isURL } from 'class-validator'

export const QueriesRequired = createParamDecorator<string[]>((keys, ctx: ExecutionContext) => {
	var request = ctx.switchToHttp().getRequest()
	
	if (request.query.url && request.query.url)
	for (var i = 0; i < keys.length; i++) {
		if (!request.query[keys[i]]) {
			throw new BadRequestException("The query param '" + keys[i] + "' is required.")
		}
	}
	return request.query
})

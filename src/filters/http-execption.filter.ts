import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { DropboxResponseError } from 'dropbox';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: DropboxResponseError<any>, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.status;
		
		console.log("se entro en http-exception-filter")
		response
		  .status(status)
		  .json({
				statusCode: status,
				error: exception.error,
				timestamp: new Date().toISOString(),
		  });
	}
}

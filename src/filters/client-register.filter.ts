import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { DropboxResponseError } from 'dropbox';
import { Request, Response } from 'express';

@Catch()
export class ClientRegisterFilter implements ExceptionFilter {
	catch(exception: DropboxResponseError<any> & Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.status || HttpStatus.BAD_REQUEST

		response.status(status).json({
			statusCode: status,
			name: exception.name,
			error: exception.error,
			message: exception.message,
			timestamp: new Date().toISOString()
		});
	}
}

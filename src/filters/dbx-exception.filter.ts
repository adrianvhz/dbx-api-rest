import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { DropboxResponseError } from 'dropbox';
import { Request, Response } from 'express';

@Catch()
export class DbxExceptionFilter implements ExceptionFilter {
	catch(exception: DropboxResponseError<any> & { name: string, message: string }, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.status;
		const errResponse = (status: number, error: any) => 
			response.status(status).json({
			statusCode: status,
			error: error,
			timestamp: new Date().toISOString()
		});
		
		console.log("se entro en http-exception-filter");

		if (exception.name === "DropboxResponseError") {
			errResponse(exception.status, exception.error || exception)
		}
		else {
			errResponse(400, exception.message);
		}
	}
}

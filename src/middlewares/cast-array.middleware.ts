import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CastArrayMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		var { query: { file_categories, file_extensions } }: IQuery = req;
		
		if (req.path.endsWith("/files/search")) {
			if (file_categories && !Array.isArray(file_categories)) {
				req.query.file_categories = new Array(file_categories) as string[];
			}
			if (file_extensions && !Array.isArray(file_extensions)) {
				req.query.file_extensions = new Array(file_extensions) as string[];
			}
		}
		if (req.path.endsWith("/sharing/add_file_member")) {

		}
		next();
	}
}

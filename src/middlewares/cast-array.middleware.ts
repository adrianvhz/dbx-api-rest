import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CastArrayMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		var { query: { file_categories, file_extensions, members } }: IQuery = req;
		
		if (req.path.endsWith("/files/search")) {
			if (file_categories && !Array.isArray(file_categories)) {
				req.query.file_categories = new Array(file_categories);
			}
			if (file_extensions && !Array.isArray(file_extensions)) {
				req.query.file_extensions = new Array(file_extensions);
			}
		}
		else if (req.path.endsWith("/sharing/add_file_member") || req.path.endsWith("/sharing/add_folder_member")) {
			if (members && !Array.isArray(members)) {
				req.query.members = new Array(members);
			}
		}
		next();
	}
}

import { Injectable, HttpException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Buffer } from "buffer"
import * as fs from 'fs';
import * as path from 'path';
import * as mime from "mime/lite"
import stream from "stream"
import { Dropbox } from 'dropbox';
import { getFileNameFromUrl } from 'src/lib/getFileNameFromUrl';
import { isURL } from 'class-validator';
import type { Request, Response } from "express";

@Injectable()
export class ServicesService {
	query: (req: Request) => any

	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService
	) {}

	async filesListFolder(dbx: Dropbox, query: IQuery) {
		var files = await dbx.filesListFolder({
			path: query.path ? query.path : "",
			recursive: query.recursive && query.recursive === "true",
			limit: query.limit && +query.limit
		});

		return files.result;
	}

	async filesListFolderContinue(dbx: Dropbox, query: IQuery) {
		var files = await dbx.filesListFolderContinue({ cursor: query.cursor });

		return files.result;
	}

	// here 22:25 -DELETE
	async filesSearch(dbx: Dropbox, query: IQuery) {
		var files = await dbx.filesSearchV2({
			query: query.query,
			options: {
				path: query.path , 
				max_results: query.max_results && +query.max_results,
				order_by: query.order_by && {
					".tag": query.order_by
				},
				filename_only: query.filename_only && query.filename_only === "true",
				file_categories: query.file_categories && query.file_categories.map((el: string) => ({ ".tag": el })),
				file_extensions: query.file_extensions
			}
		});

		return files.result
	}

	async filesGetMetadata(dbx: Dropbox, query: IQuery) {
		var files = await dbx.filesGetMetadata({
			path: query.path
		});

		return files.result
	}

	async getFilePreview(req: Request, res: Response) {
		try {
			req.dbx.filesDownload({
				path: req.query.path as string 
			}) // @ts-ignore
				.then(({ result: { fileBinary, ...fileData } }) => {
					res.header({
						"dbx-api-app-response": JSON.stringify(fileData),
						"Content-Type": mime.getType(fileData.name),
						"Content-Length": fileBinary.byteLength  // esto era el problema, la cantidad de bytes en string base64 no son las mismas que en binary (or buffer)
					});
					res.end(fileBinary);
				})
				.catch(error => {
					res.status(error.status).json({
						statusCode: error.status,
						message: error.error
					})
				})
		}
		catch (e) {
			res.status(e.status).json({
				statusCode: e.status,
				message: e.error
			})
		}
	}

	async getFileToDownload(req: Request, res: Response) {
		try {
			 // @ts-ignore
			const { fileBinary, ...fileData } = (
				await req.dbx.filesDownload({
					path: req.query.path as string
				})
			).result;
			res.header({
				"dbx-api-app-response": JSON.stringify(fileData),
				"Content-Type": "image/jpeg",
				"Content-Length": fileBinary.byteLength,
				"Content-Disposition": `attachment; filename=${fileData.name}`, 
			});
			res.end(fileBinary)
		}
		catch (e) {
			res.status(e.status).json({
				statusCode: e.status,
				message: e.error
			})
		}
	}


	async getFolderToDownloadZip(req: Request, res: Response) {
		try {
			const folder = (
				await req.dbx.filesDownloadZip({
					path: req.query.path as string
				})
			).result;
			res.header({
				"Content-Type": "application/zip", // @ts-ignore
				"Content-Length": folder.fileBinary.byteLength,
				"Content-Disposition": `attachment; filename=${folder.metadata.name}.zip`, 
			});
			// @ts-ignore
			res.end(folder.fileBinary)
		}
		catch (e) {
			res.status(e.status).json({
				statusCode: e.status,
				message: e.error
			})
		}
	}

	async uploadFile(req: Request, query: IQuery) { 
		/**
		* With content-type = multipart-form-data
		* Body: 
		*   - file: ...   (the binary file to upload)
		*/
		if (req.headers['content-type'] && req.headers['content-type'].startsWith("multipart/form-data")) {
			console.log(req.file)
			if (!req.file) throw new HttpException("You must provide a 'file' field and it must be a file (binary data).", 400);

			var result = await req.dbx.filesUpload({ // @ts-ignore
				path: query.path ? ((req.query as any).path.includes(".") ? query.path : `${query.path}/${req.file.originalname}`) : `/${req.file.originalname}`, // @ts-ignore
				mode: query.mode && {
					".tag": query.mode
				},
				autorename: query.autorename && query.autorename === "true",
				contents: req.file.buffer
			})

			return result.result
		}

		throw new HttpException("Content-Type Header must be multipart/form-data", 400)
		/**
		* With binary file. (content type = application/octet-stream)
		* 
		* Note:
		*   - A complete path is required (with file name).
		*		 For example:
		*			[✔] /documents/image.jpg
		*			[X] /documents
		*/
		
		/** PENDING */

		// else if (req.headers['content-type']) {
		// 	var length = 0;
		// 	var file = [];
		// 	var filename = req.query.filename;

		// 	req.on("data", (chunk) => {
		// 		length += chunk.byteLength
		// 		file.push(chunk)
		// 	});

		// 	req.on("end", () => {
		// 		req.dbx.filesUpload({
		// 			// @ts-ignore
		// 			path: query.path ? (query.path.includes(".") ? query.path : `${query.path}/${req.file.originalname}`) : `/${req.file.originalname}`,
		// 			mode: query.mode && {
		// 				".tag": query.mode
		// 			},
		// 			autorename: query.autorename && query.autorename === "true",
		// 			contents: file
		// 		})
		// 	})

		// 	return sdf
		// }
	}

	async filesUploadFileFromUrl(dbx: Dropbox, query: IQuery) {
		if (!isURL(query.url)) throw new HttpException("The url parameter is not a url.", 400);

		var filename = getFileNameFromUrl(query.url);
		var fileMetadata = await dbx.filesSaveUrl({
			path: query.path ? (query.path.includes(".") ? query.path : `${query.path}/${filename}`) : `/${filename}`,
			url: query.url
		});

		return fileMetadata.result;
	}

	async filesCopy(dbx: Dropbox, query: IQuery) {
		var result = await dbx.filesCopyV2({
			from_path: query.from_path,
			to_path: query.to_path,
			autorename: query.autorename && query.autorename === "true"
		});

		return result.result.metadata;
	}

	async filesMove(dbx: Dropbox, query: IQuery) {
		var result = await dbx.filesMoveV2({
			from_path: query.from_path,
			to_path: query.to_path,
			autorename: query.autorename && query.autorename === "true"
		});

		return result.result.metadata;
	}

	async filesDelete(dbx: Dropbox, query: IQuery) {
		var result = await dbx.filesDeleteV2({
			path: query.path
		});

		return result.result.metadata;
	}

	async filesGetThumbnail(dbx: Dropbox, query: IQuery) {
		var result = await dbx.filesGetThumbnailV2({
			// resource: {".tag": "path", path: ""},
			resource: {".tag": "link", url: "", path: ""}, // when .tag="link" and url is a folder shared_link, is required "path".
			format: query.format && {
				".tag": query.format  // "jpg" | "png"
			},
			mode: query.mode && {
				".tag": query.mode
			},
			size: query.size && {
				".tag": query.size
			}
		})

		return result.result;
	}

	async sharingCreateSharedLink(req: Request, res: Response) {
		const settings: any = {
			access: req.query.access && {
					".tag": req.query.access
			},
			audience: req.query.audience && {
					".tag": req.query.audience
			},
			allow_download: req.query.allow_download && req.query.allow_download === "true",
			require_password: req.query.require_password && req.query.require_password === "true",
			link_password: req.query.link_password as string,
			expires: req.query.expires as string
		}
		
		try {
			res.status(201).json(
				(
					await req.dbx.sharingCreateSharedLinkWithSettings({
						path: req.query.path as string,
						settings
					})
				).result
			)
		}
		catch (e) {
			if (e.error.error.settings_error) {
				throw new HttpException(e.error, e.status)
			}

			try {
				var url = (await req.dbx.sharingListSharedLinks({
					path: req.query.path as string,
					direct_only: true
				})).result.links[0].url;
				
				res.status(201).json(
					(
						await req.dbx.sharingModifySharedLinkSettings({
							url,
							settings
						})
					).result
				)
			}
			catch (e) {
				throw new HttpException(e.error, e.status);
			}
		}
	}

	async sharingModifySharedLink(dbx: Dropbox, query: IQuery) {
		var result = await dbx.sharingModifySharedLinkSettings({
			url: query.url,
			settings: {
				access: query.access && {
					".tag": query.access
				},
				audience: query.audience && {
					".tag": query.audience
				},
				allow_download: query.allow_download && query.allow_download === "true",
				require_password: query.require_password && query.require_password === "true",
				link_password: query.link_password as string,
				expires: query.expires as string
			}
		});

		return result.result;
	}
		
	async sharingAddFileMember(dbx: Dropbox, query: IQuery) {
		var result = await dbx.sharingAddFileMember({
			file: query.file,
			access_level: query.access_level && {
				".tag": query.access_level
			},
			members: query.members.map((el: string) => {
				var isId = el.startsWith("id:");
				return {
					".tag": isId ? "dropbox_id" : "email",
					[isId ? "dropbox_id" : "email"]: el
				}
			})
		})

		return result.result;
	}

	async sharingAddFolderMember(dbx: Dropbox, query: IQuery) {
		await dbx.sharingAddFolderMember({
			shared_folder_id: query.shared_folder_id as string, // @ts-ignore
			members: query.members.map((object: any) => {
				const { member: memberSelector, access_level } = JSON.parse(object);
				var isId = memberSelector.startsWith("id:")
				return {
					access_level: {
						".tag": access_level
					},
					member: {
						".tag": isId ? "dropbox_id" : "email",
						[isId ? "dropbox_id" : "email"]: memberSelector
					}
				}
			}),
			quiet: query.quiet && query.quiet === "true",
			custom_message: query.custom_message as string
		});

		return {
			statusCode: 201,
			message: "Successful operation!"
		}
	}

	async sharingListSharedLinks(dbx: Dropbox, query: IQuery) {
		var links = (await dbx.sharingListSharedLinks({
			path: query.path,
			direct_only: query.direct_only ? query.direct_only === "true" : true
		})).result;
			
		if (links.links.length === 1) {
			return {
				content_url: links.links[0].url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", ""),
				...links.links[0]
			}
		}
		else if (links.links.length === 0) {
			return {
				links: "There are no shared links for this file or folder."
			}
		}
		else {
			return links
		}
	}

	async sharingListFolders(dbx: Dropbox, query: IQuery) {
		var folders = await dbx.sharingListFolders({
			limit: query.limit && +query.limit
		});

		return folders.result;
	}




	// Incoming message
	// async test(req: Request, res: Response) {
	// 	try {
	// 		// fs.writeFile()
	// 		var video = "";
	// 		var videoStream = fs.createReadStream(__dirname + "\\video.mp4")
	// 		videoStream.on("data", (chunk) => {
	// 				video += chunk.toString("base64");
	// 		})
	// 		videoStream.on("end", () => {
	// 				var buffer = new Uint8Array(Buffer.from(video, "base64"))
	// 				res.header({
	// 					"Content-Type": "video/mp4",
	// 					"Content-Length": buffer.length
	// 				});
	// 				res.end(buffer);
	// 		})
			
			
	// 		// res.sendFile(__dirname + "\\video.mp4")
	// 	}
	// 	catch (e) {
	// 		console.log(e)
	// 		throw new HttpException(e.error, e.status)
	// 	}
	// }
}

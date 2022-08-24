import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Buffer } from "buffer"
import * as fs from 'fs';
import * as path from 'path';
import * as mime from "mime/lite"
import stream from "stream"
import type { Request, Response } from "express";
import { Dropbox } from 'dropbox';

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

		return files.result.entries;
	}

	// here 22:25 -DELETE
	async filesSearch(dbx: Dropbox, query: IQuery) {
		if (query.file_extensions && !Array.isArray(query.file_extensions)) {
			query.file_extensions = new Array(query.file_extensions);
		}
		var files = await dbx.filesSearchV2({
			query: query.query,
			options: {
				path: query.path , 
				max_results: query.max_results && +query.max_results,
				order_by: query.order_by && {
					".tag": query.order_by
				},
				// file_categories: req.query.file_categories && (req.query.file_categories as any).map((el: string) => {
				//     return {
				//         ".tag": el
				//     }
				// }),
				filename_only: query.filename_only && query.filename_only === "true",
				file_extensions: query.file_extensions && query.file_extensions
			}
		});

		return files.result
	}

	async filesGetMetadata(req: Request) {
		return (
			await req.dbx.filesGetMetadata({
				path: req.query.path as string
			})
		).result
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

	uploadFile(req: Request, res: Response) { 
		/**
		* With multipart-form-data
		* file name: file
		*/
		if (req.headers['content-type'].startsWith("multipart/form-data")) {
			if (!req.file) {
				throw new BadRequestException("Bad Request", "File missing!");
			}
			req.dbx.filesUpload({
				path: req.query.path ? req.query.path + "/" + req.file.originalname : "/" + req.file.originalname, // @ts-ignore
				mode: req.query.mode && {
					".tag": req.query.mode
				},
				autorename: req.query.autorename && req.query.autorename === "true",
				contents: req.file.buffer
			})
				.then(result => {
					res.status(200).json(result.result)
				})
				.catch(e => {
					res.status(e.status).json({
						statusCode: e.status,
						message: e.error
					})
				})
		}
		/**
		* With binary file alone.
		*/
		else {
			var length = 0;
			var file = [];
			req.on("data", (chunk) => {
					length += chunk.byteLength
					file.push(chunk)
			})
			req.on("end", () => {
					res.writeHead(200, {
						"Content-Type": "image/png",
						"Content-Length": length
					})
					res.end(Buffer.concat(file, length));

					req.dbx.filesUpload({
						path: req.query.path ? req.query.path + "/" + "test.jpg" : "/" + "test.jpg",
						mode: { ".tag": "overwrite" } ,
						contents: file,
					})
						.then(result => {
							res.status(200).json(result.result)
						})
						.catch(e => {
							res.status(e.status).json({
								statusCode: e.status,
								message: e.error
							})
						})
			})
		}
	}

	async filesUploadFileFromUrl(req: Request) {
		const filename = path.basename(req.query.url as string);
		return (
			await req.dbx.filesSaveUrl({
				path: req.query.path ? req.query.path as string : `/${filename}`,
				url: req.query.url as string
			})
		).result;
	}

	// also check copy_reference/get-save
	async filesCopy(req: Request) {
		return (
			await req.dbx.filesCopyV2({
				from_path: req.query.from_path as string,
				to_path: req.query.to_path as string,
				autorename: req.query.autorename && req.query.autorename === "true"
			})
		)
	}

	async filesMove(req: Request) {
		return (
			await req.dbx.filesMoveV2({
				from_path: req.query.from_path as string,
				to_path: req.query.to_path as string,
				autorename: req.query.autorename && req.query.autorename === "true"
			})
		)
	}

	async filesDelete(req: Request) {
		return (
			await req.dbx.filesDeleteV2({
				path: req.query.path as string
			})
		)
	}

	async filesGetThumbnail(req: Request) {
		return (
			await req.dbx.filesGetThumbnailV2({
				resource: req.query.resource && {
					".tag": "path",
					path: ""
				},
				format: req.query.format && {
					".tag": "jpeg"
				},
				mode: req.query.mode && {
					".tag": "bestfit"
				},
				size: req.query.mode && {
					".tag": "w1024h768"
				}
			})
		)
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

	async sharingModifySharedLink(req: Request) {
		return (
			await req.dbx.sharingModifySharedLinkSettings({
				url: req.query.url as string,
				settings: { // @ts-ignore
					access: req.query.access && {
						".tag": req.query.access
					}, // @ts-ignore
					audience: req.query.audience && {
						".tag": req.query.audience
					},
					allow_download: req.query.allow_download && req.query.allow_download === "true",
					require_password: req.query.require_password && req.query.require_password === "true",
					link_password: req.query.link_password as string,
					expires: req.query.expires as string
				}
			})
		).result
	}
		
	async sharingAddFileMember(req: Request) {
		if (req.query.members && !Array.isArray(req.query.members)) {
			req.query.members = new Array(req.query.members as any);
		}

		return (
			await req.dbx.sharingAddFileMember({
				file: req.query.file as string, // @ts-ignore
				access_level: req.query.access_level && {
					".tag": req.query.access_level
				}, // @ts-ignore
				members: req.query.members.map((el: string) => {
					var isId = el.startsWith("id:");
					return {
						".tag": isId ? "dropbox_id" : "email",
						[isId ? "dropbox_id" : "email"]: el
					}
				})
			})
		).result
	}

	async sharingAddFolderMember(req: Request) {
		if (req.query.members && !Array.isArray(req.query.members)) {
			req.query.members = new Array(req.query.members as any);
		}
		
		await req.dbx.sharingAddFolderMember({
			shared_folder_id: req.query.shared_folder_id as string, // @ts-ignore
			members: req.query.members.map((object: any) => {
				const { member: memberSelector, access_level } = JSON.parse(object);
				var isId = memberSelector.startsWith("id:")
				console.log(memberSelector, access_level)
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
			quiet: req.query.quiet && req.query.quiet === "true",
			custom_message: req.query.custom_message as string
		})
		return "Successful operation!"
	}

	async sharingListSharedLinks(req: Request) {
		const links = (
			await req.dbx.sharingListSharedLinks({
				path: req.query.path as string,
				direct_only: req.query.direct_only && req.query.direct_only === "true"
			})
		).result
		if (links.links.length === 1) {
				return {
					content_url: links.links[0].url.replace("www.req.dbx.com", "dl.dropboxusercontent.com").replace("?dl=0", ""),
					...links.links[0]
				}
		} else if (links.links.length === 0) {
			return {
				links: "There are no shared links for this file or folder."
			}
		} else {
			return links.links
		}
	}

	async sharingListFolders(req: Request) {
		const folder = (await req.dbx.sharingListFolders({
				limit: req.query.limit && +req.query.limit
		})).result
		return folder;
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

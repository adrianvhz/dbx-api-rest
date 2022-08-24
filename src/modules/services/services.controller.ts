import { Controller, Post, Get, Req, Res, Patch, Delete, UseFilters, HttpAdapterHost } from "@nestjs/common";
import { ApiHideProperty, ApiParam, ApiTags } from "@nestjs/swagger";
import { ServicesService } from "./services.service";
import { ServicesAuth } from "src/decorators/authorization/services-auth.decorator";
import {
	FilesListFolderSwagger,
	FilesSearchSwagger,
	FilesGetMetadataSwagger,
	FilesDownloadSwagger,
	FilesDownloadFolderSwagger,
	FilesUploadSwagger,
	FilesUploadFromUrlSwagger,
	FilesGetPreviewSwagger,
	FilesGetThumbnailSwagger,
	FilesCopySwagger,
	FilesMoveSwagger,
	FilesDeleteSwagger } from "src/decorators/swagger/services/files";
import {
	SharingCreateSharedLinkSwagger,
	SharingModifySharedLinkSwagger,
	SharingAddFileMemberSwagger,
	SharingAddFolderMemberSwagger,
	SharingListSharedLinksSwagger,
	SharingListFoldersSwagger } from "src/decorators/swagger/services/sharing";
import type { Request, Response } from "express"
import { DbxExceptionFilter } from "src/filters/dbx-exception.filter";

@ApiTags("services")
@ServicesAuth()
@UseFilters(DbxExceptionFilter)
@Controller()
export class ServicesController {
	constructor(
		private readonly servicesServices: ServicesService
	) {}

	/** FILES */
	@FilesListFolderSwagger()
	@Get(":user/files/list_folder")
	async filesListFolder(@Req() req: Request) {
		return this.servicesServices.filesListFolder(req.dbx, req.query as IQuery);
	}

	@FilesSearchSwagger()
	@Get(":user/files/search")
	async filesSearch(@Req() req: Request) {
		return this.servicesServices.filesSearch(req.dbx, req.query as IQuery);
	}

	@FilesGetMetadataSwagger()
	@Get(":user/files/get_metadata")
	async filesGetMetadata(@Req() req: Request) {
		return this.servicesServices.filesGetMetadata(req.dbx, req.query as IQuery);
	}

	@FilesGetPreviewSwagger()
	@Get(":user/files/get_preview")
	async getFilePreview(@Req() req: Request, @Res() res: Response) {
		this.servicesServices.getFilePreview(req, res);
	}

	@FilesDownloadSwagger()
	@Get(":user/files/download")
	async fileToDownload(@Req() req: Request, @Res() res: Response) {
		this.servicesServices.getFileToDownload(req, res);
	}

	@FilesDownloadFolderSwagger()
	@Get(":user/files/download_folder")
	async folderToDownloadZip(@Req() req: Request, @Res() res: Response) {
		this.servicesServices.getFolderToDownloadZip(req, res);
	}

	@FilesUploadSwagger()
	@Post(":user/files/upload")
	async uploadFile(@Req() req: Request, @Res() res: Response) {
		this.servicesServices.uploadFile(req, res);
	}

	@FilesUploadFromUrlSwagger()
	@Post(":user/files/upload_from_url")
	async filesUploadFileFromUrl(@Req() req: Request) {
		return this.servicesServices.filesUploadFileFromUrl(req.dbx, req.query as IQuery);
	}

	@FilesCopySwagger()
	@Post(":user/files/copy")
	async copyFiles(@Req() req: Request) {
		return this.servicesServices.filesCopy(req.dbx, req.query as IQuery);
	}

	@FilesMoveSwagger()
	@Post(":user/files/move")
	async moveFiles(@Req() req: Request) {
		return this.servicesServices.filesMove(req.dbx, req.query as IQuery);
	}

	@FilesDeleteSwagger()
	@Delete(":user/files/delete")
	async filesDelete(@Req() req: Request) {
		return this.servicesServices.filesDelete(req.dbx, req.query as IQuery);
	}

	@FilesGetThumbnailSwagger()
	@Get(":user/files/get_thumbnail")
	async filesGetThumbnail(@Req() req: Request) {
		return this.servicesServices.filesGetThumbnail(req.dbx, req.query as IQuery);
	}

	/** SHARING */
	@SharingCreateSharedLinkSwagger()
	@Post(":user/sharing/create_shared_link")
	async sharingCreateSharedLink(@Req() req: Request, @Res() res: Response) {
		return this.servicesServices.sharingCreateSharedLink(req, res)
	}

	@SharingModifySharedLinkSwagger()
	@Patch(":user/sharing/modify_shared_link")
	async sharingModifySharedLink(@Req() req: Request) {
		return this.servicesServices.sharingModifySharedLink(req.dbx, req.query as IQuery);
	}

	@SharingAddFileMemberSwagger()
	@Post(":user/sharing/add_file_member")
	async sharingAddFileMember(@Req() req: Request) {
		return this.servicesServices.sharingAddFileMember(req.dbx, req.query as IQuery)
	}

	@SharingAddFolderMemberSwagger()
	@Post(":user/sharing/add_folder_member")
	async sharingAddFolderMember(@Req() req: Request) {
		return this.servicesServices.sharingAddFolderMember(req.dbx, req.query as IQuery)
	}

	@SharingListSharedLinksSwagger()
	@Get(":user/sharing/list_shared_links")
	async sharingListSharedLinks(@Req() req: Request) {
		return this.servicesServices.sharingListSharedLinks(req.dbx, req.query as IQuery);
	}

	@SharingListFoldersSwagger()
	@Get(":user/sharing/list_folders")
	async sharingFolders(@Req() req: Request) {
		return this.servicesServices.sharingListFolders(req.dbx, req.query as IQuery);
	}



	// @ApiExcludeEndpoint()
	// @Get("test")
	// test(@Req() req: Request, @Res() res: Response) {
	// 	return this.servicesServices.test(req, res);
	// }

	// @Get("test")
	// async test(@Req() req: Request) {
	//   const { user, folder } = req.query;
	//   const response = await fetch(`http://localhost:3000/${user}/files/${folder || ""}`, {
	//     method: "GET",
	//     headers: {
	//       "Authorization": "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRyaWFuIiwiY2xpZW50X2tleSI6ImRkMzBlZjQ4MDljNzUyY2QiLCJpYXQiOjE2NTk5OTE1NzUsImV4cCI6MTY2MDg1NTU3NSwiaXNzIjoiZGJ4LWFwaSJ9.HLNYSwcaf4QkGA3ZCuJueoQmKucRCAsqP4qmPVS5HJ8",
	//     }
	//   })
	//   const data = await response.json();
	//   return data;
	// }

	// @Get("test-download")
	// async testDownload(@Req() req: Request, @Res() res: Response) {
	//   const { user } = req.query;
	//   const data = await fetch(`http://localhost:3000/${user}/download`, {
	//     method: "GET"
	//   })
	//   const buffer = await data.buffer();
	//   res.setHeader("Content-Type", "image/jpg")
	//   res.setHeader("Content-Disposition", `attachment; filename=gatico.jpg`);
	//   res.setHeader("Content-Length", buffer.length);
	//   res.end(buffer)
	// }
}

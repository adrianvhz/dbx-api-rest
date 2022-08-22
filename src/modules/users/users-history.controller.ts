import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersAuth } from 'src/decorators/authorization/users-auth.decorator';
import { UsersHistoryService } from './users-history.service';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';

@UsersAuth()
@ApiTags("manage users-history")
@Controller('users-history')
export class UsersHistoryController {
	constructor(
		private readonly usersHistoryService: UsersHistoryService
	) {}

	@Get()
	async getAllUsersHistory() {
		return this.usersHistoryService.findAll()
	}

	@Get(":user")
	async getsUserHistory(@Param("user") user: string) {
		return this.usersHistoryService.findOne(user)
	}

	@Post()
	async createUserHistory(@Body() createUserHistoryDto: CreateUserHistoryDto) {
		return {
			tip: "Beware, a user-history should not be created directly, it can cause problems with other records related to existing users.",
			response: await this.usersHistoryService.create(createUserHistoryDto)
		}
	}

	@Patch(":user")
	async updateUserHistory(@Param("user") user: string, @Body() updateUserHistoryDto: UpdateUserHistoryDto) {
		return this.usersHistoryService.update(user, updateUserHistoryDto);
	}

	@Delete(':user')
	deleteUserHistory(@Param("user") user: string) {
		return this.usersHistoryService.delete(user);
	}
}

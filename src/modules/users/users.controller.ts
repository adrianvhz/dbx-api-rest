import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersAuth } from 'src/decorators/authorization/users-auth.decorator';
import {
   UsersFindAllSwagger,
   UsersFindOneSwagger,
   UserCreateSwagger,
   UsersUpdateSwagger,
   UsersDeleteSwagger } from "src/decorators/swagger/users";


@UsersAuth()
@ApiTags("manage users")
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) {}

	@UsersFindAllSwagger()
	@Get()
	findAllUsers(@Query("history") history: string) {
		return this.usersService.findAll(history && history === "true");
	}

	@UsersFindOneSwagger()
	@Get(':user')
	findOneUser(@Param("user") user: string, @Query("history") history: string) {
		return this.usersService.findOne(user, { history: history && history === "true" });
	}

	@UserCreateSwagger()
	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@UsersUpdateSwagger()
	@Patch(":user")
	updateUser(@Param("user") user: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(user, updateUserDto);
	}

	@UsersDeleteSwagger()
	@Delete(":user")
	deleteUser(@Param("user") user: string) {
		return this.usersService.delete(user);
	}
}

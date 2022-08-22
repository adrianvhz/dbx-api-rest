import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from "mongoose";
import { UserHistory, UserHistoryDoc } from "./schemas/user-history.schema";
import { UpdateUserHistoryDto } from "./dto/update-user-history.dto";
import { CreateUserHistoryDto } from "./dto/create-user-history.dto";
import { UserNotFoundException } from "src/exceptions/UserNotFoundException";
import { UserHistoryAlreadyExistsException } from "src/exceptions/UserHistoryAlreadyExistsException";

@Injectable()
export class UsersHistoryService {
	constructor(
		@InjectModel(UserHistory.name) private userHistoryModel: Model<UserHistoryDoc>
	) {}

	async findAll(): Promise<UserHistoryDoc[]> {
		return await this.userHistoryModel.find();
	}

	async findOne(user: string): Promise<UserHistoryDoc> | never {
		var userHistory = await this.userHistoryModel.findOne({ user });
		if (!userHistory) throw new UserNotFoundException();
		return userHistory;
	}

	async create(createUserHistoryDto: CreateUserHistoryDto): Promise<UserHistoryDoc> {
		var exists = await this.userHistoryModel.exists({ user: createUserHistoryDto.user });
		if (exists) throw new UserHistoryAlreadyExistsException();
		var userHistory = new this.userHistoryModel({
			user: createUserHistoryDto.user,
			status: createUserHistoryDto.status,
			dropbox_emails: createUserHistoryDto.dropbox_emails
		});
		var error = userHistory.validateSync();
		if (error) {
			throw new BadRequestException({ error: error.message, statusCode: 400 })
		}
		userHistory.save();
		return userHistory;
	}

	async update(user: string, updateUserHistoryDto: UpdateUserHistoryDto | UpdateQuery<UserHistoryDoc>): Promise<UserHistoryDoc> {
		var userHistory = await this.userHistoryModel.findOneAndUpdate({ user }, updateUserHistoryDto, { new: true });
		if (!userHistory) throw new UserNotFoundException();
		return userHistory;
	}

	async delete(user: string): Promise<UserHistory> {
		var userHistory = await this.findOne(user);
		userHistory.remove();
		return userHistory;
	}
}

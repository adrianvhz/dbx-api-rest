import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from "mongoose";
import { User, UserDoc } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from 'src/exceptions/UserNotFoundException';
import { UserAlreadyExistsException } from 'src/exceptions/UserAlreadyExistsException';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDoc>
	) {}

	/** hint
	* customizable to res.json() for alternative performance
	*/
	async findAll(): Promise<UserDoc[]> {
		return await this.userModel.find();
	}

	async findOne(userParam: string, options: resultOptions = { throwError: true }): Promise<UserDoc> | never {
		var user = await this.userModel.findOne({ user: userParam });
		if (!user && options.throwError) {
			throw new UserNotFoundException();
		}
		/**
		 * Default options.history === undefined == false
		 */
		else {
			return user;
		}
	}

	async create(createUserDto: CreateUserDto | UserDoc): Promise<UserDoc> {
		var exists = await this.userModel.exists({
			$or: [
				{ user: createUserDto.user },
				{ client_key: createUserDto.client_key }
			]
		});
		if (exists) throw new UserAlreadyExistsException();
		var user = new this.userModel({
			...createUserDto,
		})
		await user.validate();
		// user.history = await this.usersHistoryService.create({
		// 	user: createUserDto.user,
		// 	dropbox_emails: []
		// });
		await user.save();
		return user;
	}

	async update(userParam: string, updateUserDto: UpdateUserDto | UpdateQuery<UserDoc>): Promise<UserDoc> | never {
		/** UPDATE FIX
		 * De esta manera no regresa el doc eliminado como respuesta.
		 *  var user = await this.findOne(userParam); // throw error if doesn't exist.
		 *  user.update({$set: updateUserDto}, { new: true, overwrite: false });
		 * De la siguiente manera it do.
		 */
		var exists = await this.userModel.exists({
			$or: [
				{ user: updateUserDto.user },
				{ client_key: updateUserDto.client_key }
			]
		})
		if (exists) throw new UserAlreadyExistsException();
		var user = await this.userModel.findOneAndUpdate(
			{ user: userParam },
			updateUserDto,
			{ new: true }
		);
		if (!user) throw new UserNotFoundException();
		return user;
	}

	async delete(userParam: string): Promise<User> | never {
		var user = await this.findOne(userParam);
		user.remove();
		return user;
	}


	/** extra
	* for get_token with credentials.
	*/
	async findOneByClientKey(client_key: string) {
		const user = await this.userModel.findOne({ client_key });
		if (!user) throw new UserNotFoundException("Could not find a user with the provided client_key!");
		return user;
	}
}

import { Schema, SchemaFactory, Prop, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose"

export type UserHistoryDoc = UserHistory & Document;

const schemaOptions: SchemaOptions = {
	toJSON: {
		transform(doc, ret, opts) {
			const { __v, _id, ...rest } = ret;
			return { id: _id, ...rest }
		}
	},
	toObject: {
		transform(doc, ret, opts) {
			const { __v, _id, ...rest } = ret;
			return { id: _id, ...rest }
		}
	}
}

@Schema(schemaOptions)
export class UserHistory {
	@Prop({
		required: true,
		unique: true
	})
	user: string;

	@Prop({
		default: "active"
	})
	status: string

	@Prop([String])
	dropbox_emails: string[];
}

export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);

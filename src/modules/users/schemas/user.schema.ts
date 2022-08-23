import { Schema, SchemaFactory, Prop, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose"
import { UserHistory, UserHistoryDoc } from "./user-history.schema";

export type UserDoc = User & Document;

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
export class User {
	@Prop({
		required: true,
		unique: true
	})
	user: string; // email || dni

	@Prop()
	dbx_account_id: string;

	@Prop({
		required: true,
		unique: true
	})
	client_key: string;

	@Prop({
		required: true
	})
	client_secret: string;

	@Prop()
	tk_acs: string;

	@Prop()
	tk_rfsh: string;

	@Prop()
	tk_acs_expires: Date;

	@Prop()
	dbx_email: string;

	@Prop({
		type: Types.ObjectId,
		ref: UserHistory.name
	})
	history: UserHistoryDoc
}

export const UserSchema = SchemaFactory.createForClass(User);

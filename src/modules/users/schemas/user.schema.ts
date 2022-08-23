import { Schema, SchemaFactory, Prop, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose"

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
	dbx_account_id?: string;

	@Prop({
		required: true,
		unique: true
	})
	client_key?: string;

	@Prop({
		required: true
	})
	client_secret?: string;

	@Prop()
	access_token?: string;

	@Prop()
	refresh_token?: string;

	@Prop()
	access_token_expires?: Date;

	@Prop()
	dbx_email?: string;

	@Prop({
		default: "active"
	})
	status?: string

	@Prop({ type: [String] })
	history_dbx_emails?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

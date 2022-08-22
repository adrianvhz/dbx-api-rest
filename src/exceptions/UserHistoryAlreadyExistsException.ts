import { HttpException } from "@nestjs/common";

export class UserHistoryAlreadyExistsException extends HttpException {
   constructor() {
      super("The user history already exists in the database.", 409);
   }
}

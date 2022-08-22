import { HttpException } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
   constructor() {
      super("The user or client_key already exists in the database.", 409);
   }
}

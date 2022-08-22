import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBasicAuth, ApiHeader } from "@nestjs/swagger";
import { AdminAuthGuard } from "src/guards/admin-auth.guard";

export function UsersAuth() {
	return applyDecorators(
		ApiHeader({ 
			name: "x-admin",
			schema: { 
				type: "string"
			},
			required: false
		}),
		ApiBasicAuth("manage-users"),
		UseGuards(AdminAuthGuard)
	)
}

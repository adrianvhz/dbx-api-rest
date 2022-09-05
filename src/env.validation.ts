import { plainToInstance, Transform } from "class-transformer";
import { IsEnum, validateSync } from "class-validator";

enum Environment {
	Development = "DEVELOPMENT",
	Production = "PRODUCTION",
	Test = "TEST"
}


class EnvironmentVariables {
	@IsEnum(Environment, { message: "Environment must be PRODUCTION, DEVOLOPMENT or TEST" })
	NODE_ENV: Environment;
}

export function validateEnv(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(
		EnvironmentVariables,
		config,
		{ enableImplicitConversion: true }
	);

	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
}

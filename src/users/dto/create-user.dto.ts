import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { LoginUserDto } from "./login-user.dto";
// import { IsEmailUnique } from "src/common/decorators/IsEmailUniqueConstraint";

export class CreateUserDto extends LoginUserDto {
    @IsNotEmpty({ message: "Name can not be null" })
    @IsString({ message: "Name should be string" })
    name: string;

}

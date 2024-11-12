import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto{
    @IsNotEmpty({ message: "Email can not be emplty" })
    @IsEmail({}, { message: "password is not empty" })
    email: string
    @IsNotEmpty({ message: "Password can not empty" })
    @MinLength(5, { message: "Password minimum character should be 5" })
    password: string;
}
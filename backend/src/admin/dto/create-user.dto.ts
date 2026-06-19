import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches, MaxLength } from "class-validator";
import { Role } from "generated/prisma/enums";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(20, 60)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 16)
    @Matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        {
            message:
                'Password must contain at least one uppercase letter and one special character',
        },
    )
    password: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(400)
    address: string;

    @IsEnum(Role)
    role: Role;
}
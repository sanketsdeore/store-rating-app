import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { RegisterDto } from "src/auth/dto/register.dto";

export class CreateStoreOwnerDto extends RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    storeName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    storeAddress: string;
}
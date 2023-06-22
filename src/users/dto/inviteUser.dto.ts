import { IsString } from 'class-validator';

export class InviteUserDto {
  @IsString()
  email: string;
  @IsString()
  username: string;
  @IsString()
  role: string;
}

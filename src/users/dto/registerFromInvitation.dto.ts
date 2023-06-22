import { IsString } from 'class-validator';

export class RegisterFromInvitationDto {
  @IsString()
  password: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { InviteUserDto } from './inviteUser.dto';

export class UpdateUserDto extends PartialType(InviteUserDto) {}

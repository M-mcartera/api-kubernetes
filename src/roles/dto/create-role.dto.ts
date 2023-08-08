import { IsNotEmpty, IsString } from 'class-validator';
import { PERMISSION_RESOURCE } from 'src/global/interfaces';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsString()
  roleDescription: string;

  resources: PERMISSION_RESOURCE[];
}

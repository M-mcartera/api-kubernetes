import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ROLES } from 'src/constants/constants';
import { Roles } from 'src/decorators/custom.decorators';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Roles(ROLES.ADMIN)
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }
  @Roles(ROLES.ADMIN)
  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @Roles(ROLES.ADMIN)
  @Delete('/:id')
  deletRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Roles(ROLES.ADMIN)
  @Put('/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: CreateRoleDto) {
    return this.roleService.updateRole(id, updateRoleDto);
  }
}

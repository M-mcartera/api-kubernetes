import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }
  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @Delete('/:id')
  deletRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Put('/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: CreateRoleDto) {
    return this.roleService.updateRole(id, updateRoleDto);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { Request } from '@nestjs/common';
import { Public, Roles } from 'src/decorators/custom.decorators';
import { ROLES } from 'src/constants/constants';
import { InviteUserDto } from './dto/inviteUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Roles(ROLES.ADMIN, ROLES.USER)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Roles(ROLES.ADMIN)
  @Post('/invite')
  inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return this.userService.inviteUser(inviteUserDto);
  }

  @Roles(ROLES.ADMIN)
  @Put('/:id')
  updateUser(@Body() updateUser: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, updateUser);
  }

  @Roles(ROLES.ADMIN)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Roles(ROLES.ADMIN)
  @Post(':id/resend-invitation')
  resendInvitation(@Param('id') id: string) {
    return this.userService.resendInvitation(id);
  }

  @Public()
  @Get('/validate-invitation')
  async validateInvitation(@Request() req) {
    const { token } = req.query;
    return this.userService.validateInvitationToken(token);
  }
}

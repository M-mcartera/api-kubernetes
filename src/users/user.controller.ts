import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { Request } from '@nestjs/common';
import { Roles } from 'src/decorators/custom.decorators';
import { ROLES } from 'src/constants/constants';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Roles(ROLES.ADMIN)
  @Get('/profile')
  getProfile(@Request() req) {
    return 'asasdasd';
  }
}

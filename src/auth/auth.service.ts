import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { HashService } from 'src/users/hash.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const compareResult = await this.hashService.comparePassword(
      password,
      user.password,
    );
    if (compareResult) {
      return user;
    }
  }

  async logIn(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const userResources = await this.rolesService.getRole(user.role);
    return {
      access_token: await this.jwtService.signAsync(payload, {
        // expiresIn: '10000m',
      }),
      roles: userResources,
    };
  }
}

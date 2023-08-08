import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { LoggerService } from 'src/logger/logger.service';
import { RoleDocument, Role } from 'src/models/role.schema';
import { UserService } from 'src/users/user.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly kubernetesService: KubernetesService,
    private readonly userService: UserService,
  ) {}
  async createRole(payload: CreateRoleDto) {
    try {
      const { roleName, roleDescription, resources } = payload;
      const existingRole = await this.roleModel.findOne({ roleName });

      if (existingRole) {
        throw new ConflictException('Role already exists');
      }

      const role = new this.roleModel({
        roleName,
        roleDescription,
        resources,
      });
      const kubernetesClusterRoleResponse =
        await this.kubernetesService.createClusterRole(roleName, resources);

      if (!kubernetesClusterRoleResponse) {
        throw new InternalServerErrorException('Error creating cluster role');
      }

      return role.save();
    } catch (err) {
      this.loggerService.error('Error creating role', err.message);
      throw new BadRequestException(err.message);
    }
  }

  async getRoles() {
    try {
      const roles = await this.roleModel.find();
      const transformedRoles = await Promise.all(
        roles.map(async (role) => {
          const { usersInRole } = role;
          const usernames = await this.userService.getUsernamesByIds(
            usersInRole,
          );
          role.usersInRole = usernames;
          return role;
        }),
      );
      return transformedRoles;
    } catch (err) {
      this.loggerService.error('Error getting roles', err.message);
      throw new InternalServerErrorException(
        'Error getting roles',
        err.message,
      );
    }
  }

  async deleteRole(id: string) {
    try {
      const role = await this.roleModel.findOne({ _id: id });
      const { roleName } = role;
      await this.kubernetesService.deleteClusterRole(roleName);
      await this.roleModel.deleteOne({ _id: role._id });
    } catch (err) {
      this.loggerService.error('Error deleting role from db', err.message);
    }
  }

  async updateRole(id: string, role: CreateRoleDto) {
    try {
      const { roleName, resources } = role;
      const existingRole = await this.roleModel.findOne({ _id: id });
      if (!existingRole) {
        throw new BadRequestException('Role does not exist');
      }
      await this.kubernetesService.updateClusterRole(roleName, resources);
      await this.roleModel.updateOne({ _id: id }, role);
    } catch (err) {
      this.loggerService.error('Error updating role', err.message);
      throw new InternalServerErrorException('Error updating role');
    }
  }
}

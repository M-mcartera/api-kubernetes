import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invite, InviteDocument } from 'src/models/invite.schema';
import { User, UserDocument } from 'src/models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { HashService } from './hash.service';
import * as crypto from 'crypto-js';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { RegisterFromInvitationDto } from './dto/registerFromInvitation.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { generateInvitationToken } from 'src/uits';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Invite.name)
    private readonly inviteModel: Model<InviteDocument>,
    private readonly hashService: HashService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly kubeService: KubernetesService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const { token, password } = createUserDto;
      const foundToken = await this.inviteModel.findOne(
        { token },
        {},
        { sort: { createdAt: -1 } },
      );
      if (!foundToken) {
        throw new BadRequestException('Invalid token');
      }
      const { email } = foundToken;
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const hashedPassword = await this.hashService.hashPassword(password);
      await this.userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        active: true,
      });

      await this.kubeService.createServiceAccount(
        user._id.toString(),
        user.username,
      );
      await this.inviteModel.findByIdAndUpdate(foundToken._id, {
        redeemed: true,
      });

      return { success: true };
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.message);
    }
  }

  async getUsers() {
    return this.userModel.find().exec();
  }

  async inviteUser(payload: InviteUserDto) {
    try {
      const alreadyExistUser = await this.getUserByEmail(payload.email);
      if (alreadyExistUser && alreadyExistUser.password) {
        throw new ConflictException('User already joined the platform');
      }
      const alreadyInvited = await this.inviteModel.findOne(
        {
          email: payload.email,
        },
        {},
        { sort: { expirationDate: -1 } },
      );

      if (
        alreadyInvited &&
        Date.now() < alreadyInvited.expirationDate.getTime()
      ) {
        throw new ConflictException('User already invited');
      }

      const token = generateInvitationToken(30);

      const invite = new this.inviteModel({
        email: payload.email,
        token,
      });

      const windowUrl = this.configService.get('FRONTEND_URL');
      const url = `${windowUrl}/invitation/register?token=${token}`;

      const pendingUser = new this.userModel({
        email: payload.email,
        username: payload.username,
        role: payload.role,
        active: false,
      });

      await this.mailService.sendEmail(
        payload.email,
        'Invite',
        'Invitation to register',
        url,
      );

      if (
        !alreadyInvited ||
        Date.now() > alreadyInvited.expirationDate.getTime()
      ) {
        await pendingUser.save();
      }
      await invite.save();

      return { success: true };
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.message);
    }
  }

  async validateInvitationToken(token: string) {
    try {
      const foundInvitation = await this.inviteModel.findOne({ token });
      if (!foundInvitation) {
        return { success: false, errorCode: 0, msg: 'Invalid token' };
      }
      if (foundInvitation.redeemed) {
        return { success: false, errorCode: 1, msg: 'Token already redeemed' };
      }
      if (Date.now() > foundInvitation.expirationDate.getTime()) {
        return { success: false, errorCode: 2, msg: 'Token expired' };
      }
      const foundUser = await this.getUserByEmail(foundInvitation.email);
      if (foundUser.password) {
        return { success: false, errorCode: 3, msg: 'User already exist' };
      }

      return { success: true };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async registerUserFromInvitation(
    token: string,
    payload: RegisterFromInvitationDto,
  ) {
    try {
      const invitation = await this.inviteModel.findOne({ token });
      if (!invitation) {
        throw new BadRequestException('Invalid token');
      }
      const { email } = invitation;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateUser(id: string, payload: UpdateUserDto) {
    try {
      const existingUser = await this.userModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }
      return existingUser;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteUser(id: string) {
    try {
      const foundUser = await this.userModel.findById(id);

      const existingUser = await this.userModel.findByIdAndDelete(id);
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      await this.inviteModel.deleteMany({ email: foundUser.email });

      return existingUser;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async resendInvitation(id: string) {
    try {
      const foundUser = await this.userModel.findById(id);
      if (!foundUser) {
        throw new BadRequestException('User not found');
      }
      const email = foundUser.email;
      const hash = crypto.SHA256(email);
      const token = hash.toString(crypto.enc.Hex);

      const invitation = new this.inviteModel({
        email,
        token,
      });

      const windowUrl = this.configService.get('FRONTEND_URL');
      const url = `${windowUrl}/invitation/register?token=${token}`;

      await this.mailService.sendEmail(
        email,
        'Invite',
        'Invitation to register',
        url,
      );

      await invitation.save();
      return { success: true };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async getUsernamesByIds(ids: string[]) {
    if (!ids.length) return [];
    const users = await this.userModel.find();
    const usernames = users
      .filter((user) => ids.includes(user._id.toString()))
      .map((user) => user.username);
    return usernames;
  }
}

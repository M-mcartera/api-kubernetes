import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = this.configService.get('saltOrRounds');
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: any): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

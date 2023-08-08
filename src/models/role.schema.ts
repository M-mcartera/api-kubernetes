import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PERMISSION_RESOURCE } from 'src/global/interfaces';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  roleName: string;
  @Prop({ required: false, default: '' })
  roleDescription: string;
  @Prop()
  usersInRole: string[];
  @Prop({ required: true })
  resources: PERMISSION_RESOURCE[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

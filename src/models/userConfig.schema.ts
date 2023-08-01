import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserConfigDocument = UserConfig & Document;

@Schema({ timestamps: true })
export class UserConfig {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true, type: Object })
  config: Record<string, any>;

  _id: ObjectId;
}

export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);

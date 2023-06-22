import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  username: string;
  @Prop({ required: false })
  password: string;
  @Prop({ required: true })
  role: string;
  @Prop({ default: false })
  active: boolean;

  _id: ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type DbLogsDocument = DbLogs & Document;

@Schema({ timestamps: true })
export class DbLogs {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  action: string;

  _id: ObjectId;
}

export const DbLogsSchema = SchemaFactory.createForClass(DbLogs);

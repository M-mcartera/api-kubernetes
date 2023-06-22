import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InviteDocument = Invite & Document;

@Schema({ timestamps: true })
export class Invite {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  token: string;
  @Prop({ default: new Date(Date.now() + 60 * 60 * 24 * 1000).getTime() }) //expira in 24 de ore
  expirationDate: Date;
  @Prop({ default: false })
  redeemed: boolean;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);

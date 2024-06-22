import { Prop } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Schema } from 'mongoose';

export class EntityBase {
  _id: Schema.Types.ObjectId;

  id: string;

  @Prop({ default: null })
  deleted_at: Date;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { EntityBase } from 'src/cores/repository/entity.base';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends EntityBase {
  @Exclude()
  _id: ObjectId;

  @Expose()
  @Transform(
    (incomeVal) => {
      return incomeVal.obj?._id?.toString();
    },
    { toClassOnly: true },
  )
  id: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  @Transform((incomeValue) => {
    return `${incomeValue.obj?.firstName} ${incomeValue.obj?.lastName}`;
  })
  fullName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });

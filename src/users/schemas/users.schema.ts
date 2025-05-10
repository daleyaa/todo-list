import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { hash } from 'bcrypt';

export type UserDocument = HydratedDocument<User>;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class User {
  /**
   * @description Unique identifier for the user
   */
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Prop({
    unique: true,
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  id: ObjectId;

  @ApiProperty({ example: 'Kosar' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'kosar.asadipour@gmail.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '123456' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  try {
    const user = this as UserDocument;
    if (!user.isModified('password')) {
      return next();
    }
    // Hash the password
    const hashedPassword: string = await hash(
      user.password,
      Number(process.env.SALT_BCRYPT) || 10,
    );
    user.password = hashedPassword;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    return next(new Error('Internal server error'));
  }
});

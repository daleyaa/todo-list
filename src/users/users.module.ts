import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { LoginController } from './login.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [UsersController, LoginController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

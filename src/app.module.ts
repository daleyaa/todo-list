import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${process.env.HOST_DB ?? 'mongodb://localhost:27017'}`,
    ),
    UsersModule,
    AuthModule,
    TodosModule,
  ],
})
export class AppModule {}

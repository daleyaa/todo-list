import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/loginDto';
import { Todo } from 'src/todos/schemas/todo.schema';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.UserModel.find({});
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.UserModel.findOne({ email: email });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.UserModel.findOne({ _id: id });
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.UserModel(user);
    return await createdUser.save();
  }

  async delete(id: string) {
    return await this.UserModel.deleteOne({ _id: id });
  }

  async addTodo(userId: string, todo: Todo): Promise<User | null> {
    return await this.UserModel.findByIdAndUpdate(userId, { $push: { todos: todo } }, { new: true });
  }

  async removeTodo(todoId: string): Promise<void> {
    await this.UserModel.updateMany({ todos: todoId }, { $pull: { todos: todoId } }, { new: true });
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, id: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }
}

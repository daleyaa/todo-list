import { Injectable } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel (Todo.name) 
    private todoModel: Model<TodoDocument>
  ){}
  async create(todo: Todo): Promise<Todo> {
    
    const createdTodo = new this.todoModel(todo);
    return await createdTodo.save()
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoModel.find().populate('assignedTo').exec();
  }

  async findOne(id: string, hasPopulate: boolean) {
    if(hasPopulate) {
      return await this.todoModel.findById(id).populate('assignedTo').exec();
    } else {
      return await this.todoModel.findById(id).exec();
    }
  }

  async update(id: string, todo: UpdateTodoDto) {
    return await this.todoModel.findByIdAndUpdate(id, todo, {new: true}).exec();
  }

  async remove(id: string) {
    return await this.todoModel.findByIdAndDelete(id, {new: true}).exec();
  }
}

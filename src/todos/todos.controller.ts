import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, BadRequestException, InternalServerErrorException, UseFilters, NotFoundException, Query } from '@nestjs/common';
import { TodosService } from './todos.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Todo } from './schemas/todo.schema';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PartialType } from '@nestjs/mapped-types';
import { TodoStatusEnum } from './enum/todo-status.enum';
import { UsersService } from 'src/users/users.service';


@ApiTags('todos')
@Controller('todos')

export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Todo' })
  @ApiResponse({status: 201, description:'Todo Created', type: Todo})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description:'Internal Server Error.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async create(@Body() todo: Todo): Promise<Todo> {
    try{
    if(!todo.title || !todo.startDate || !todo.endDate) {
      throw new BadRequestException()
    }
    const createdTodo = await this.todosService.create(todo);
    if(todo.assignedTo) {
      for(const userId of todo.assignedTo) {
        await this.usersService.addTodo(userId.toString(), createdTodo);
      }
    }
    return createdTodo;
    } catch(error) {
      if(error.status) {
        throw new HttpException(error.message,error.status)
      } else {
        throw new InternalServerErrorException(error.message)
      }
  } 
}

  @Get()
  @ApiOperation({ summary: 'Get All Todos' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 200,
    description: 'Todos Found.',
    type: Todo,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findAll() {
    try {
      const todos = await this.todosService.findAll();
      if (!todos) {
        throw new NotFoundException('Todo Not Found');
      } else {
        return todos;
      }
    } catch (error) {
      if(error.status) {
        throw new HttpException(error.message,error.status)
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo Found.', type: Todo })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Todo Not Found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    try{
      const todo = await this.todosService.findOne(id, true);
      if(!todo) {
        throw new NotFoundException('Todo Not Found')
      } else {
        return todo
      }
    } catch(error) {
      if(error.status) {
        throw new HttpException(error.message,error.status)
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo by ID'})
  @ApiResponse({status: 200, description: 'Todo Updated', type: Todo})
  @ApiResponse({status: 400, description: 'Bad Request.'})
  @ApiResponse({status: 401, description: 'Unauthorized.'})
  @ApiResponse({status: 404, description: 'Todo Not Found.'})
  @ApiResponse({status: 500, description: 'Internal Server Error.'})
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() todo: UpdateTodoDto): Promise<Todo> {
    const previousTodo = await this.todosService.findOne(id, false);
    if(!previousTodo) {
      throw new NotFoundException('Todo Not Found')
    }

    try {
      if (todo.status && !Object.values(TodoStatusEnum).includes(todo.status)) {
        throw new BadRequestException('Invalid status value')
      }

      const startDate = todo.startDate ? new Date(todo.startDate) : previousTodo.startDate;
      const endDate = todo.endDate ? new Date(todo.endDate) : previousTodo.endDate;

      if (startDate.getTime() >= endDate.getTime()) {
        throw new BadRequestException('Start date must be before end date')
      }
      // if(todo.assignedTo) {
      //   for(const userId of todo.assignedTo) {
      //     await this.usersService.addTodo(userId.toString(), todo);
      //   }
      // }
      const updatedTodo = await this.todosService.update(id, todo);
      if(!updatedTodo) {
        throw new NotFoundException('Todo Not Found')
      }
      return updatedTodo;
    } catch(error) {
      if(error.status) {
        throw new HttpException(error.message, error.status)
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo by ID'})
  @ApiResponse({status: 200, description: 'Todo Deleted', type: Todo})
  @ApiResponse({status: 401, description: 'Unauthorized.'})
  @ApiResponse({status: 404, description: 'Todo Not Found.'})
  @ApiResponse({status: 500, description: 'Internal Server Error.'})
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<Todo> {
    try{
      const todo = await this.todosService.findOne(id, false);
      if(!todo) {
        throw new NotFoundException('Todo Not Found')
      }
      await this.usersService.removeTodo(id);
      const deletedTodo = await this.todosService.remove(id);
      if(!deletedTodo) {
        throw new NotFoundException('Todo Not Found')
      } else {
        return deletedTodo
      }
    } catch(error) {
      if(error.status) {
        throw new HttpException(error.message,error.status)
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
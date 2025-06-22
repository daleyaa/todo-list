import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All users' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 200,
    description: 'Users Found.',
    type: User,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userService.findAll();
      if (!users) {
        throw new HttpException('User not found', 404);
      } else {
        return users;
      }
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User by ID' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({ status: 200, description: 'User Found.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Partial<User>> {
    try {
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new HttpException('User not found', 404);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 201, description: 'User Created', type: User })
  @ApiResponse({ status: 409, description: 'Conflict.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() user: User): Promise<User> {
    try {
      if (!user.name || !user.email || !user.password) {
        throw new HttpException('Missing Required Fields', 400);
      }
      const conflictUser: User | null = await this.userService.findOneByEmail(
        user.email,
      );
      if (conflictUser) {
        throw new HttpException('User Already Exists', 409);
      }
      return await this.userService.create(user);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'User Not Found.' })
  @ApiResponse({ status: 200, description: 'User Deleted' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    try {
      if (!id) {
        throw new HttpException('Missing Required Fields', 400);
      }
      const result = await this.userService.delete(id);
      if (result.deletedCount === 0) {
        throw new HttpException('User Not Found', 404);
      } else {
        return { message: 'User Deleted', statusCode: 200 };
      }
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

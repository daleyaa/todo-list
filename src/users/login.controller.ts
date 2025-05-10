import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dto/loginDto';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 201,
    description: 'User logged in.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User Not Found.' })
  async login(@Body() req: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      const user = await this.usersService.findOneByEmail(req.email);
      if (user && user.password === req.password) {
        return await this.usersService.login(user);
      } else {
        throw new HttpException('Not Found', 404);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        error instanceof HttpException ? error.getStatus() : 500,
      );
    }
  }
}

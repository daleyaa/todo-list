import { ApiProperty } from '@nestjs/swagger';
import { TodoStatusEnum } from '../enum/todo-status.enum';

export class UpdateTodoDto {
    @ApiProperty({ example: 'Learn English' })
    title?: string;
    @ApiProperty({ example: 'Learn Grammer and vocabulary' })
    desc?: string;
    @ApiProperty({ example: 'TODO' })
    status?: TodoStatusEnum;
    @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
    startDate?: Date;
    @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
    endDate?: Date;
    @ApiProperty({example:'678f89bbc21e5a0286a0f23c' })
    assignedTo?: string[];
}

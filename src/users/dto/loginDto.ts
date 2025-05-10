import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ example: 'kosar.asadipour@gmail.com' })
  email: string;
  @ApiProperty({ example: '123456' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtvc2FyLmFzYWRpcG91ckBnbWFpbC5jb20iLCJpZCI6IjY3OTBlY2M0NmQxMTQ3MGQ4M2Y0NjcyZSIsImlhdCI6MTczNzU1MTA0NCwiZXhwIjoxNzM3NTUxMTA0fQ.uNqq6xFIUfu7OT3vTeE-7fex8ZsWcMSD8SubWFP-mNo',
  })
  access_token: string;
}

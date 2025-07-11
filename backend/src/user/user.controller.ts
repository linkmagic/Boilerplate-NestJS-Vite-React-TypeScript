import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) return { message: 'User not found' };

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

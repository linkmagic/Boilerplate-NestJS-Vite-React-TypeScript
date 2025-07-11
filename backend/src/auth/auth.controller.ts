import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() body: { email: string; fullName: string; password: string },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { userId: string; email: string }) {
    return user;
  }

  /*
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    // ...
  }
  */
}

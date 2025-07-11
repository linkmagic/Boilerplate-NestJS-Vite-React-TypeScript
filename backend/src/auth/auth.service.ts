import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshToken } from './refresh-token.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async register(data: { email: string; fullName: string; password: string }) {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userService.create({
      email: data.email,
      fullName: data.fullName,
      passwordHash: hashedPassword,
    });

    const payload = { sub: newUser.id, email: newUser.email };
    const accessToken = await this.jwtService.signAsync(payload);

    const { passwordHash, ...safeUser } = newUser;

    return {
      user: safeUser,
      accessToken,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.generateAndSaveRefreshToken(user.id);

    const { passwordHash, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async generateAndSaveRefreshToken(userId: string): Promise<string> {
    const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 днів
    const expiresAt = new Date(Date.now() + expiresIn);

    const payload = { sub: userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    await this.refreshTokenRepo.save({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: { id: userId } as any,
      token: refreshToken,
      expiresAt,
    });

    return refreshToken;
  }

  private async validateRefreshToken(token: string): Promise<RefreshToken> {
    let decoded: { sub: string };

    try {
      decoded = await this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token (jwt)');
    }

    const saved = await this.refreshTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!saved || saved.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token not found or expired');
    }

    return saved;
  }

  async refreshTokens(oldRefreshToken: string) {
    try {
      const savedToken = await this.validateRefreshToken(oldRefreshToken);

      // Delete old token to prevent reuse
      await this.refreshTokenRepo.delete({ token: oldRefreshToken });

      const payload = {
        sub: savedToken.user.id,
        email: savedToken.user.email,
      };

      const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
      const refreshToken = await this.generateAndSaveRefreshToken(savedToken.user.id);

      const { passwordHash, ...safeUser } = savedToken.user;

      return {
        user: safeUser,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      // Optional: log unexpected error
      console.error('Unexpected error in refreshTokens():', err);

      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

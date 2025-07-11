import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }
}

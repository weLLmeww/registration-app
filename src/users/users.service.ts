// backend/src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterStep1Dto, RegisterStep2Dto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async startRegistration(dto: RegisterStep1Dto): Promise<void> {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email already registered');
    }
    // No DB write yet – we keep the email in a temporary store (e.g. Redis) in real‑world.
    // For simplicity we skip that step and just allow step‑2 to create the record.
  }

  async finishRegistration(email: string, dto: RegisterStep2Dto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email,
      name: dto.name,
      passwordHash,
    });
    return this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ select: ['email', 'name'] });
  }
}
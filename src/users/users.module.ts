// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    // передаём массив сущностей, без лишних скобок
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    // просто указываем класс контроллера
    UsersController,
  ],
  providers: [
    // просто указываем класс сервиса
    UsersService,
  ]
})
export class UsersModule {}
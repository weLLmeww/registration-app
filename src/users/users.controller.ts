// backend/src/users/users.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterStep1Dto, RegisterStep2Dto } from './user.dto';
import { User } from './user.entity';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ---- STEP 1 -------------------------------------------------
  @Post('register/step1')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async step1(@Body() dto: RegisterStep1Dto) {
    await this.usersService.startRegistration(dto);
    // just echo back email – client will keep it for step2
    return { email: dto.email };
  }

  // ---- STEP 2 -------------------------------------------------
  @Post('register/step2')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async step2(
    @Query('email') email: string,
    @Body() dto: RegisterStep2Dto,
  ): Promise<Pick<User, 'email' | 'name'>> {
    const user = await this.usersService.finishRegistration(email, dto);
    return { email: user.email, name: user.name };
  }

  // ---- LIST USERS ---------------------------------------------
  @Get()
  async list(): Promise<Pick<User, 'email' | 'name'>[]> {
    const users = await this.usersService.findAll();
    return users.map(u => ({ email: u.email, name: u.name }));
  }
}
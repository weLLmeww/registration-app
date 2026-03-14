// backend/src/users/user.dto.ts
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterStep1Dto {
  @IsEmail()
  email!: string; 
}

export class RegisterStep2Dto {
  @IsNotEmpty()
  name!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'Password must contain latin letters and numbers',
  })
  password!: string;
}
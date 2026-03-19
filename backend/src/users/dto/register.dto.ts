import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Неправильный формат e-mail' })
  @IsNotEmpty({ message: 'Необходимо указать e-mail' })
  @Matches(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, {
    message: 'E-mail должен содержать только латинские символы, цифры и допустимые специальные символы',
  })
  email: string;

  @IsNotEmpty({ message: 'Необходимо указать имя' })
  name: string;

  @IsNotEmpty({ message: 'Необходимо указать пароль' })
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, {
    message: 'Пароль должен содержать только латинские символы, цифры и специальные символы',
  })
  password: string;
}

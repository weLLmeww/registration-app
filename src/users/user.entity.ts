// backend/src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;                     // гарантируем, что будет заполнено

  @Column({ unique: true })
  email!: string;                  // проверка уникальности в БД

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;           // хранится хеш пароля (bcrypt, argon2 и т.п.)

  @CreateDateColumn()
  createdAt!: Date;                 // TypeORM заполняет автоматически

  @UpdateDateColumn()
  updatedAt!: Date;
}
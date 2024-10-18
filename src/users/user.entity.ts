import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()  // Marks this class as a database entity
export class User {
  @PrimaryGeneratedColumn()
  id: number;  // Primary key, auto-generated

  @Column()
  name: string;  // Column for user name

  @Column({ unique: true })
  email: string;  // Unique column for user email

  @Column()
  password: string;  // Column for user password
}

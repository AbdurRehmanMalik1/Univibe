import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Method to fetch all users from the database
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Method to add a user
  async addUser(name: string, email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ name, email, password });
    return this.userRepository.save(user);
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users to fetch all users
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // POST /users to create a new user
  @Post()
  create(@Body() createUserDto: { name: string; email: string; password: string }): Promise<User> {
    const { name, email, password } = createUserDto;
    return this.userService.addUser(name, email, password);
  }
}

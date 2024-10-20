import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<{ message: string }> {
    try {
      const isValid = await this.userService.validateUser(email, password);
      
      if (!isValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
  
      return { message: 'Login successful' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  
      throw new HttpException(
        'Something went wrong, please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('send-verification')
  async sendVerification(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<{ message: string }> {
    try {
      await this.userService.sendVerificationCode(email, password);
      return { message: 'Verification code sent to email' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { message: error.message };
      }
      throw error;
    }
  }

  @Post('verify-code')
  async verifyCode(
    @Body() { email, code }: { email: string; code: string },
  ): Promise<{ message: string }> {
    const isVerified = await this.userService.verifyCode(email, code);
    if (!isVerified) {
      return { message: 'Invalid verification code. Please try again.' };
    }
    return { message: 'Code verified. Proceed to send your username.' };
  }

  @Post('register')
  async registerUser(
    @Body() { email, user_name }: { email: string; user_name: string },
  ): Promise<User> {
    return this.userService.registerUser(user_name, email);
  }
  
  // GET /users - Fetch all users
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // GET /users/:id - Fetch a specific user by ID
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  // POST /users - Create a new user
  // @Post()
  // create(
  //   @Body()
  //   createUserDto: {
  //     user_name: string;
  //     email: string;
  //     password: string;
  //   },
  // ): Promise<User> {
  //   const { user_name, email, password } = createUserDto;
  //   return this.userService.addUser(user_name, email, password);
  // }

  // PATCH /users/:id - Update user details
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  // DELETE /users/:id - Delete a user
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}

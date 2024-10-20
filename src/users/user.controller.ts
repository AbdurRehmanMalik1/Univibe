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
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
    Login api calls
  */

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<{ message: string }> {
    try {
      await this.userService.validateUser(email, password);

      return { message: 'Login successful' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'Something went wrong, please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
    Sign up api calls
  */

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


  /*
    User API calls
  */

  //TODO: this is yet to be completed
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ): Promise<Partial<User>> {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('name/:name')
  async findByUserName(@Param('name') name: string): Promise<Partial<User>[]> {
    try {
      return await this.userService.findByUserName(name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Partial<User>> {
    try {
      return await this.userService.findByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  

  @Get('id/:id')
  async findById(@Param('id') id: number): Promise<Partial<User>> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';  // Import the User entity
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],  // Register the service
  controllers: [UserController],  // Register the controller
})

export class AppModule {}


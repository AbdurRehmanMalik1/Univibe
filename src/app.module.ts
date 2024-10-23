
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity';  // Import the User entity
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { AppDataSource } from './data-source';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  providers: [UserService, AuthService, JwtService],  // Register the service
  controllers: [UserController, AuthController],  // Register the controller
})

export class AppModule {}


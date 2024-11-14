import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity'; // Import the User entity
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { AppDataSource } from './data-source';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ActivityController } from './activity/activity.controller';
import { ActivityService } from './activity/activity.service';
import { Activity } from './activity/activity.entity';
import { InterestService } from './interests/interest.service';
import { InterestController } from './interests/interest.controller';
import { Interest } from './interests/interest.entity';
import { UserContactsService } from './userContacts/userContacts.service';
import { UserContacts } from './userContacts/userContacts.entity';
import { UserContactController } from './userContacts/userContacts.controller';

import { ScheduleModule } from '@nestjs/schedule';
import { PostCleanupService } from './post-cleanup.service';
import { PostController } from './posts/post.controller';
import { PostService } from './posts/post.service';
import { PostImage } from './postImages/postImage.entity';
import { Post } from './posts/post.entity';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { Message } from './chat/message.entity';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([
      User,
      Activity,
      Interest,
      UserContacts,
      Post,
      PostImage,
      Message
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    ChatModule
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ActivityService,
    InterestService,
    UserContactsService,
    PostService,
    PostCleanupService
  ], // Register the service
  controllers: [
    UserController,
    AuthController,
    ActivityController,
    InterestController,
    UserContactController,
    PostController,
    ChatController
  ], // Register the controller
})
export class AppModule {}


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';  // Import the User entity
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',          // Database type
      host: 'dbprojectfast.database.windows.net',      // Your MS SQL Server host
      port: 1433,             // Default port for SQL Server
      username: 'manu', 
      password: 'abdurrehman0!',
      database: 'dbProject',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],  // Path to your entities
      synchronize: true,      // Auto-sync entities with DB (disable in production)
      logging: true,
      extra: {
        encrypt: true,
        trustServerCertificate: false,  // Required for development environments with self-signed certificates
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],  // Register the service
  controllers: [UserController],  // Register the controller
})

export class AppModule {}


###app.module.ts:

import { AppDataSource } from './data-source';


@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],  // Register the service
  controllers: [UserController],  // Register the controller
})

###src/data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'dbprojectfast.database.windows.net',
  port: 1433,
  username: 'manu',
  password: 'abdurrehman0!',
  database: 'dbProject',
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Your entity paths
  migrations: ['src/migration/*.ts'],
  synchronize: true, // Auto-sync entities with DB (disable in production)
  logging: true,
  extra: {
    encrypt: true,
    trustServerCertificate: false, // Required for development environments with self-signed certificates
  },
});

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();


// export const AppDataSource = new DataSource({
//   type: 'mssql',
//   host: process.env.DB_HOST, // e.g., 'yourserver.database.windows.net'
//   port: Number(process.env.DB_PORT), // Default Azure SQL port
//   username: process.env.DB_USERNAME, // Azure SQL username
//   password: process.env.DB_PASSWORD, // Azure SQL password
//   database: process.env.DB_NAME, // Azure SQL database name
//   entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to your entities
//   migrations: ['src/migration/*.ts'], // Path to migrations
//   synchronize: true, // Auto-sync entities with DB (disable in production)
//   logging: true, // Enable logging for debugging
//   extra: {
//     encrypt: true, // Required for Azure SQL
//     trustServerCertificate: false, // Ensures proper SSL validation
//     connectionTimeout: 30000, // Timeout in milliseconds
//   },
// });



//Local DB
export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Your entity paths
  migrations: ['src/migration/*.ts'],
  synchronize: true, // Auto-sync entities with DB (disable in production)
  logging: true,
  extra: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 30000,
  },
});


// const local_manu_config:TypeOrmModuleOptions = {
//   type: 'mssql',          // Database type
//   host: 'localhost',      // Your MS SQL Server host
//   port: 1434,             // Port for Manu local server
//   username: 'developer', 
//   password: '12345678',
//   database: 'dbProject',
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],  // Path to your entities
//   synchronize: true,      // Auto-sync entities with DB (disable in production)
//   logging: false,
//   extra: {
//     encrypt: false,
//     trustServerCertificate: true,  // Required for development environments with self-signed certificates
//   },
// }  

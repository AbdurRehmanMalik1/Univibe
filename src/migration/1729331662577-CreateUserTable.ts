// import { MigrationInterface, QueryRunner } from "typeorm";

// // const {MigrationInterface, QueryRunner } = require("typeorm");

// export class CreateUserTable1729331662577 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`
//             CREATE TABLE User (
//                 user_id INT PRIMARY KEY IDENTITY,
//                 email VARCHAR(100) UNIQUE NOT NULL,
//                 password_hash VARCHAR(255) NULL,
//                 first_name VARCHAR(100) NOT NULL,
//                 last_name VARCHAR(100) NOT NULL,
//                 profile_pic_url VARCHAR(255),
//                 oauth_provider VARCHAR(50),
//                 oauth_id VARCHAR(255),
//                 created_at DATETIME DEFAULT GETDATE() NOT NULL
//             )
//         `);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`DROP TABLE Users`);
//     }
// }


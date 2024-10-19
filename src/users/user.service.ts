import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

@Injectable()
export class UserService {
  private temporaryData: Map<
    string,
    { code: string; password: string; verified: boolean }
  > = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendVerificationCode(email: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Email already exists. Please log in instead.',
      );
    }

    const code = crypto.randomBytes(3).toString('hex');

    this.temporaryData.set(email, { code, password, verified: false });

    await this.sendEmail(email, code);
  }

  async verifyCode(email: string, inputCode: string): Promise<boolean> {
    const storedData = this.temporaryData.get(email);

    if (!storedData || storedData.code !== inputCode) {
      return false;
    }

    this.temporaryData.set(email, { ...storedData, verified: true });
    return true;
  }

  async storeTemporaryUser(email: string): Promise<void> {
    const storedData = this.temporaryData.get(email);
    if (!storedData) {
      throw new BadRequestException('Verification process incomplete');
    }
  }

  async registerUser(user_name: string, email: string): Promise<User> {
    const storedData = this.temporaryData.get(email);

    if (!storedData || !storedData.verified) {
      throw new BadRequestException(
        'Email not verified. Please complete verification first.',
      );
    }

    const newUser = this.userRepository.create({
      user_name,
      email,
      password_hash: storedData.password,
    });

    const savedUser = await this.userRepository.save(newUser);

    this.temporaryData.delete(email);

    return savedUser;
  }

  private async sendEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException(
        'Failed to send verification email, please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR, // Returns HTTP status 500
      );
    }
  }

  // Fetch all users
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Add a new user
  async addUser(
    user_name: string,
    email: string,
    password_hash: string,
  ): Promise<User> {
    const newUser = this.userRepository.create({
      user_name,
      email,
      password_hash,
    });
    return this.userRepository.save(newUser);
  }

  // Find a user by ID
  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { user_id: id } });
  }

  // Update user details
  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findById(id); // Return the updated user
  }

  // Delete user by ID
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

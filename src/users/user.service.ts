import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
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

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  /*
    Sign up api calls
  */

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

  async registerUser(user_name: string, email: string): Promise<User> {
    const storedData = this.temporaryData.get(email);

    if (!storedData || !storedData.verified) {
      throw new BadRequestException(
        'Email not verified. Please complete verification first.',
      );
    }

    const hashedPassword = await this.hashPassword(storedData.password);
    const newUser = this.userRepository.create({
      user_name,
      email,
      password_hash: hashedPassword,
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
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
    Login api calls
  */

  async validateUser(email: string, password: string): Promise<User> {

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  /*
    User API calls
  */

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(findEmail: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { email: findEmail },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
    };
  }

  async findByUserName(name: string): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      where: { user_name: name },
    });
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found with the specified name');
    }

    return users.map((user) => ({
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
    }));
  }

  async findById(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
    };
  }

  async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<Partial<User>> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allowedUpdates = ['user_name', 'profile_image'];
    const updates = Object.keys(updateData).filter((key) =>
      allowedUpdates.includes(key),
    );

    if (updates.length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    await this.userRepository.update(id, updateData);

    return this.findById(id);
  }

  // Delete user by ID
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  UseGuards,
  Put,
  Param,
  Query,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) {}

  // Create a new post
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('location') location: string,
    @Body('activityTypeId') activityTypeId: number,
    @Body('imageUrls') imageUrls: string[],
    @Req() req: any,
  ) {
    try {
      const user = await this.authService.identifyUser(
        req.headers['authorization'],
      );
      return this.postService.createPost(
        user.user_id,
        title,
        description,
        location,
        activityTypeId,
        imageUrls,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  // Update an existing post
  //TODO: needs some checks and if no value is passed, make no changes
  @Put(':postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('postId') postId: number,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('location') location: string,
    @Body('activityTypeId') activityTypeId: number,
    @Body('imageUrls') imageUrls: string[],
    @Req() req: any,
  ) {
    try {
      const user = await this.authService.identifyUser(
        req.headers['authorization'],
      );
      return this.postService.updatePost(
        user.user_id,
        postId,
        title,
        description,
        location,
        activityTypeId,
        imageUrls,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Delete a post
  //TODO: needs to return a message
  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('postId') postId: number, @Req() req: any) {
    try {
      const user = await this.authService.identifyUser(
        req.headers['authorization'],
      );
      return this.postService.deletePost(user.user_id, postId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  //TODO: to be tried and tested
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@Query() filters: { [key: string]: any }) {
    try {
        return this.postService.getPosts(filters);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

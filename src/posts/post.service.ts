import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostImage } from 'src/postImages/postImage.entity';
import { getDistance } from 'geolib';
import * as dotenv from 'dotenv';
import { Activity } from 'src/activity/activity.entity';
dotenv.config();

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async createPost(
    userId: number,
    title: string,
    description: string,
    location: string,
    activityTypeId: number,
    imageUrls: string[] = [],
  ) {
    try {
      if (!title) throw new NotFoundException('Title is required.');
      if (!description) throw new NotFoundException('Description is required.');
      if (!location) throw new NotFoundException('Location is required.');

      const activityType = await this.activityRepository.findOne({
        where: { activity_id: activityTypeId },
      });

      if (!activityType)
        throw new NotFoundException('Activity type not found.');

      const expiresAt = new Date();
      const expireTimeHours = parseInt(process.env.EXPIRE_TIME, 10);
      if (isNaN(expireTimeHours))
        throw new InternalServerErrorException(
          'Invalid expiration time configured.',
        );
      expiresAt.setHours(expiresAt.getHours() + expireTimeHours);

      const post = this.postRepository.create({
        user: { user_id: userId } as any,
        title,
        description,
        location,
        activityType,
        expires_at: expiresAt,
      });

      const savedPost = await this.postRepository.save(post);

      if (imageUrls.length > 0) {
        const postImages = imageUrls.map((url) =>
          this.postImageRepository.create({
            post: savedPost,
            image_url: url,
          }),
        );
        await this.postImageRepository.save(postImages);
        savedPost.images = postImages;
      }

      return savedPost;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error creating post:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the post.',
      );
    }
  }

  async updatePost(
    userId: number,
    postId: number,
    title: string,
    description: string,
    location: string,
    activityTypeId?: number,
    imageUrls: string[] = [],
  ) {
    const post = await this.postRepository.findOne({
      where: { post_id: postId, user: { user_id: userId } },
      relations: ['images'],
    });
    if (!post) {
      throw new NotFoundException('Post not found or not authorized');
    }

    if (activityTypeId) {
      const activityType = await this.activityRepository.findOne({
        where: { activity_id: activityTypeId },
      });
      if (!activityType) {
        throw new NotFoundException('Activity type not found');
      }
      post.activityType = activityType;
    }

    post.title = title;
    post.description = description;
    post.location = location;

    if (imageUrls.length > 0) {
      await this.postImageRepository.delete({ post: { post_id: postId } });

      const postImages = imageUrls.map((url) =>
        this.postImageRepository.create({
          post,
          image_url: url,
        }),
      );
      await this.postImageRepository.save(postImages);
      post.images = postImages;
    }

    return await this.postRepository.save(post);
  }

  async deletePost(userId: number, postId: number): Promise<string> {
    const post = await this.postRepository.findOne({
      where: { post_id: postId, user: { user_id: userId } },
    });

    if (!post) {
      throw new NotFoundException('Post not found or not authorized');
    }

    try {
      await this.postRepository.remove(post);
      return `Post with ID ${postId} has been deleted successfully.`;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the post.',
      );
    }
  }

  async getPosts(filters: { [key: string]: any }) {
    const { radius = '1km', 'activity type': activityType, location } = filters;

    if (!location) {
      throw new Error('Location is required to filter by radius');
    }

    const [userLatitude, userLongitude] = location
      .split(',')
      .map((coord) => parseFloat(coord.trim()));

    // Set the search radius (convert km to meters)
    const searchRadius = parseFloat(radius) * 1000 || 1000; // default to 1km

    // Retrieve posts from the database
    const query = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.activityType', 'activity');

    // Apply activity type filter if provided
    if (activityType) {
      query.andWhere('activity.type_name = :activityType', { activityType });
    }

    const posts = await query.getMany();

    // Filter posts by calculated distance
    const filteredPosts = posts.filter((post) => {
      if (!post.location) return false;

      const [postLatitude, postLongitude] = post.location
        .split(',')
        .map((coord) => parseFloat(coord.trim()));

      // Calculate the distance between user and post location
      const distance = getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: postLatitude, longitude: postLongitude }
      );

      return distance <= searchRadius;
    });

    return filteredPosts;
  }
}

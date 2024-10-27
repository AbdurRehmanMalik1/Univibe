import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Post } from 'src/posts/post.entity';

@Entity('PostImages')
export class PostImage {
  @PrimaryGeneratedColumn()
  image_id: number;

  @ManyToOne(() => Post, (post) => post.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image_url: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  uploaded_at: Date;
}

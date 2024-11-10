import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from 'src/users/user.entity';
import { Activity } from '../activity/activity.entity';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  group_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  group_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @OneToOne(() => Activity)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date;
  
  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}

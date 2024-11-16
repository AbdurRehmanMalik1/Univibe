import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, Unique } from 'typeorm';
import { Group } from '../groups/group.entity';  // Adjust path as necessary
import { User } from '../users/user.entity';    // Adjust path as necessary

@Entity('GroupMembership')
@Unique(['group_id', 'user_id'])
export class GroupMembership {
  @PrimaryColumn()
  group_id: number;

  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => Group, group => group.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User, user => user.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'joined_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  joined_at: Date;

  @Column({ type: 'varchar', length: 50, enum: ['admin', 'member'] })
  role: 'admin' | 'member';
}
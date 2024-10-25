import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity"; // Adjust the import path as necessary
import { Activity } from "../activity/activity.entity"; // Adjust the import path as necessary

@Entity()
export class Interest {
  @PrimaryGeneratedColumn()
  interest_id: number;

  @ManyToOne(() => User, (user) => user.interests)
  user: User;

  @ManyToOne(() => Activity, (activityType) => activityType.interests)
  activityType: Activity;
}

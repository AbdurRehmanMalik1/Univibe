import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import {Interest} from '../interests/interest.entity'
@Entity()
export class Activity {

  @PrimaryGeneratedColumn()
  activity_id: number;

  @Column({ type: 'varchar', length: 255, unique: true ,nullable:false})
  type_name: string;
  
  
  @OneToMany(() => Interest, (interest) => interest.activityType)
  interests: Interest[];
}



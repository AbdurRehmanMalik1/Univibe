import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Activity {

  @PrimaryGeneratedColumn()
  activity_id: number;

  @Column({ type: 'varchar', length: 255, unique: true ,nullable:false})
  type_name: string;
  
}



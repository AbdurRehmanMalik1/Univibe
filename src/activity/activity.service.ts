import { ConflictException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
    ) {}

    // Method to create a new activity
    async createActivity(activity:Partial<Activity>) {
        console.log(activity);
        try{
            this.activityRepository.find({where:{type_name:activity.type_name}});
            await this.activityRepository.save(activity);
        }
        catch(error){
            if(error instanceof QueryFailedError)
                throw new ConflictException('This activity already exists');
            throw error;
        }
    }
    // Method to get all activities
    async getAllActivities() {}

    // Method to get a single activity by ID
    async getActivityById(id: number) {}

    async getActivityByName(name : string){
        return await this.activityRepository.find({where:{type_name: name}});
    }
    // Method to update an existing activity
    async updateActivity(id: number) {}

    // Method to delete an activity
    async deleteActivity(id: number) {}
}

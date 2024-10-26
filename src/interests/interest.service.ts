import { ConflictException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegerType, QueryFailedError, Repository } from 'typeorm';
import { Interest } from './interest.entity';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';

@Injectable()
export class InterestService {
    constructor(
        @InjectRepository(Interest)
        private readonly interestRepository: Repository<Interest>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>
    ) { }

    //Get Function
    async getAllInterests(user_id: number) {
        return await this.interestRepository.find({
            where: {
                user: {
                    user_id
                }
            }
        });
    }

    // Method to get a single activity by ID
    async getInterestById(id: number) {
        return await this.interestRepository.findOne({ where: { interest_id: id } });
    }

    async getInterestByName(name: string) {
        //return await this.activityRepository.findOne({where:{type_name: name}});
    }

    async createInterest(user: Partial<User>, activity: Partial<Activity>) : Promise<any> {

        //Validating the user is not needed, already valid as per authentication
        const resultUser: User = await this.userRepository.findOne({
            where:
            {
                user_id: user.user_id
            }
        }); 
        if(!resultUser)
            throw new NotFoundException('User is not valid');

        const resultActivity: Activity = await this.activityRepository.findOne({
            where:
            {
                activity_id: activity.activity_id
            }
        });
        if (!resultActivity)
            throw new NotFoundException('Activity is not valid');

        const interest: Partial<Interest> = {
            user: resultUser,
            activity: resultActivity,
        };

        const creationResult = await this.interestRepository.save(interest);
    }


    // Method to update an existing activity
    async updateInterest(id: number) { }

    // Method to delete an activity
    async deleteInterest(id: number) { }
}

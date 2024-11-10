import { BadRequestException, Injectable } from '@nestjs/common';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { join } from 'path';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(Group)
        private userRepository: Repository<User>,
    ) {}

    async addGroup(group: Partial<Group>): Promise<Group> {
        const result = await this.groupRepository.save(group);
        if (result) {
            return result;
        }
        throw new BadRequestException('Could not create the group');
    }
    async getAll() {
        const groups = await this.groupRepository.find({
          relations: ['activity', 'owner'], 
        });
        return groups.map(({ activity, owner, ...group }) => ({
            ...group,
            activity,
            owner:{
                user_id: owner?.user_id,
                user_name: owner?.user_name,
            }
        }));
    }


}

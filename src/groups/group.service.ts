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


    // async getAll(): Promise<Group[]> {
    //     return this.groupRepository.find({});
    // }
    async addGroup(group: Partial<Group>) {
        return await this.groupRepository.save(group);
    }
    async getAll() {
        const groups = await this.groupRepository.find({
          relations: ['activity', 'owner'], 
        });
        return groups.map(({ activity, owner, ...group }) => ({
            ...group,
            activity_type_name: activity?.type_name,
            owner_user_name: owner?.user_name,
        }));
          
        // return groups.map((group:Group) => ({
        //   group_id:group.group_id,
        //   group_name:group.group_name,
        //   description:group.description||null,
        //   createdAt:group.createdAt,
        //   activity_type_name: group.activity?.type_name,
        //   owner_user_name: group.owner?.user_name,
        // }));
      }


}

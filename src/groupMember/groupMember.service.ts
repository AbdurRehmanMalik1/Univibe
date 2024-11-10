import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupMembership } from './groupMember.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/groups/group.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class GroupMembershipService {
    constructor(
        @InjectRepository(GroupMembership)
        private groupMembershipRepository: Repository<GroupMembership>,
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
    ) { }

    async addMember(user: Partial<User>, group: Partial<Group>, role: 'member' | 'admin' = 'member'): Promise<any> {
        const groupExists = await this.groupRepository.findOne({ where: group });
        if (!groupExists)
            throw new BadRequestException("This group does not exist");

        const existingMembership = await this.groupMembershipRepository.findOne({
            where: { user: user as User, group: groupExists as Group },
        });
        if (existingMembership) {
            throw new BadRequestException('User is already a member of this group');
        }

        const groupMembership: Partial<GroupMembership> = {
            user: user as User,
            group: group as Group,
            role, 
        }

        return this.groupMembershipRepository.save(groupMembership);
    }

    async getAll(group: Partial<Group>): Promise<any> {
        const groupExists = await this.groupRepository.findOne({ where: group });
        if (!groupExists)
            throw new BadRequestException('Group does not exist');

        const groupMemberships: GroupMembership[] = await this.groupMembershipRepository.find({
            where: { group },
            relations: ['user'],
        });

        return groupMemberships.map(({ user, role }) => ({
            user_id: user.user_id,
            user_name: user.user_name,
            role,
        }));
    }
}


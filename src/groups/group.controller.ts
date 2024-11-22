import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Get,
  Head,
  Header,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GroupService } from './group.service';
import { User } from 'src/users/user.entity';
import { Group } from './group.entity';
import { Activity } from 'src/activity/activity.entity';
import { GroupMembershipService } from 'src/groupMember/groupMember.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => GroupMembershipService)) // Using forwardRef to resolve circular dependency
    private readonly groupMembershipService: GroupMembershipService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAll() {
    const groups = await this.groupService.getAll();
    if (groups.length === 0) {
      return {
        message: 'No groups found.',
        groups: [],
      };
    }
    return {
      message: 'Here are the groups',
      groups,
    };
  }

  @Post('create-group')
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @Request() req,
    @Body()
    {
      group_name,
      description,
      activity_id,
    }: { group_name: string; description: string; activity_id: number },
  ) {
    const user_id = req.user.user_id;

    if (!group_name || !activity_id || !description) {
      throw new HttpException(
        'All fields (group_name, description, activity_id) are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    
    const activity: Partial<Activity> = { activity_id };
    const owner: Partial<User> = { user_id };

    const group: Partial<Group> = {
      group_name,
      description,
      activity: activity as Activity,
      owner: owner as User,
    };

    const createdGroup = await this.groupService.addGroup(group);

    await this.groupMembershipService.addMember(
      owner as User,
      createdGroup,
      'owner',
    );

    return {
      message: 'Group created successfully',
      group: createdGroup,
    };
  }

  @Delete('delete-group')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Request() req, @Body() body: {group_id: number}){
    const groupId = body.group_id;
    const userId = req.user_id;
    await this.groupService.deleteGroup(userId, groupId);

  }
}

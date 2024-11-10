import { BadRequestException, Body, Controller, Get, Head, Header, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GroupService } from './group.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { Group } from './group.entity';
import { Activity } from 'src/activity/activity.entity';

@Controller('groups')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly authService: AuthService,
    ) { }


    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAll() {
        const groups = await this.groupService.getAll();
        return {
          message: "Here are the groups",
          groups,
        };
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async createGroup( @Req() req: Request,
    @Body() { group_name, description,activity_id}: 
    { group_name: string, description: string ,activity_id:number}) {
        const owner: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);
        
        if (!group_name  || !activity_id) {
            throw new BadRequestException('All fields (group_name, description, activity_id) are required');
        }
        
        const activity: Partial<Activity> ={
            activity_id
        }
        const group : Partial<Group> = {
            group_name,
            description,
            activity: activity as Activity,
            owner:owner as User
        }
        const result = await this.groupService.addGroup(group);
        
        return {
            message: "Group Created Succesfully"
        }
    }
}

import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { GroupMembershipService } from './groupMember.service';
import { Group } from 'src/groups/group.entity';

@Controller('group-memberships')
export class GroupMembershipController {

    constructor(private groupMembershipService: GroupMembershipService, private authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async addGroupMember(@Req() req: Request, @Body('group_id') group_id: number) {
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);

        if (!group_id)
            throw new BadRequestException("Invalid Paramters: Group ID is missing")

        const group: Partial<Group> = { group_id };
        try {
            await this.groupMembershipService.addMember(user, group);
            return {
                message: "You have successfully joined the requested group"
            };
        } catch (error) {
            throw new BadRequestException('Failed to join group: ' + error.message);
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAll(@Req() req: Request, @Body('group_id') group_id: number) {
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);
        if (!group_id)
            throw new BadRequestException("Invalid Paramters: Group ID is missing")
        const group: Partial<Group> = { group_id };
        try{
            const retrievedMembers : Partial<User>[] = await this.groupMembershipService.getAll(group);
            return {
                message:"Retrievd Group Members sucessfully",
                retrievedMembers
            }
        }catch(error){
            throw new BadRequestException("Failed to join group: " + error.message);
        }
    }
}

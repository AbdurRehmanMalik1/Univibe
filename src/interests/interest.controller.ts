import {
    Controller,
    Get,
    UseGuards,
    Request,
    Header,
    UnauthorizedException,
    NotFoundException,
    Body,
    Post,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';


@Controller('interest')
export class InterestController {
    constructor(
        private readonly interestService: InterestService,
        private readonly authService: AuthService
    ) { }
    @UseGuards(JwtAuthGuard)  // Ensure JwtAuthGuard is applied
    @Get('/')
    async getAllInterests(@Request() req:Request) {
        const authorization =req.headers['authorization'];
        console.log(authorization);
        const user: Partial<User>  = await this.authService.identifyUser(authorization);
        
        const interests = await this.interestService.getAllInterests(user.user_id);
        console.log(user);
        return {
            message:"User interests recieved",
            interests,
        };
    }

    @UseGuards(JwtAuthGuard)  // Ensure JwtAuthGuard is applied
    @Post('/')
    async createInterest(@Request() req:Request, @Body('activity_id') activity_id : number) {
        const authorization =req.headers['authorization'];
        console.log(authorization);
        
        const user: Partial<User>  = await this.authService.identifyUser(authorization);
        const activity: Partial<Activity> = {
            activity_id
        }

        const result = await this.interestService.createInterest(user,activity);
        console.log(result);
        
        return {
            message:"Interest has been added",
        };
    }
    
    
}

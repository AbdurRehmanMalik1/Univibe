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
    Delete,
    Param,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';
import { Interest } from './interest.entity';


@Controller('interest')
export class InterestController {
    constructor(
        private readonly interestService: InterestService,
        private readonly authService: AuthService
    ) { }


    //Only get the InterestIds
    @UseGuards(JwtAuthGuard)  // Ensure JwtAuthGuard is applied
    @Get('/id')
    async getAllInterestIds(@Request() req: Request) {
        const authorization = req.headers['authorization'];
        console.log(authorization);
        const user: Partial<User> = await this.authService.identifyUser(authorization);

        const interests = await this.interestService.getAllInterestIds(user.user_id);

        return {
            message: "User interests recieved",
            interests,
        };
    }
    @UseGuards(JwtAuthGuard)  // Ensure JwtAuthGuard is applied
    @Get('/')
    async getAllInterest(@Request() req: Request) {
        const authorization = req.headers['authorization'];
        console.log(authorization);
        const user: Partial<User> = await this.authService.identifyUser(authorization);

        const interests = await this.interestService.getAllInterests(user.user_id);
        console.log(interests);
        return {
            message: "User interests recieved",
            interests,
        };
    }
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createInterest(@Request() req: Request, @Body('activity_id') activity_id: number) {
        const authorization = req.headers['authorization'];
        console.log(authorization);

        const user: Partial<User> = await this.authService.identifyUser(authorization);
        const activity: Partial<Activity> = {
            activity_id
        }

        const result = await this.interestService.createInterest(user, activity);

        return {
            message: "Interest has been added",
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteInterest(@Request() req: Request, @Param('id') interest_id: number) {
        const authorization = req.headers['authorization'];
        console.log(authorization);

        const user: Partial<User> = await this.authService.identifyUser(authorization);
        
        const interest : Partial<Interest> = {
            interest_id,
        }
        await this.interestService.deleteInterest(interest)
        return {
            message:"Interest has been deleted Successfully"
        }
    }
    

}

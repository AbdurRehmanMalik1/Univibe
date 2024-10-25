import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';
import { IntegerType } from 'typeorm';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
  ) { }

  @Get('/')
  async getAllActivity() {
    const activities = await this.activityService.getAllActivities();
    return {
      message: "Successfully retrieved all activities",
      activities,
    };
  }
  @Get('/id/:id')
  async getActivityBy(@Param('id') id: number) {
    const activity = await this.activityService.getActivityById(id);
    console.log(activity);
    if (!activity)
      throw new ConflictException("No activity found");
    return {
      message: "Successfully found the activity",
      activity,
    }
  }


  @Get('/name/:name')
  async getActivity(@Param('name') name: string) {
    const activity = await this.activityService.getActivityByName(name);
    if (!activity) {
      throw new NotFoundException("No activity found");
    }
    return {
      message: "Successfully found the activity",
      activity,
    };
  }

  @Post('/')
  async createActivity(@Body('name') name: string) {
    if(!name)
      throw new BadRequestException("Name Parameter is missing");

    const activity: Partial<Activity> = {
      type_name: name,
    };
    await this.activityService.createActivity(activity);
    return {
      message: "Activity has been created successfully",
    };

  }
}

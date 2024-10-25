import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    BadRequestException,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    NotFoundException,
    Res,
    ConflictException,
  } from '@nestjs/common';
import { IntegerType } from 'typeorm';
import {Activity} from './activity.entity';
import { ActivityService } from './activity.service';
import { Http2ServerResponse } from 'node:http2';
import { Response } from 'express';
import { exitCode } from 'node:process';

@Controller('activity')
export class ActivityController{
    constructor(
        private readonly activityService: ActivityService,
      ) {}
     
      @Get('/:name')
      async getActivity(@Param('name') name: string ,@Res()res:Response) {
          const activities = await this.activityService.getActivityByName(name); 
          if (activities.length== 0) {
              throw new NotFoundException(`No activity found`);
          }
          return res.status(HttpStatus.OK).json({
            message: "Successfully found activities",
            activities,
          });
      }
      @Post('/')
      async createActivity(@Body('name') name:string,@Res()res:Response){
        const activity: Partial<Activity>= {
          type_name:name,
        };
        try{
          const result = await this.activityService.createActivity(activity); 
        }
        catch(exception){
          return res.status(exception.status).json({
            message:exception.message
          });
        }
        return res.status(HttpStatus.CREATED).json({
           message:"Activity has been created successfully"
        });
      }
}
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
    UseGuards,
    Request,
    Put,
    HttpCode
} from '@nestjs/common';

import { UserContacts } from './userContacts.entity';
import { UserContactsService } from './userContacts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';


@Controller('contacts')
export class UserContactController {
    constructor(
        private readonly contactsService: UserContactsService,
        private readonly authService: AuthService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getContacts(@Request() req: Request) {

        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);

        const contacts : UserContacts[] = await this.contactsService.getAllContacts(user.user_id);

        return {
            message:"Retrieved User Contacts",
            contacts
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async addContact(@Request() req: Request, @Body('contact_type') contact_type: string, @Body('contact_value') contact_value: string,) {
        console.log(req.headers['authorization']);
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);

        if (!contact_type || !contact_value)
            throw new BadRequestException("Parameters are invalid");
        const result = await this.contactsService.addContact(user.user_id, contact_type, contact_value);

        return {
            message:"Contact added Successfully"
        }
    }
    @UseGuards(JwtAuthGuard)
    @Put('/')
    async replaceContact(@Request() req: Request,@Body('contact_id')contact_id:number, @Body('contact_type') contact_type: string, @Body('contact_value') contact_value: string,) {
    
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);

        if (!contact_type || !contact_value || !contact_id)
            throw new BadRequestException("Parameters are invalid");
        const result = await this.contactsService.replaceContact(user.user_id,contact_id, contact_type, contact_value);

        return {
            message:"Contact updated Successfully"
        }
    }
    @UseGuards(JwtAuthGuard)
    @Delete('/')
    async deleteContact(@Request() req: Request,@Body('contact_id') contact_id : number) {

        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);

        if (!contact_id)
            throw new BadRequestException("Contact Id is missing");
        const result = await this.contactsService.deleteContactById(user.user_id,contact_id);

        return {
            message:"Contact deleted Successfully"
        }
    }

}

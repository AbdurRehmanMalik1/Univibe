import { Controller } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly authService: AuthService,
    ) { }


}

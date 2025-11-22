import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    @Get('/online')
    public getUserOnline() {
        return this.userService.getUserOnline();
    }
}

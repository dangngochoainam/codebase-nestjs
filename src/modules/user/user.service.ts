import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    public constructor() {}

    public getUserOnline() {
        const userOnline = {
            id: 123,
            name: 'Nguyen van A',
        };
        const listUserOnline = [userOnline];
        return listUserOnline;
    }
}

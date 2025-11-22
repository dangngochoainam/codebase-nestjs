import { BadRequestException, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { SYSTEM_CODE } from 'src/common/constants/system-code.constants';
import {
    ContextLogger,
    ContextLoggerService,
} from 'src/common/logger/base-logger.service';
import { IAlsContext } from 'src/common/middleware/async-local-storage';

@Injectable()
export class UserService {
    private readonly logger: ContextLogger;

    public constructor(
        private readonly als: AsyncLocalStorage<IAlsContext>,
        protected readonly contextLoggerService: ContextLoggerService,
    ) {
        this.logger = contextLoggerService.newContextLogger(
            this.constructor.name,
        );
    }

    public getUserOnline() {
        const requestId = this.als.getStore().requestId;

        const userOnline = {
            id: 123,
            name: 'Nguyen van A',
        };
        const listUserOnline = [userOnline];

        this.logger.info('hahaah', { requestId });

        this.logger.error(
            '[ERROR] getUserOnline',
            new BadRequestException(
                SYSTEM_CODE.NOT_FOUND,
                'getUserOnline error',
            ),
            { requestId },
        );

        // throw new BadRequestException(error);
        return listUserOnline;
    }
}

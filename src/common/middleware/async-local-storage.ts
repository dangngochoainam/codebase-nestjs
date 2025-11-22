import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface IAlsContext {
    requestId: string;
}

@Global()
@Module({
    providers: [
        {
            provide: AsyncLocalStorage,
            useValue: new AsyncLocalStorage<IAlsContext>(),
        },
    ],
    exports: [AsyncLocalStorage],
})
export class AlsModule {}

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from 'src/middleware'
//controller

import { TestController } from '../Controller/test/test.controller';
//services

import { TestService } from '../service/test.service';

@Module({
    imports: [],
    controllers: [TestController],
    providers: [TestService],
})
export class TestModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: 'cats', method: RequestMethod.GET });
    }
}

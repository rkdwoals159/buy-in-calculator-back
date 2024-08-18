import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from 'src/middleware'
//controller
import { AppController } from '../Controller/app/app.controller';
import { UserController } from '../Controller/user/user.controller'
//services
import { AppService } from '../service/app.service';
import { TestModule } from './test.module'
import { PrismaService } from 'src/service/prisma.service';
import { UserService } from 'src/service/user.service';
import { PostService } from 'src/service/post.service';
import { AuthController } from 'src/Controller/auth/auth.controller';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [TestModule, GameModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {

}

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SessionMiddleware } from '@app/modules/session/middlewares/session.middleware';
import { SessionModule } from '@app/modules/session/session.module';
import { UserModule } from '@app/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from '@app/configs/app.config';
import dbConfig from '@app/configs/db.config';

@Module({
  imports: [
    SessionModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MongooseModule.forRoot(dbConfig.uri)
  ]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(
      { path: 'user/get', method: RequestMethod.GET },
      { path: 'user/get/patients', method: RequestMethod.GET },
      { path: 'user/delete', method: RequestMethod.DELETE },
      { path: 'user/put', method: RequestMethod.PUT },
    );
  }
}
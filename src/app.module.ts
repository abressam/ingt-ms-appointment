import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SessionMiddleware } from '@app/modules/session/middlewares/session.middleware';
import { AppointmentModule } from '@app/modules/appointment/appointment.module';
import { AppointmentController } from '@app/modules/appointment/controllers/appointment.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from '@app/configs/app.config';
import dbConfig from '@app/configs/db.config';

@Module({
  imports: [
    AppointmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MongooseModule.forRoot(dbConfig.uri)
  ]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(AppointmentController);
  }
}
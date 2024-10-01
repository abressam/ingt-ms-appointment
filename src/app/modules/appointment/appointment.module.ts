import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '@app/modules/appointment/models/appointment.model';
import { AppointmentService } from '@app/modules/appointment/services/appointment.service';
import { AppointmentController } from '@app/modules/appointment/controllers/appointment.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule  {}
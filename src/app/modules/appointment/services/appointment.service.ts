import { AppointmentServiceInterface } from '@app/modules/appointment/services/appointment.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '@app/modules/appointment/models/appointment.model';
import { AppointmentDto } from '@app/modules/appointment/dtos/appointment.dto';
import { DeleteAppointmentResDto } from '@app/modules/appointment/dtos/responses/delete-appointment-res.dto';
import { GetAppointmentResDto } from '@app/modules/appointment/dtos/responses/get-appointment-res.dto';
import { PostAppointmentReqDto } from '@app/modules/appointment/dtos/requests/post-appointment-req.dto';
import { PutAppointmentReqDto } from '@app/modules/appointment/dtos/requests/put-appointment-req.dto';
import { generateUuid, convertToISODate } from '@app/modules/appointment/utils/appointment.util';

@Injectable()
export class AppointmentService implements AppointmentServiceInterface {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
  ) {}

  async getAppointment(
    crp: string, 
    date?: string,
    pacientId?: number
): Promise<GetAppointmentResDto> {
    this.validateAuth(crp);
    const filter: any = { crp: crp };

    if (date) {
        const ISOdate = convertToISODate(date);
        filter.date = ISOdate;
     }
 
    if (pacientId) {
        filter.pacientId = pacientId;
    }
 
    const appointments = await this.appointmentModel.find(filter).exec();
 
    if (!appointments || appointments.length === 0) {
        return { appointment: [] };
    }
 
    return { 
       appointment: appointments.map(appointment => appointment) 
    };
  }

  async postAppointment(crp: string, body: PostAppointmentReqDto): Promise<GetAppointmentResDto> {
    this.validateAuth(crp);
    const uuid = generateUuid();

    const createdAppointment = new this.appointmentModel({
      ...body,
      uuid: uuid,
    });
    
    const appointment = await createdAppointment.save();

    return {
      appointment: [{
        crp: appointment.crp,
        pacientId: appointment.pacientId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        type: appointment.type,
        location: appointment.location
      }],
    };
  }

  async putRDP(crp: string, body: PutAppointmentReqDto): Promise<GetAppointmentResDto> {
    this.validateAuth(crp);

    const appointmentOld = await this.appointmentModel.findOne({ uuid: body.uuid }).exec();

    this.validateAppointment(appointmentOld);

    const appointmentNew = Object.assign({}, appointmentOld.toObject(), body);

    await this.appointmentModel.updateOne(
        { uuid: body.uuid },
        {
          $set: {
            date: appointmentNew.date,
            startTime: appointmentNew.startTime,
            endTime: appointmentNew.endTime,
            type: appointmentNew.type,
            location: appointmentNew.location,              
          }
        }
    );

    return {
      appointment: [{
        crp: appointmentNew.crp,
        pacientId: appointmentNew.pacientId,
        date: appointmentNew.date,
        startTime: appointmentNew.startTime,
        endTime: appointmentNew.endTime,
        type: appointmentNew.type,
        location: appointmentNew.location
        }],
    };
  }

  async deleteAppointment(crp: string, uuid: string): Promise<DeleteAppointmentResDto> {
    this.validateAuth(crp);

    const appointment = await this.appointmentModel.findOne({ uuid: uuid }).exec();

    this.validateAppointment(appointment);

    await appointment.deleteOne();

    return {
      statusCode: 200,
      message: 'RPD successfully deleted',
    };
  }

  private validateAppointment(appointment: AppointmentDto) {
    if (!appointment) {
      throw new HttpException('No RPD register found', HttpStatus.NOT_FOUND);
    }
  }

  private validateAuth(user: string) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}
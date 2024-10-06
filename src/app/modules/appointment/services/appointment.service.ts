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
    startDate?: string,
    endDate?: string,
    patientId?: string
  ): Promise<GetAppointmentResDto> {
    this.validateAuth(crp);
    const filter: any = { crp: crp };

    if (startDate && !endDate) {
      throw new HttpException('endDate is required when startDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (!startDate && endDate) {
      throw new HttpException('startDate is required when endDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (startDate) {
      const ISOstartDate = convertToISODate(startDate);
      filter.date = { $gte: ISOstartDate }; // Adiciona um filtro para >= startDate
    }

    if (endDate) {
      const ISOendDate = convertToISODate(endDate);
      if (filter.date) {
        filter.date = { ...filter.date, $lte: ISOendDate }; // Adiciona um filtro para <= endDate
      } else {
        filter.date = { $lte: ISOendDate }; // Cria um novo filtro para <= endDate
      }
    }
 
    if (patientId) {
        filter.patientId = patientId;
    }
 
    const appointments = await this.appointmentModel.find(filter).exec();
 
    if (!appointments || appointments.length === 0) {
        return { appointment: [] };
    }
 
    return { 
       appointment: appointments.map(appointment => appointment) 
    };
  }

  async getMyAppointments(
    patientId: string, 
    date?: string,
  ): Promise<GetAppointmentResDto> {
    this.validateAuth(patientId);
    const filter: any = { patientId: patientId };

    if (date) {
        const ISOdate = convertToISODate(date);
        filter.date = ISOdate;
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

    if(crp == null) {
      throw new HttpException('Only professionals can create appointments', HttpStatus.UNAUTHORIZED);
    }

    const uuid = generateUuid();

    const existingAppointment = await this.appointmentModel.findOne({
      date: body.date,
      $or: [
        {
          startTime: { $lte: body.endTime, $gte: body.startTime }
        },
        {
          endTime: { $gte: body.startTime, $lte: body.endTime }
        },
        {
          $and: [
            { startTime: { $lte: body.startTime } },
            { endTime: { $gte: body.endTime } }
          ]
        }
      ]
    });

    if (existingAppointment) {
      throw new HttpException('There is already an appointment at this date and time', HttpStatus.BAD_REQUEST);
    }

    const createdAppointment = new this.appointmentModel({
      ...body,
      crp: crp,
      uuid: uuid,
    });
    
    const appointment = await createdAppointment.save();

    return {
      appointment: [{
        crp: appointment.crp,
        patientId: appointment.patientId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        type: appointment.type,
        location: appointment.location
      }],
    };
  }

  async putAppointment(crp: string, body: PutAppointmentReqDto): Promise<GetAppointmentResDto> {
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
        patientId: appointmentNew.patientId,
        date: appointmentNew.date,
        startTime: appointmentNew.startTime,
        endTime: appointmentNew.endTime,
        type: appointmentNew.type,
        location: appointmentNew.location
        }],
    };
  }

  async patchLinkAppointment(patientId: string, uuid: string): Promise<GetAppointmentResDto> {
    this.validateAuth(patientId);

    if(patientId === null) {
      throw new HttpException('Only pacients can link to appointment', HttpStatus.UNAUTHORIZED);
    }

    const appointment = await this.appointmentModel.findOne({ uuid: uuid }).exec();

    this.validateAppointment(appointment);

    if (appointment.patientId) {
      throw new HttpException('This appointment is already linked to a patient', HttpStatus.BAD_REQUEST);
    }

    appointment.patientId = patientId; // Atualiza o patientId
    await appointment.save(); // Salva as mudanças

    return {
      appointment: [{
        crp: appointment.crp,
        patientId: appointment.patientId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        type: appointment.type,
        location: appointment.location
        }],
    };
  }

  async patchCancelAppointment(uuid: string, patientId: string): Promise<GetAppointmentResDto> {
    this.validateAuth(patientId);

    const appointment = await this.appointmentModel.findOne({ uuid: uuid }).exec();

    this.validateAppointment(appointment);

    if(patientId != appointment.patientId) {
      throw new HttpException('Only the linked patientId can cancel the appointment', HttpStatus.UNAUTHORIZED);
    }

    if (!appointment.patientId) {
      throw new HttpException('This appointment is already cancelled or not linked to a patient', HttpStatus.BAD_REQUEST);
    }

    appointment.patientId = null; // Atualiza o patientId
    await appointment.save(); // Salva as mudanças

    return {
      appointment: [{
        crp: appointment.crp,
        patientId: appointment.patientId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        type: appointment.type,
        location: appointment.location
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
      message: 'Appointment successfully deleted',
    };
  }

  private validateAppointment(appointment: AppointmentDto) {
    if (!appointment) {
      throw new HttpException('No appointment register found', HttpStatus.NOT_FOUND);
    }
  }

  private validateAuth(user: any) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}
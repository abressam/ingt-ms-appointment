import { AppointmentService } from '@app/modules/appointment/services/appointment.service';
import { AppointmentControllerInterface } from '@app/modules/appointment/controllers/appointment.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { DeleteAppointmentResDto } from '@app/modules/appointment/dtos/responses/delete-appointment-res.dto';
import { GetAppointmentResDto } from '@app/modules/appointment/dtos/responses/get-appointment-res.dto';
import { PostAppointmentReqDto } from '@app/modules/appointment/dtos/requests/post-appointment-req.dto';
import { PutAppointmentReqDto } from '@app/modules/appointment/dtos/requests/put-appointment-req.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Request,
  Query,
  Body,
  HttpCode,
  HttpException,
  Logger,
  Param,
} from '@nestjs/common';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController implements AppointmentControllerInterface {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('get')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get the appointment data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the appointment data',
    type: GetAppointmentResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getAppointment(
    @Request() req: Request,
    @Query('date') date?: string,
    @Query('pacientId') pacientId?: number,
  ) {
    const logger = new Logger(AppointmentController.name);

    try {
      const user = req['crp'];
      logger.log('getAppointment()');
      return await this.appointmentService.getAppointment(user, date, pacientId);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  
  @Get('get/my-appointments')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all the client data appointments' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the data from all client data appointments',
    type: GetAppointmentResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getMyAppointments(@Request() req: Request) {
    const logger = new Logger(AppointmentController.name);

    try {
      const user = req['pacientId'];
      logger.log('getMyAppointments()');
      return await this.appointmentService.getMyAppointments(user);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Post('post')
  @HttpCode(200)
  @ApiOperation({ summary: 'Post the appointment data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the appointment data',
    type: GetAppointmentResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postAppointment(@Request() req: Request, @Body() body: PostAppointmentReqDto) {
    const logger = new Logger(AppointmentController.name);

    try {
      const user = req['crp'];
      logger.log('postAppointment()');
      return await this.appointmentService.postAppointment(user, body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Put('put')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Put the appointment data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the appointment data',
    type: GetAppointmentResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async putAppointment(@Request() req: Request, @Body() body: PutAppointmentReqDto) {
    const logger = new Logger(AppointmentController.name);

    try {
      const user = req['crp'];
      logger.log('putAppointment()');
      return await this.appointmentService.putAppointment(user, body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Delete the appointment data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the appointment status',
    type: DeleteAppointmentResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async deleteAppointment(@Request() req: Request, @Param() uuid: string) {
    const logger = new Logger(AppointmentController.name);

    try {
      const user = req['crp'];      
      logger.log('deleteAppointment()');
      return await this.appointmentService.deleteAppointment(user, uuid);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
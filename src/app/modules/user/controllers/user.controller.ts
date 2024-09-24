import { UserService } from '@app/modules/user/services/user.service';
import { UserControllerInterface } from '@app/modules/user/controllers/user.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { DeleteUserResDto } from '@app/modules/user/dtos/responses/delete-user-res.dto';
import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { PostUserReqDto } from '@app/modules/user//dtos/requests/post-user-req.dto';
import { PutUserReqDto } from '@app/modules/user/dtos/requests/put-user-req.dto';
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
  Body,
  HttpCode,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GetUsersByCrpResDto } from '../dtos/responses/get-users-by-crp-res.dto';
import { GetUsersByPatientIdResDto } from '../dtos/responses/get-users-by-patientId-res.dto';

@ApiTags('user')
@Controller('user')
export class UserController implements UserControllerInterface {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getUser(@Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const user = req['cpfCnpj'];
      logger.log('getUser()');
      return await this.userService.getUser(user);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  
  @Get('get/professionals')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all the data from the professionals' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the data from all the professionals',
    type: GetUsersByCrpResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getUsersByCrp() {
    const logger = new Logger(UserController.name);

    try {
      logger.log('getUsersByCrp()');
      return await this.userService.getUsersByCrp();
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Get('get/patients')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get all the data from the patients' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the data from all the patients',
    type: GetUsersByPatientIdResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getUsersByPatientId(@Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const user = req['cpfCnpj'];
      const crp = req['crp'];
      logger.log('getUsersByPatientId()');
      return await this.userService.getUsersByPatientId(user, crp);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Post('post')
  @HttpCode(200)
  @ApiOperation({ summary: 'Post the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postUser(@Body() body: PostUserReqDto) {
    const logger = new Logger(UserController.name);

    try {
      logger.log('postUser()');
      return await this.userService.postUser(body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Put('put')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Put the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async putUser(@Body() body: PutUserReqDto, @Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const user = req['cpfCnpj'];
      logger.log('putUser()');
      return await this.userService.putUser(user, body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Delete the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user status',
    type: DeleteUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async deleteUser(@Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const user = req['cpfCnpj'];      
      logger.log('deleteUser()');
      return await this.userService.deleteUser(user);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
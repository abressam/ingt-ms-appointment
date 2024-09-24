import { UserServiceInterface } from '@app/modules/user/services/user.service.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteUserResDto } from '@app/modules/user/dtos/responses/delete-user-res.dto';
import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { GetUsersByCrpResDto } from '@app/modules/user/dtos/responses/get-users-by-crp-res.dto';
import { GetUsersByPatientIdResDto } from '@app/modules/user/dtos/responses/get-users-by-patientId-res.dto';
import { PostUserReqDto } from '@app/modules/user/dtos/requests/post-user-req.dto';
import { PutUserReqDto } from '@app/modules/user/dtos/requests/put-user-req.dto';
import { UserDto } from '@app/modules/user/dtos/user.dto';
import { User } from '@app/modules/user/models/user.model';
import { encodePassword } from '@app/modules/session/utils/session.util';
import { generatepatientId, generateUuid, convertToISODate } from '@app/modules/user/utils/user.util'; 

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async getUser(user: string): Promise<GetUserResDto> {
    this.validateAuth(user);

    const userObject = await this.userModel.findOne({ cpfCnpj: user }).select('-password -cpfCnpj').exec(); 
    // execute query and return a promise

    // console.log('user:', user);

    this.validateUser(userObject);

    return { user: userObject };
  }

  async getUsersByCrp(): Promise<GetUsersByCrpResDto> {
    const users = await this.userModel
      .find({ crp: { $ne: null } })
      .select('-password -cpfCnpj')
      .exec()

      return { user: users.map(user => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        crp: user.crp,
      })) };
  }

  async getUsersByPatientId(user: string, responsibleCrp: string): Promise<GetUsersByPatientIdResDto> {
    this.validateAuth(user);

    const users = await this.userModel
      .find({ responsibleCrp })
      .select('-password -cpfCnpj')
      .exec()

      return { user: users.map(user => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        patientId: user.patientId,
      })) };
  }

  async postUser(body: PostUserReqDto): Promise<GetUserResDto> {
    const salt = this.configService.get('auth.salt');
    let patientId = null;
    let isoBirthdate = null;

    await this.checkCpfCnpjExists(body.cpfCnpj);

    if (body.password) {
      body.password = encodePassword(salt, body.password);
    }

    if (body.crp) {
      await this.checkCrpExists(body.crp);
    } 
    
    if (!body.crp) {

      const crpExists = await this.userModel.exists({ crp: body.responsibleCrp });
      if (!crpExists) {
        throw new HttpException('CRP not found in the system.', HttpStatus.BAD_REQUEST);
      }

      patientId = generatepatientId(body.cpfCnpj);
    }

    if (body.birthdate) {
      isoBirthdate = convertToISODate(body.birthdate);

      if (!isoBirthdate) {
        throw new HttpException('Invalid birthdate format. Please use DD-MM-YYYY.', HttpStatus.BAD_REQUEST);
      }
    }

    const createdUser = new this.userModel({
      cpfCnpj: body.cpfCnpj,
      name: body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      crp: body.crp,
      birthdate: isoBirthdate,
      password: body.password,
      patientId,
      responsibleCrp: body.responsibleCrp,
      uuid: generateUuid(body.cpfCnpj), // generate a uuid
    });
    
    const savedUser = await createdUser.save();

    const { password, cpfCnpj, ...user } = savedUser.toObject();

    return {
      user: {
        name: user.name,
        address: user.address,
        phone: user.phone,
        email: user.email,
        birthdate: user.birthdate,
        crp: user.crp,
        responsibleCrp: user.responsibleCrp,
        patientId: user.patientId
      },
    };
  }


  async putUser(user: string, body: PutUserReqDto): Promise<GetUserResDto> {
    const salt = this.configService.get('auth.salt');

    this.validateAuth(user);

    const userOld = await this.userModel.findOne({ cpfCnpj: user }).select('-password -cpfCnpj').exec();

    this.validateUser(userOld);

    if (body.password) {
      body.password = encodePassword(salt, body.password);
    }

    const userNew = Object.assign({}, userOld.toObject(), body);

    await this.userModel.updateOne(
        { cpfCnpj: user },
        {
          $set: {
              address: userNew.address,
              phone: userNew.phone,
              password: userNew.password,               
          }
        }
    );

    return {
      user: {
        name: userNew.name,
        address: userNew.address,
        phone: userNew.phone,
        email: userNew.email,
        birthdate: userNew.birthdate,
        crp: userNew.crp,
        responsibleCrp: userNew.responsibleCrp,
        patientId: userNew.patientId
      },
    };
  }

  async deleteUser(user: string): Promise<DeleteUserResDto> {
    this.validateAuth(user);

    const userObject = await this.userModel.findOne({ cpfCnpj: user });

    this.validateUser(userObject);

    await userObject.deleteOne({ cpfCnpj: user });

    return {
      statusCode: 200,
      message: 'User successfully deleted',
    };
  }

  private validateUser(user: UserDto) {
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
  }

  private validateAuth(user: string) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }

  private async checkCpfCnpjExists(cpfCnpj: string) {
    const existingUser = await this.userModel.findOne({ cpfCnpj }).exec();
    if (existingUser) {
      throw new HttpException('CPF/CNPJ alreay registered', HttpStatus.BAD_REQUEST);
    }
  }

  private async checkCrpExists(crp: string) {
    const crpExists  = await this.userModel.findOne({ crp }).exec();
    if (crpExists) {
      throw new HttpException('CRP alreay registered', HttpStatus.BAD_REQUEST);
    }
  }

}
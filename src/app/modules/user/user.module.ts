import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/modules/user/models/user.model';
import { UserService } from '@app/modules/user/services/user.service';
import { UserController } from '@app/modules/user/controllers/user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule  {}

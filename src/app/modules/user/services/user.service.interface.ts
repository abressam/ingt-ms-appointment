import { DeleteUserResDto } from '@app/modules/user/dtos/responses/delete-user-res.dto';
import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { GetUsersByCrpResDto } from '@app/modules/user/dtos/responses/get-users-by-crp-res.dto';
import { GetUsersByPatientIdResDto } from '@app/modules/user/dtos/responses/get-users-by-patientId-res.dto';
import { PutUserReqDto } from '@app/modules/user/dtos/requests/put-user-req.dto';
import { PostUserReqDto } from '../dtos/requests/post-user-req.dto';

export interface UserServiceInterface {
  getUser(userUuid: string): Promise<GetUserResDto>;
  getUsersByCrp(): Promise<GetUsersByCrpResDto>;
  getUsersByPatientId(userUuid: string, responsibleCrp: string): Promise<GetUsersByPatientIdResDto>;
  postUser(body: PostUserReqDto): Promise<GetUserResDto>
  putUser(userUuid: string, body: PutUserReqDto): Promise<GetUserResDto>;
  deleteUser(userUuid: string): Promise<DeleteUserResDto>;
}
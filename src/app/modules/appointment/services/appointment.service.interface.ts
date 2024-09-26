import { DeleteAppointmentResDto } from '@app/modules/appointment/dtos/responses/delete-appointment-res.dto';
import { GetAppointmentResDto } from '@app/modules/appointment/dtos/responses/get-appointment-res.dto';
import { PostAppointmentReqDto } from '@app/modules/appointment/dtos/requests/post-appointment-req.dto';
import { PutAppointmentReqDto } from '@app/modules/appointment/dtos/requests/put-appointment-req.dto';

export interface AppointmentServiceInterface {
    getAppointment(
        crp: string, 
        date?: string,
        pacientId?: number
    ): Promise<GetAppointmentResDto>;
    postAppointment(crp: string, body: PostAppointmentReqDto): Promise<GetAppointmentResDto>;
    putRDP(crp: string, body: PutAppointmentReqDto): Promise<GetAppointmentResDto>;
    deleteAppointment(crp: string, uuid: string): Promise<DeleteAppointmentResDto>
}
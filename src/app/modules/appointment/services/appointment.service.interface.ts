import { DeleteAppointmentResDto } from '@app/modules/appointment/dtos/responses/delete-appointment-res.dto';
import { GetAppointmentResDto } from '@app/modules/appointment/dtos/responses/get-appointment-res.dto';
import { PostAppointmentReqDto } from '@app/modules/appointment/dtos/requests/post-appointment-req.dto';
import { PutAppointmentReqDto } from '@app/modules/appointment/dtos/requests/put-appointment-req.dto';

export interface AppointmentServiceInterface {
    getAppointment(
        crp: string, 
        date?: string,
        patientId?: string
    ): Promise<GetAppointmentResDto>;
    getMyAppointments(
        patientId: string, 
        date?: string,
    ): Promise<GetAppointmentResDto>;
    postAppointment(crp: string, body: PostAppointmentReqDto): Promise<GetAppointmentResDto>;
    putAppointment(crp: string, body: PutAppointmentReqDto): Promise<GetAppointmentResDto>;
    patchLinkAppointment(patientId: string, uuid: string): Promise<GetAppointmentResDto>;
    patchCancelAppointment(uuid: string, patientId: string): Promise<GetAppointmentResDto>;
    deleteAppointment(crp: string, uuid: string): Promise<DeleteAppointmentResDto>;
}
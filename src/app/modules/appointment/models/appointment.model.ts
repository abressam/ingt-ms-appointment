import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
   @Prop({ index: true })
   uuid: string;   
   
   @Prop()
   crp: string;   
   
   @Prop()
   patientId: string | null;   
   
   @Prop()
   date: string;   
   
   @Prop()
   startTime: string;

   @Prop()
   endTime: string;

   @Prop()
   type: string;

   @Prop()
   location: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
   @Prop({ index: true })
   uuid: string;   
   
   @Prop({ unique: true })
   cpfCnpj: string;   
   
   @Prop()
   name: string;   
   
   @Prop()
   address: string;   
   
   @Prop()
   phone: string;

   @Prop({ unique: true })
   email: string;

   @Prop()
   birthdate: string;

   @Prop()
   crp: string | null;

   @Prop()
   patientId: number | null;

   @Prop()
   responsibleCrp: string | null;

   @Prop()
   password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
import { IsEmail } from 'class-validator';

export class InvitePartnerDto {
  @IsEmail()
  userEmail!: string;
}

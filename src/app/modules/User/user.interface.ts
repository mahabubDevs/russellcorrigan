import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  image?: string[];
  role: UserRole;
  profession:string;
  promoCode:string;
  status: UserStatus;
  isDeleted:boolean;
  createdAt?: Date;
  updatedAt?: Date;
  otp: number;
  otpExpires: Date;
}

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
}
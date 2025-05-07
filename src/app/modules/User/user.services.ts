import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import httpStatus from "http-status";
import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import { string } from "zod";

// Create a new user in the database.
// const createUserIntoDb = async (payload: User ,req:Request) => {
//   console.log("Payload:", payload);
//   console.log("files", req.files);
//   console.log("BODY:", req.body);

//   const existingUser = await prisma.user.findFirst({
//     where: {
//       OR: [{ email: payload.email }],
//     },
//   });

//   if (existingUser) {
//     if (existingUser.email === payload.email) {
//       throw new ApiError(
//         400,
//         `User with this email ${payload.email} already exists`
//       );
//     }
//     // if (existingUser.username === payload.username) {
//     //   throw new ApiError(
//     //     400,
//     //     `User with this username ${payload.username} already exists`
//     //   );
//     // }
//   }
//   const hashedPassword: string = await bcrypt.hash(
//     payload.password,
//     Number(config.bcrypt_salt_rounds)
//   );



//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   console.log("Files:", files);
//   let imageUrls: string[] = [];

//   if (files?.images && files.images.length > 0) {
//     const uploads = await Promise.all(
//       files.images.map(async (file) => {
//         const uploadResult = await fileUploader.uploadToCloudinary(file);
//         return uploadResult.Location;
//       })
//     );
//     imageUrls = uploads;
//   }

//   console.log("Image URLs:", imageUrls);




//   const result = await prisma.user.create({
//     data: { ...payload, password: hashedPassword ,images: imageUrls,},
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       phoneNumber: true,
//       images: true,
//       email: true,
//       role: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });

//   return result;
// };







const createUserIntoDb = async (payload: IUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      role: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const updateUserProfile = async (
  userId: string,
  payload: IUser,
  req: Request
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
  if (!userInfo)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with id: " + userId);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let imageUrls: string[] = [];
  if (files?.images && files.images.length > 0) {
    const uploads = await Promise.all(
      files.images.map(async (file) => {
        const uploaded = await fileUploader.uploadToCloudinary(file);
        return uploaded.Location;
      })
    );
    imageUrls = uploads;
  }
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      ...payload,
      images: imageUrls,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    );
  return result;
};

// const updateProfileImage = async (
//   userId: string,
//   payload: IUser,
//   req: Request
// ) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       id: userId,
//     },
//   });
//   if (!userInfo)
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found with id: " + userId);
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   let imageUrls: string[] = [];
//   if (files?.images && files.images.length > 0) {
//     const uploads = await Promise.all(
//       files.images.map(async (file) => {
//         const uploaded = await fileUploader.uploadToCloudinary(file);
//         return uploaded.Location;
//       })
//     );
//     imageUrls = uploads;
//   }
//   const result = await prisma.user.update({
//     where: {
//       id: userInfo.id,
//     },
//     data: {
//       ...payload,
//       profileImage: imageUrls[0] || null,
//     },
//     select: {
//       id: true,
//       profileImage: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
//   if (!result)
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to update user profile"
//     );
//   return result;
// };




// reterive all users from the database also searcing anf filetering
// const getUsersFromDb = async (
//   params: IUserFilterRequest,
//   options: IPaginationOptions
// ) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, ...filterData } = params;

//   const andCondions: Prisma.UserWhereInput[] = [];

//   if (params.searchTerm) {
//     andCondions.push({
//       OR: userSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: params.searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andCondions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }
//   const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

//   const result = await prisma.user.findMany({
//     where: whereConditons,
//     skip,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: "desc",
//           },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       // username: true,
//       email: true,
//       profileImage: true,
//       role: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
//   const total = await prisma.user.count({
//     where: whereConditons,
//   });

//   if (!result || result.length === 0) {
//     throw new ApiError(404, "No active users found");
//   }
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// update profile by user won profile uisng token or email and id


// update user data into database by id fir admin
// const updateUserIntoDb = async (payload: IUser, id: string) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       id: id,
//     },
//   });
//   if (!userInfo)
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found with id: " + id);

//   const result = await prisma.user.update({
//     where: {
//       id: userInfo.id,
//     },
//     data: payload,
//     select: {
//       id: true,
//       // fullName: true,
//       firstName: true,
//       lastName: true,

//       email: true,
//       profileImage: true,
//       role: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });

//   if (!result)
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to update user profile"
//     );

//   return result;
// };


const updateUserProfileImage = async (userId: string, imageUrl: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      profileImage: imageUrl, // প্রোফাইল ছবির URL আপডেট করা
    },
    select: {
      id: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const updateUserDocument = async (userId: string, imageUrls: string[]) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, "ইউজার খুঁজে পাওয়া যায়নি");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      images: { push: imageUrls }, // নতুন ছবি আগের ছবির সাথে যুক্ত করা
    },
    select: {
      id: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};



const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      profileImage: true,
      role: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};




const deleteFirstMatchFromArray = (arr: string[], valueToRemove: string): string[] => {
  const index = arr.indexOf(valueToRemove);
  if (index === -1) return arr;
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

const deleteUserDocumentImage = async (userId: string, imageUrl: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "ইউজার খুঁজে পাওয়া যায়নি");
  }

  // কেবলমাত্র প্রথম মিলে যাওয়া ছবি মুছে ফেলা
  const updatedImages = deleteFirstMatchFromArray(user.images, imageUrl);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      images: updatedImages,
    },
    select: {
      id: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};



export const userService = {
  createUserIntoDb,
  updateUserProfile,
  updateUserProfileImage,
  updateUserDocument,
  getUserProfile,
  deleteUserDocumentImage
  // getUsersFromDb,
  // updateProfile,
  // updateUserIntoDb,
};

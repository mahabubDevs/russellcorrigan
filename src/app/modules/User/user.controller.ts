  import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.costant";
import { fileUploader } from "../../../helpars/fileUploader";
import ApiError from "../../../errors/ApiErrors";

// const createUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await userService.createUserIntoDb(req.body,req);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User Registered successfully!",
//     data: result,
//   });
// });








// const createUser = catchAsync(async (req: Request, res: Response) => {
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   const body = req.body;

//   let imageUrls: string[] = [];

//   if (files?.images && files.images.length > 0) {
//     const uploads = await Promise.all(
//       files.images.map(async (file) => {
//         // Upload to Cloudinary (or switch to uploadToDigitalOcean if needed)
//         const uploaded = await fileUploader.uploadToCloudinary(file);
//         return uploaded.Location;
//       })
//     );
//     imageUrls = uploads;
//   }

//   // Combine user data with image URLs
//   const userPayload = {
//     ...body,
//     images: imageUrls,
//   };

//   const user = await userService.createUserIntoDb(userPayload);

//   res.status(201).json({
//     success: true,
//     message: "User registered successfully!",
//     data: user,
//   });
// });






const createUser = catchAsync(async (req: Request, res: Response) => {
  const stringData = req.body.data;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!stringData) throw new ApiError(400, "Missing user data in 'data' field");

  const body = JSON.parse(stringData); // Parse the JSON string from "data"
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

  const userPayload = {
    ...body,
    images: imageUrls, // Attach uploaded image URLs
  };

  const user = await userService.createUserIntoDb(userPayload);

  res.status(201).json({
    success: true,
    message: "User registered successfully!",
    data: user,
  });
});



















// get all user form db
const getUsers = catchAsync(async (req: Request, res: Response) => {

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

  const result = await userService.getUsersFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieve successfully!",
    data: result,
  });
});


// get all user form db
const updateProfile = catchAsync(async (req: Request & {user?:any}, res: Response) => {
  const user = req?.user;

  const result = await userService.updateProfile(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});


// *! update user role and account status
const updateUser = catchAsync(async (req: Request, res: Response) => {
const id = req.params.id;
  const result = await userService.updateUserIntoDb( req.body,id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  updateProfile,
  updateUser
};

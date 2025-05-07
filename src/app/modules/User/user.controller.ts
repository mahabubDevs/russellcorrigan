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


const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const body = req.body;
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
  const user = await userService.updateUserProfile(userId, userPayload,req);
  res.status(200).json({
    success: true,
    message: "User profile updated successfully!",
    data: user,
  });
});

// const updateProfileImage = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.params.id;
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   const body = req.body;
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
//   const userPayload = {
//     ...body,
//     images: imageUrls, // Attach uploaded image URLs
//   };
//   const user = await userService.updateProfileImage(userId, userPayload,req);
//   res.status(200).json({
//     success: true,
//     message: "User profile updated successfully!",
//     data: user,
//   });
// });













// get all user form db
// const getUsers = catchAsync(async (req: Request, res: Response) => {

//   const filters = pick(req.query, userFilterableFields);
//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

//   const result = await userService.getUsersFromDb(filters, options);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Users retrieve successfully!",
//     data: result,
//   });
// });


const updateProfileImage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  // ডিবাগিংয়ের জন্য ইউজার আইডি কনসোল লগ করা
// ডিবাগিংয়ের জন্য ইউজার আইডি কনসোল লগ করা
  // ফাইল এক্সট্র্যাক্ট করা
  const file = req.file; // এখানে req.file ব্যবহার করতে হবে, কারণ single image upload

// ডিবাগিংয়ের জন্য ফাইল কনসোল লগ করা
  // ফাইল যদি না থাকে, তাহলে ত্রুটি পাঠান
  // যদি ফাইল না থাকে, তাহলে ত্রুটি পাঠান
  if (!file) {
    throw new ApiError(400, "কোনও ছবি পাওয়া যায়নি"); // এখানে 'No image found' ত্রুটি আসবে
  }

  // Cloudinary তে ছবি আপলোড করা
  const uploaded = await fileUploader.uploadToCloudinary(file);
  const imageUrl = uploaded.Location;

  // সার্ভিসে ব্যবহারকারীর ছবি আপডেট করা
  const user = await userService.updateUserProfileImage(userId, imageUrl);

  // সফলভাবে আপডেট হলে রেসপন্স পাঠানো
  res.status(200).json({
    success: true,
    message: "User profile image updated successfully!",
    data: user,
  });
});


const updateUserDocument = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // যদি কোনো ফাইল না থাকে
  if (!files?.images || files.images.length === 0) {
    throw new ApiError(400, "কোনও ছবি পাওয়া যায়নি");
  }

  // প্রতিটি ছবি Cloudinary-তে আপলোড করা
  const imageUrls = await Promise.all(
    files.images.map(async (file) => {
      const uploaded = await fileUploader.uploadToCloudinary(file);
      return uploaded.Location;
    })
  );

  // সার্ভিসে পাঠানো যাতে user-এর images আপডেট হয়
  const user = await userService.updateUserDocument(userId, imageUrls);

  res.status(200).json({
    success: true,
    message: "ইউজারের ডকুমেন্ট (ছবি) সফলভাবে আপডেট হয়েছে!",
    data: user,
  });
});


const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await userService.getUserProfile(userId);
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully!",
    data: user,
  });
});




const deleteUserDocumentImage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    throw new ApiError(400, "ছবির URL প্রদান করতে হবে");
  }

  const user = await userService.deleteUserDocumentImage(userId, imageUrl);

  res.status(200).json({
    success: true,
    message: "ছবি সফলভাবে ডিলিট হয়েছে!",
    data: user,
  });
});





export const userController = {
  createUser,
  updateProfile,
  updateProfileImage,
  updateUserDocument,
  getUserProfile,
  deleteUserDocumentImage
  // getUsers,
  // updateProfile,
  // updateUser
};

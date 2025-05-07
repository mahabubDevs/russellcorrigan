import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();




router.post(
  "/register",
  fileUploader.uploadMultipleImage, // Multer middleware for handling multiple files
  userController.createUser
);

router.put("/update-profile/:id",auth(), userController.updateProfile);
router.put("/update-profileImage/:id", auth(), fileUploader.uploadSingle, userController.updateProfileImage);


export const userRoutes = router;

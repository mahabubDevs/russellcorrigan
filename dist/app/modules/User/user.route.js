"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
// *!register user
router.post("/register", (0, validateRequest_1.default)(user_validation_1.UserValidation.CreateUserValidationSchema), user_controller_1.userController.createUser);
// *!get all  user
router.get("/", user_controller_1.userController.getUsers);
// *!profile user
router.put("/profile", 
// validateRequest(UserValidation.userUpdateSchema),
(0, auth_1.default)(client_1.UserRole.provider, client_1.UserRole.Customer), fileUploader_1.fileUploader.uploadSingle, user_controller_1.userController.updateProfile);
// *!update  user
router.put("/:id", user_controller_1.userController.updateUser);
exports.userRoutes = router;

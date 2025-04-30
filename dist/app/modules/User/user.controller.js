"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_services_1 = require("./user.services");
const pick_1 = __importDefault(require("../../../shared/pick"));
const user_costant_1 = require("./user.costant");
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_services_1.userService.createUserIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Registered successfully!",
        data: result,
    });
});
// get all user form db
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, user_costant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await user_services_1.userService.getUsersFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users retrieve successfully!",
        data: result,
    });
});
// get all user form db
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const result = await user_services_1.userService.updateProfile(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully!",
        data: result,
    });
});
// *! update user role and account status
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_services_1.userService.updateUserIntoDb(req.body, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User updated successfully!",
        data: result,
    });
});
exports.userController = {
    createUser,
    getUsers,
    updateProfile,
    updateUser
};

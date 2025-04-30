"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const bcrypt = __importStar(require("bcrypt"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const user_costant_1 = require("./user.costant");
const config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpars/fileUploader");
// Create a new user in the database.
const createUserIntoDb = async (payload) => {
    const existingUser = await prisma_1.default.user.findFirst({
        where: {
            OR: [{ email: payload.email }, { username: payload.username }],
        },
    });
    if (existingUser) {
        if (existingUser.email === payload.email) {
            throw new ApiErrors_1.default(400, `User with this email ${payload.email} already exists`);
        }
        // if (existingUser.username === payload.username) {
        //   throw new ApiError(
        //     400,
        //     `User with this username ${payload.username} already exists`
        //   );
        // }
    }
    const hashedPassword = await bcrypt.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const result = await prisma_1.default.user.create({
        data: { ...payload, password: hashedPassword },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};
// reterive all users from the database also searcing anf filetering
const getUsersFromDb = async (params, options) => {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_costant_1.userSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const result = await prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            // username: true,
            email: true,
            profileImage: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = await prisma_1.default.user.count({
        where: whereConditons,
    });
    if (!result || result.length === 0) {
        throw new ApiErrors_1.default(404, "No active users found");
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
// update profile by user won profile uisng token or email and id
const updateProfile = async (req) => {
    console.log(req.file, req.body.data);
    const file = req.file;
    const stringData = req.body.data;
    let image;
    let parseData;
    const existingUser = await prisma_1.default.user.findFirst({
        where: {
            id: req.user.id,
        },
    });
    if (!existingUser) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    if (file) {
        image = (await fileUploader_1.fileUploader.uploadToDigitalOcean(file)).Location;
    }
    if (stringData) {
        parseData = JSON.parse(stringData);
    }
    const result = await prisma_1.default.user.update({
        where: {
            id: existingUser.id, // Ensure `existingUser.id` is valid and exists
        },
        data: {
            // fullName: parseData.fullName || existingUser.fullName,
            // username: parseData.username || existingUser.username,
            firstName: parseData.username || existingUser.firstName,
            lastName: parseData.username || existingUser.lastName,
            dob: parseData.dob || existingUser.dob,
            email: parseData.email || existingUser.email,
            profileImage: image || existingUser.profileImage,
            updatedAt: new Date(), // Assuming your model has an `updatedAt` field
        },
        select: {
            id: true,
            // fullName: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            profileImage: true,
            dob: true,
        },
    });
    return result;
};
// update user data into database by id fir admin
const updateUserIntoDb = async (payload, id) => {
    const userInfo = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    if (!userInfo)
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found with id: " + id);
    const result = await prisma_1.default.user.update({
        where: {
            id: userInfo.id,
        },
        data: payload,
        select: {
            id: true,
            // fullName: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            profileImage: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!result)
        throw new ApiErrors_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update user profile");
    return result;
};
exports.userService = {
    createUserIntoDb,
    getUsersFromDb,
    updateProfile,
    updateUserIntoDb,
};

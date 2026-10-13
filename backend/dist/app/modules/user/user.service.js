"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constant_1 = require("./user.constant");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload.email.trim().toLowerCase();
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "An account with this email already exists.");
    }
    const saltRounds = Number(env_1.envVars.BCRYPT_SALT_ROUND);
    if (!Number.isInteger(saltRounds) || saltRounds < 1) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Password hashing configuration is invalid.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, saltRounds);
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    try {
        const user = yield user_model_1.User.create({
            name: payload.name.trim(),
            email,
            password: hashedPassword,
            phone: payload.phone,
            address: payload.address,
            // Public registration must never choose its own role.
            role: user_interface_1.Role.USER,
            auths: [authProvider],
        });
        // Explicitly return only safe fields.
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            picture: user.picture,
            address: user.address,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    catch (error) {
        // MongoDB duplicate-key error.
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "An account with this email already exists.");
        }
        throw error;
    }
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(401, "You are not authorized");
        }
    }
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        ifUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(401, "You are not authorized");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
// const getMe = async (userId: string) => {
//   const user = await User.findById(userId).select("-password");
//   return {
//     data: user,
//   };
// };
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    return {
        data: user,
    };
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
};

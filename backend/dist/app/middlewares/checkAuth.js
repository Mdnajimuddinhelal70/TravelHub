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
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("../utils/jwt");
const isValidRole = (role) => {
    return Object.values(user_interface_1.Role).some((validRole) => validRole === role);
};
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        const accessToken = authorization === null || authorization === void 0 ? void 0 : authorization.replace(/^Bearer\s+/i, "").trim();
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Access token is required.");
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        }
        catch (_a) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid or expired access token.");
        }
        if (typeof decoded !== "object" ||
            decoded === null ||
            typeof decoded.email !== "string" ||
            !isValidRole(decoded.role)) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid access token payload.");
        }
        const user = yield user_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User does not exist.");
        }
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "This account is deleted.");
        }
        if (user.isActive === user_interface_1.IsActive.BLOCKED ||
            user.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, `User is ${user.isActive}.`);
        }
        // Always authorize using the current database role.
        if (!authRoles.includes(user.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not permitted to access this resource.");
        }
        req.user = Object.assign(Object.assign({}, decoded), { userId: user._id.toString(), email: user.email, role: user.role });
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;

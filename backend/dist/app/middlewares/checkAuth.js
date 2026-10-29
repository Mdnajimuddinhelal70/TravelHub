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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
            ? authHeader.split(" ")[1]
            : null;
        const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || bearerToken;
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "No token provided");
        }
        let verifiedToken;
        try {
            verifiedToken = jsonwebtoken_1.default.verify(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        }
        catch (_b) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid or expired access token");
        }
        const user = yield user_model_1.User.findOne({ email: verifiedToken.email });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        if (user.isActive === user_interface_1.IsActive.BLOCKED ||
            user.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, `User is ${user.isActive}`);
        }
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User is deleted");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not permitted to access this resource");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;

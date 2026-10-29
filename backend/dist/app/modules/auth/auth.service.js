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
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const userTokens_1 = require("../../utils/userTokens");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    }
    catch (_a) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid or expired refresh token");
    }
    const user = yield user_model_1.User.findOne({ email: decoded.email }).select("+refreshToken");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not found");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED ||
        user.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, `User is ${user.isActive}`);
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User is deleted");
    }
    // Refresh token rotation: DB-তে থাকা token-এর সাথে match করতে হবে
    if (user.refreshToken !== refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Refresh token has been revoked or rotated");
    }
    const tokens = (0, userTokens_1.createUserTokens)(user);
    user.refreshToken = tokens.refreshToken;
    yield user.save();
    return tokens;
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (!user.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have not set a password yet. Use set-password instead.");
    }
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old password does not match");
    }
    const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "New password must be different from old password");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // পুরনো session invalidate করো
    user.refreshToken = undefined;
    yield user.save();
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password already set. Use change-password instead.");
    }
    const hasCredentials = user.auths.some((a) => a.provider === "credentials");
    if (hasCredentials) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Credentials already linked to this account");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email,
    };
    user.password = hashedPassword;
    user.auths = [...user.auths, credentialProvider];
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User does not exist");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED ||
        user.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${user.isActive}`);
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_RESET_PASSWORD_SECRET, {
        expiresIn: env_1.envVars.JWT_RESET_PASSWORD_EXPIRES,
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: user.name,
            resetUILink,
        },
    });
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(payload.token, env_1.envVars.JWT_RESET_PASSWORD_SECRET);
    }
    catch (_a) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid or expired reset token");
    }
    if (decoded.userId !== payload.id) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid reset token");
    }
    const user = yield user_model_1.User.findById(decoded.userId).select("+password");
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
    user.password = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // পুরনো session invalidate করো
    user.refreshToken = undefined;
    yield user.save();
});
exports.AuthServices = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};

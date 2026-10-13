"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        enum: ["google", "credentials"],
        required: true,
    },
    providerId: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 100,
    },
    password: {
        type: String,
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    picture: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
        required: true,
    },
    auths: {
        type: [authProviderSchema],
        default: [],
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const divisionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    thumbnail: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);

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
    images: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        trim: true,
    },
    districts: {
        type: [String],
        default: [],
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
divisionSchema.index({ location: "2dsphere" });
divisionSchema.index({ isActive: 1 });
divisionSchema.index({ name: "text", description: "text" });
divisionSchema.index({ isDeleted: 1 });
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);

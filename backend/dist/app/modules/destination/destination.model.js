"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Destination = void 0;
const mongoose_1 = require("mongoose");
const destinationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Division",
        required: true,
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
    location: {
        type: {
            type: String,
            enum: ["Point"],
            // default: "Point",
        },
        coordinates: {
            type: [Number],
            // default: undefined,
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
destinationSchema.index({ location: "2dsphere" });
destinationSchema.index({ division: 1, isActive: 1 });
destinationSchema.index({ name: "text", description: "text" });
exports.Destination = (0, mongoose_1.model)("Destination", destinationSchema);

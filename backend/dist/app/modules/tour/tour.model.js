"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const tourTypeSchema = new mongoose_1.Schema({
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
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const tourSchema = new mongoose_1.Schema({
    title: {
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
    description: {
        type: String,
        trim: true,
    },
    images: {
        type: [String],
        default: [],
    },
    destinations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Destination",
            required: true,
        },
    ],
    tourType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TourType",
        required: true,
    },
    included: {
        type: [String],
        default: [],
    },
    excluded: {
        type: [String],
        default: [],
    },
    amenities: {
        type: [String],
        default: [],
    },
    tourPlan: {
        type: [String],
        default: [],
    },
    maxGuest: {
        type: Number,
        min: 1,
    },
    minAge: {
        type: Number,
        min: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.TourType = (0, mongoose_1.model)("TourType", tourTypeSchema);
exports.Tour = (0, mongoose_1.model)("Tour", tourSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourDeparture = void 0;
const mongoose_1 = require("mongoose");
const tour_departure_interface_1 = require("./tour-departure.interface");
const tourDepartureSchema = new mongoose_1.Schema({
    tour: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
        index: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    pricePerPerson: {
        type: Number,
        required: true,
        min: [0.01, "Price must be greater than zero."],
    },
    totalSeats: {
        type: Number,
        required: true,
        min: [1, "Total seats must be at least 1."],
        validate: {
            validator: Number.isInteger,
            message: "Total seats must be an integer.",
        },
    },
    availableSeats: {
        type: Number,
        required: true,
        min: [0, "Available seats cannot be negative."],
        validate: {
            validator: Number.isInteger,
            message: "Available seats must be an integer.",
        },
    },
    status: {
        type: String,
        enum: Object.values(tour_departure_interface_1.TOUR_DEPARTURE_STATUS),
        default: tour_departure_interface_1.TOUR_DEPARTURE_STATUS.SCHEDULED,
    },
}, {
    timestamps: true,
    versionKey: false,
});
tourDepartureSchema.index({ tour: 1, startDate: 1 });
tourDepartureSchema.pre("validate", function () {
    const departure = this;
    if (departure.availableSeats > departure.totalSeats) {
        departure.invalidate("availableSeats", "Available seats cannot exceed total seats.");
    }
});
exports.TourDeparture = (0, mongoose_1.model)("TourDeparture", tourDepartureSchema);

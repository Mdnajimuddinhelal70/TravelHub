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
        min: 0,
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1,
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0,
    },
    bookedSeats: {
        type: Number,
        default: 0,
        min: 0,
    },
    minGroupSize: {
        type: Number,
        min: 1,
    },
    status: {
        type: String,
        enum: Object.values(tour_departure_interface_1.TOUR_DEPARTURE_STATUS),
        default: tour_departure_interface_1.TOUR_DEPARTURE_STATUS.SCHEDULED,
    },
    guide: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    meetingPoint: {
        type: String,
        trim: true,
    },
    cancellationReason: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
tourDepartureSchema.index({ tour: 1, startDate: 1 }, { unique: true });
tourDepartureSchema.index({ status: 1, startDate: 1 });
tourDepartureSchema.index({ tour: 1, status: 1 });
// endDate > startDate
tourDepartureSchema.pre("validate", function () {
    if (this.startDate && this.endDate && this.endDate <= this.startDate) {
        throw new Error("End date must be after start date");
    }
});
// availableSeats + bookedSeats = totalSeats
tourDepartureSchema.pre("validate", function () {
    if (this.availableSeats + this.bookedSeats !== this.totalSeats) {
        throw new Error("availableSeats + bookedSeats must equal totalSeats");
    }
});
tourDepartureSchema.pre("save", function () {
    if (this.isModified("availableSeats") &&
        this.availableSeats === 0 &&
        this.status === tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN) {
        this.status = tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL;
    }
    if (this.isModified("availableSeats") &&
        this.availableSeats > 0 &&
        this.status === tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL) {
        this.status = tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN;
    }
});
exports.TourDeparture = (0, mongoose_1.model)("TourDeparture", tourDepartureSchema);

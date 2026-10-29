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
exports.TourDepartureService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const booking_model_1 = require("../booking/booking.model");
const tour_model_1 = require("../tour/tour.model");
const tour_departure_interface_1 = require("./tour-departure.interface");
const tour_departure_model_1 = require("./tour-departure.model");
/* ============================================================
 *  CREATE
 * ============================================================ */
const createTourDeparture = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ tour exist করে কি না
    const tour = yield tour_model_1.Tour.findById(payload.tour);
    if (!tour) {
        throw new Error("Tour not found.");
    }
    // ✅ date validation
    if (new Date(payload.endDate) <= new Date(payload.startDate)) {
        throw new Error("End date must be after start date");
    }
    // ✅ একই tour + startDate-এ duplicate check
    const existing = yield tour_departure_model_1.TourDeparture.findOne({
        tour: payload.tour,
        startDate: payload.startDate,
    });
    if (existing) {
        throw new Error("A departure already exists for this tour on this date.");
    }
    // ✅ availableSeats না দিলে totalSeats-ই হবে
    if (payload.availableSeats === undefined) {
        payload.availableSeats = payload.totalSeats;
    }
    if (payload.bookedSeats === undefined) {
        payload.bookedSeats = 0;
    }
    // ✅ seat arithmetic validation
    if (payload.availableSeats + payload.bookedSeats !== payload.totalSeats) {
        throw new Error("availableSeats + bookedSeats must equal totalSeats");
    }
    return yield tour_departure_model_1.TourDeparture.create(payload);
});
const getAllTourDepartures = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_departure_model_1.TourDeparture.find(), query);
    const departures = queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        departures
            .build()
            .populate("tour", "title slug coverImage duration price")
            .populate("guide", "name email"),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getDeparturesByTour = (tourId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findById(tourId);
    if (!tour) {
        throw new Error("Tour not found.");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_departure_model_1.TourDeparture.find({ tour: tourId }), query);
    const departures = queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        departures.build().populate("guide", "name"),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleTourDeparture = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const departure = yield tour_departure_model_1.TourDeparture.findById(id)
        .populate("tour", "title slug coverImage duration price")
        .populate("guide", "name email");
    if (!departure) {
        throw new Error("Tour departure not found.");
    }
    return departure;
});
const updateTourDeparture = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const existing = yield tour_departure_model_1.TourDeparture.findById(id);
    if (!existing) {
        throw new Error("Tour departure not found.");
    }
    // ✅ date validation (একটা বা দুটোই বদলালে)
    const startDate = (_a = payload.startDate) !== null && _a !== void 0 ? _a : existing.startDate;
    const endDate = (_b = payload.endDate) !== null && _b !== void 0 ? _b : existing.endDate;
    if (new Date(endDate) <= new Date(startDate)) {
        throw new Error("End date must be after start date");
    }
    // ✅ totalSeats বদলালে availableSeats recalculate
    if (payload.totalSeats !== undefined) {
        if (payload.totalSeats < existing.bookedSeats) {
            throw new Error(`Cannot reduce total seats below booked seats (${existing.bookedSeats}).`);
        }
        payload.availableSeats = payload.totalSeats - existing.bookedSeats;
    }
    // ✅ tour বা startDate বদলালে duplicate check
    if (payload.tour || payload.startDate) {
        const duplicate = yield tour_departure_model_1.TourDeparture.findOne({
            _id: { $ne: id },
            tour: (_c = payload.tour) !== null && _c !== void 0 ? _c : existing.tour,
            startDate: (_d = payload.startDate) !== null && _d !== void 0 ? _d : existing.startDate,
        });
        if (duplicate) {
            throw new Error("A departure already exists for this tour on this date.");
        }
    }
    if (payload.tour) {
        const tour = yield tour_model_1.Tour.findById(payload.tour);
        if (!tour) {
            throw new Error("Tour not found.");
        }
    }
    const updated = yield tour_departure_model_1.TourDeparture.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updated;
});
/* ============================================================
 *  DELETE
 * ============================================================ */
const deleteTourDeparture = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const departure = yield tour_departure_model_1.TourDeparture.findById(id);
    if (!departure) {
        throw new Error("Tour departure not found.");
    }
    // ✅ booking থাকলে delete আটকান
    const bookingCount = yield booking_model_1.Booking.countDocuments({ tourDeparture: id });
    if (bookingCount > 0) {
        throw new Error(`Cannot delete departure. ${bookingCount} booking(s) exist.`);
    }
    yield tour_departure_model_1.TourDeparture.findByIdAndDelete(id);
    return null;
});
/* ============================================================
 *  HELPER — atomic seat decrement (Booking service-এ ব্যবহার হবে)
 * ============================================================ */
const reserveSeats = (departureId, seatCount) => __awaiter(void 0, void 0, void 0, function* () {
    if (seatCount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Seat count must be positive");
    }
    const departure = yield tour_departure_model_1.TourDeparture.findOneAndUpdate({
        _id: departureId,
        status: {
            $in: [tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN, tour_departure_interface_1.TOUR_DEPARTURE_STATUS.SCHEDULED],
        },
        availableSeats: { $gte: seatCount },
    }, [
        {
            $set: {
                availableSeats: { $subtract: ["$availableSeats", seatCount] },
                bookedSeats: { $add: ["$bookedSeats", seatCount] },
            },
        },
        {
            $set: {
                status: {
                    $cond: [
                        { $eq: ["$availableSeats", 0] },
                        tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL,
                        "$status",
                    ],
                },
            },
        },
    ], { new: true });
    if (!departure) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Not enough seats available.");
    }
    return departure;
});
/* ============================================================
 *  HELPER — seat release (booking cancel/expire হলে)
 * ============================================================ */
const releaseSeats = (departureId, seatCount) => __awaiter(void 0, void 0, void 0, function* () {
    if (seatCount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Seat count must be positive");
    }
    const departure = yield tour_departure_model_1.TourDeparture.findByIdAndUpdate(departureId, [
        {
            $set: {
                availableSeats: { $add: ["$availableSeats", seatCount] },
                bookedSeats: { $subtract: ["$bookedSeats", seatCount] },
            },
        },
        {
            $set: {
                status: {
                    $cond: [
                        {
                            $and: [
                                { $gt: ["$availableSeats", 0] },
                                { $eq: ["$status", tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL] },
                            ],
                        },
                        tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN,
                        "$status",
                    ],
                },
            },
        },
    ], { new: true });
    if (!departure) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour departure not found.");
    }
    return departure;
});
exports.TourDepartureService = {
    createTourDeparture,
    getAllTourDepartures,
    getDeparturesByTour,
    getSingleTourDeparture,
    updateTourDeparture,
    deleteTourDeparture,
    reserveSeats,
    releaseSeats,
};

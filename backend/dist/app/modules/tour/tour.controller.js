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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const tour_service_1 = require("./tour.service");
const createTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const files = (_a = req.files) !== null && _a !== void 0 ? _a : [];
    const parseJSON = (val, fallback) => {
        var _a;
        if (typeof val !== "string")
            return (_a = val) !== null && _a !== void 0 ? _a : fallback;
        try {
            return JSON.parse(val);
        }
        catch (_b) {
            return fallback;
        }
    };
    const body = req.body;
    const payload = {
        title: String((_b = body.title) !== null && _b !== void 0 ? _b : ""),
        description: body.description ? String(body.description) : undefined,
        coverImage: (_c = files[0]) === null || _c === void 0 ? void 0 : _c.path,
        images: files.map((file) => file.path),
        destinations: parseJSON(body.destinations, []),
        primaryDestination: body.primaryDestination
            ? String(body.primaryDestination)
            : undefined,
        tourType: String((_d = body.tourType) !== null && _d !== void 0 ? _d : ""),
        category: body.category
            ? String(body.category)
            : undefined,
        difficulty: body.difficulty
            ? String(body.difficulty)
            : undefined,
        duration: parseJSON(body.duration, { days: 1, nights: 0 }),
        price: parseJSON(body.price, { adult: 0 }),
        included: parseJSON(body.included, []),
        excluded: parseJSON(body.excluded, []),
        amenities: parseJSON(body.amenities, []),
        tourPlan: parseJSON(body.tourPlan, []),
        minGroupSize: body.minGroupSize ? Number(body.minGroupSize) : undefined,
        maxGuest: body.maxGuest ? Number(body.maxGuest) : undefined,
        minAge: body.minAge ? Number(body.minAge) : undefined,
        cancellationPolicy: body.cancellationPolicy
            ? String(body.cancellationPolicy)
            : undefined,
        status: body.status ? String(body.status) : "draft",
        rating: 0,
        totalReviews: 0,
    };
    const result = yield tour_service_1.TourService.createTour(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour created successfully",
        data: result,
    });
}));
const getAllTours = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getAllTours(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tours retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield tour_service_1.TourService.getSingleTour(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour retrieved successfully",
        data: result,
    });
}));
const updateTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = (_a = req.files) !== null && _a !== void 0 ? _a : [];
    const body = req.body;
    const parseJSON = (val, fallback) => {
        var _a;
        if (typeof val !== "string")
            return (_a = val) !== null && _a !== void 0 ? _a : fallback;
        try {
            return JSON.parse(val);
        }
        catch (_b) {
            return fallback;
        }
    };
    const payload = {};
    // Only set fields that exist
    if (body.title !== undefined)
        payload.title = String(body.title);
    if (body.description !== undefined)
        payload.description = String(body.description);
    if (body.category !== undefined)
        payload.category = body.category ? String(body.category) : undefined;
    if (body.difficulty !== undefined)
        payload.difficulty = body.difficulty ? String(body.difficulty) : undefined;
    if (body.status !== undefined)
        payload.status = String(body.status);
    if (body.cancellationPolicy !== undefined)
        payload.cancellationPolicy = String(body.cancellationPolicy);
    if (body.tourType !== undefined)
        payload.tourType = String(body.tourType);
    if (body.destinations !== undefined) {
        payload.destinations = parseJSON(body.destinations, []);
    }
    if (body.primaryDestination !== undefined) {
        payload.primaryDestination = body.primaryDestination
            ? String(body.primaryDestination)
            : null;
    }
    if (body.duration !== undefined) {
        payload.duration = parseJSON(body.duration, { days: 1, nights: 0 });
    }
    if (body.price !== undefined) {
        payload.price = parseJSON(body.price, { adult: 0 });
    }
    if (body.included !== undefined) {
        payload.included = parseJSON(body.included, []);
    }
    if (body.excluded !== undefined) {
        payload.excluded = parseJSON(body.excluded, []);
    }
    if (body.amenities !== undefined) {
        payload.amenities = parseJSON(body.amenities, []);
    }
    if (body.tourPlan !== undefined) {
        payload.tourPlan = parseJSON(body.tourPlan, []);
    }
    if (body.minGroupSize !== undefined)
        payload.minGroupSize = body.minGroupSize
            ? Number(body.minGroupSize)
            : undefined;
    if (body.maxGuest !== undefined)
        payload.maxGuest = body.maxGuest ? Number(body.maxGuest) : undefined;
    if (body.minAge !== undefined)
        payload.minAge = body.minAge ? Number(body.minAge) : undefined;
    // New images
    if (files.length > 0) {
        payload.images = files.map((file) => file.path);
    }
    // deleteImages
    if (body.deleteImages) {
        payload.deleteImages = Array.isArray(body.deleteImages)
            ? body.deleteImages
            : [body.deleteImages];
    }
    const result = yield tour_service_1.TourService.updateTour(req.params.id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour updated successfully",
        data: result,
    });
}));
const deleteTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tour_service_1.TourService.deleteTour(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour deleted successfully",
        data: result,
    });
}));
const createTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield tour_service_1.TourService.createTourType(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour type created successfully",
        data: result,
    });
}));
const getAllTourTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getAllTourTypes(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour types retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tour_service_1.TourService.getSingleTourType(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour type retrieved successfully",
        data: result,
    });
}));
const updateTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body; // ✅ পুরো object
    const result = yield tour_service_1.TourService.updateTourType(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour type updated successfully",
        data: result,
    });
}));
const deleteTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tour_service_1.TourService.deleteTourType(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour type deleted successfully",
        data: result,
    });
}));
exports.TourController = {
    createTour,
    createTourType,
    getAllTourTypes,
    getSingleTourType,
    deleteTourType,
    updateTourType,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
};

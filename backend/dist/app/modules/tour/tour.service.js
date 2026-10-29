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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const destination_model_1 = require("../destination/destination.model");
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\u0980-\u09FF\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // slug auto-generate
    if (!payload.slug) {
        payload.slug = generateSlug(payload.title);
    }
    const existingTour = yield tour_model_1.Tour.findOne({
        $or: [{ title: payload.title }, { slug: payload.slug }],
    });
    if (existingTour) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A tour with this title or slug already exists.");
    }
    if ((_a = payload.destinations) === null || _a === void 0 ? void 0 : _a.length) {
        const foundDestinations = yield destination_model_1.Destination.countDocuments({
            _id: { $in: payload.destinations },
        });
        if (foundDestinations !== payload.destinations.length) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "One or more destinations not found.");
        }
    }
    if (payload.tourType) {
        const foundType = yield tour_model_1.TourType.findById(payload.tourType);
        if (!foundType) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type not found.");
        }
    }
    return yield tour_model_1.Tour.create(payload);
});
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find({ isDeleted: false }), query);
    const tours = queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours
            .build()
            .populate("destinations", "name slug thumbnail")
            .populate("tourType", "name slug icon"),
        queryBuilder.getMeta(),
    ]);
    444;
    return { data, meta };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug, isDeleted: false })
        .populate("destinations", "name slug thumbnail description")
        .populate("tourType", "name slug icon");
    if (!tour) {
        throw new Error("Tour not found.");
    }
    return tour;
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour || existingTour.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour not found.");
    }
    const { deleteImages = [], images: newImages } = payload, updateData = __rest(payload, ["deleteImages", "images"]);
    const finalUpdateData = Object.assign({}, updateData);
    if (updateData.title && updateData.title !== existingTour.title) {
        const newSlug = updateData.slug || generateSlug(updateData.title);
        const duplicate = yield tour_model_1.Tour.findOne({
            _id: { $ne: id },
            $or: [{ title: updateData.title }, { slug: newSlug }],
        });
        if (duplicate) {
            throw new Error("A tour with this title or slug already exists.");
        }
        finalUpdateData.slug = newSlug;
    }
    // ✅ destinations validate
    if ((_a = updateData.destinations) === null || _a === void 0 ? void 0 : _a.length) {
        const found = yield destination_model_1.Destination.countDocuments({
            _id: { $in: updateData.destinations },
        });
        if (found !== updateData.destinations.length) {
            throw new Error("One or more destinations not found.");
        }
    }
    // ✅ tourType validate
    if (updateData.tourType) {
        const foundType = yield tour_model_1.TourType.findById(updateData.tourType);
        if (!foundType) {
            throw new Error("Tour type not found.");
        }
    }
    // ✅ images merge logic
    if (newImages !== undefined || deleteImages.length > 0) {
        const deletedSet = new Set(deleteImages);
        const remaining = ((_b = existingTour.images) !== null && _b !== void 0 ? _b : []).filter((url) => !deletedSet.has(url));
        const uploaded = (newImages !== null && newImages !== void 0 ? newImages : []).filter((url) => !deletedSet.has(url));
        finalUpdateData.images = [...remaining, ...uploaded];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, finalUpdateData, {
        new: true,
        runValidators: true,
    });
    if (deleteImages.length > 0) {
        yield Promise.all(deleteImages.map((url) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tour = yield tour_model_1.Tour.findById(id);
    if (!tour) {
        throw new Error("Tour not found.");
    }
    yield tour_model_1.Tour.findByIdAndDelete(id);
    if ((_a = tour.images) === null || _a === void 0 ? void 0 : _a.length) {
        yield Promise.all(tour.images.map((url) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    return null;
});
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // slug auto-generate
    if (!payload.slug) {
        payload.slug = generateSlug(payload.name);
    }
    const existingTourType = yield tour_model_1.TourType.findOne({
        $or: [{ name: payload.name }, { slug: payload.slug }],
    });
    if (existingTourType) {
        throw new Error("A tour type with this name or slug already exists.");
    }
    return yield tour_model_1.TourType.create(payload);
});
const getAllTourTypes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find({ isDeleted: false }), query);
    const tourTypes = queryBuilder
        .search(tour_constant_1.tourTypeSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tourTypes.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findOne({ _id: id, isDeleted: false });
    if (!tourType) {
        throw new Error("Tour type not found.");
    }
    return tourType;
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({
        _id: id,
        isDeleted: false,
    });
    if (!existingTourType || existingTourType.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type not found.");
    }
    if (Object.keys(payload).length === 0) {
        return existingTourType;
    }
    if (payload.name && payload.name !== existingTourType.name) {
        const duplicate = yield tour_model_1.TourType.findOne({
            _id: { $ne: id },
            name: payload.name,
        });
        if (duplicate) {
            throw new Error("A tour type with this name already exists.");
        }
        if (!payload.slug) {
            payload.slug = generateSlug(payload.name);
        }
    }
    return yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({
        _id: id,
        isDeleted: false,
    });
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type not found.");
    }
    const tourCount = yield tour_model_1.Tour.countDocuments({
        tourType: id,
        isDeleted: false,
    });
    if (tourCount > 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot delete tour type. ${tourCount} tour(s) are using it.`);
    }
    return yield tour_model_1.TourType.findByIdAndUpdate(id, { isDeleted: true, isActive: false }, { new: true });
});
exports.TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getSingleTourType,
    getSingleTour,
    getAllTours,
    updateTour,
    deleteTour,
};

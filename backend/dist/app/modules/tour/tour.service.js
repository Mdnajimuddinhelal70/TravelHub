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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findOne({
        $or: [{ title: payload.title }, { slug: payload.slug }],
    });
    if (existingTour) {
        throw new Error("A tour with this title or slug already exists.");
    }
    return yield tour_model_1.Tour.create(payload);
});
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug });
    return {
        data: tour,
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    const { deleteImages = [], images: newImages } = payload, updateData = __rest(payload, ["deleteImages", "images"]);
    // Use an explicitly typed update object so images can be assigned safely.
    const finalUpdateData = Object.assign({}, updateData);
    if (newImages !== undefined || deleteImages.length > 0) {
        const deletedImages = new Set(deleteImages);
        const remainingImages = ((_a = existingTour.images) !== null && _a !== void 0 ? _a : []).filter((imageUrl) => !deletedImages.has(imageUrl));
        const uploadedImages = (newImages !== null && newImages !== void 0 ? newImages : []).filter((imageUrl) => !deletedImages.has(imageUrl));
        finalUpdateData.images = [...remainingImages, ...uploadedImages];
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
    return yield tour_model_1.Tour.findByIdAndDelete(id);
});
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({
        $or: [{ name: payload.name }, { slug: payload.slug }],
    });
    if (existingTourType) {
        throw new Error("A tour type with this name or slug already exists.");
    }
    return yield tour_model_1.TourType.create(payload);
});
const getAllTourTypes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find(), query);
    const tourTypes = yield queryBuilder
        .search(tour_constant_1.tourTypeSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tourTypes.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findById(id);
    return {
        data: tourType,
    };
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    if (Object.keys(payload).length === 0) {
        return existingTourType;
    }
    return yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    return yield tour_model_1.TourType.findByIdAndDelete(id);
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

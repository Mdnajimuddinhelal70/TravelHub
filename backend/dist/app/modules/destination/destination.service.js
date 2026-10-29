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
exports.DestinationService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_model_1 = require("../division/division.model");
const tour_model_1 = require("../tour/tour.model");
const destination_constant_1 = require("./destination.constant");
const destination_model_1 = require("./destination.model");
/* ============================================================
 *  HELPER — slug generator
 * ============================================================ */
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\u0980-\u09FF\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
/* ============================================================
 *  HELPER — division validate
 * ============================================================ */
const ensureDivisionExists = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({
        _id: divisionId,
        isDeleted: false,
    });
    if (!division) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division not found.");
    }
});
/* ============================================================
 *  CREATE
 * ============================================================ */
const createDestination = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // name duplicate
    const existingDestination = yield destination_model_1.Destination.findOne({
        name: payload.name,
        isDeleted: false,
    });
    if (existingDestination) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A destination with this name already exists.");
    }
    // division exist করে?
    yield ensureDivisionExists(payload.division.toString());
    // slug auto-generate
    if (!payload.slug) {
        payload.slug = generateSlug(payload.name);
    }
    // slug duplicate
    const existingSlug = yield destination_model_1.Destination.findOne({ slug: payload.slug });
    if (existingSlug) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A destination with this slug already exists.");
    }
    return yield destination_model_1.Destination.create(payload);
});
/* ============================================================
 *  GET ALL (paginated)
 * ============================================================ */
const getAllDestinations = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(destination_model_1.Destination.find({ isDeleted: false }), query);
    const destinationsData = queryBuilder
        .search(destination_constant_1.destinationSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        destinationsData.build().populate("division", "name slug thumbnail"),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
/* ============================================================
 *  GET BY DIVISION
 * ============================================================ */
const getDestinationsByDivision = (divisionId, query) => __awaiter(void 0, void 0, void 0, function* () {
    yield ensureDivisionExists(divisionId);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(destination_model_1.Destination.find({ division: divisionId, isDeleted: false }), query);
    const destinationsData = queryBuilder
        .search(destination_constant_1.destinationSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        destinationsData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleDestination = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const destination = yield destination_model_1.Destination.findOne({
        slug,
        isDeleted: false,
    }).populate("division", "name slug thumbnail");
    if (!destination) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Destination not found.");
    }
    return { data: destination };
});
/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDestination = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDestination = yield destination_model_1.Destination.findById(id);
    if (!existingDestination || existingDestination.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Destination not found.");
    }
    if (payload.name && payload.name !== existingDestination.name) {
        const duplicateName = yield destination_model_1.Destination.findOne({
            name: payload.name,
            _id: { $ne: id },
            isDeleted: false,
        });
        if (duplicateName) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A destination with this name already exists.");
        }
        if (!payload.slug) {
            payload.slug = generateSlug(payload.name);
        }
    }
    if (payload.slug && payload.slug !== existingDestination.slug) {
        const duplicateSlug = yield destination_model_1.Destination.findOne({
            slug: payload.slug,
            _id: { $ne: id },
        });
        if (duplicateSlug) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A destination with this slug already exists.");
        }
    }
    if (payload.division) {
        yield ensureDivisionExists(payload.division.toString());
    }
    const updatedDestination = yield destination_model_1.Destination.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.thumbnail && existingDestination.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingDestination.thumbnail);
    }
    return updatedDestination;
});
/* ============================================================
 *  DELETE (soft + referential check)
 * ============================================================ */
const deleteDestination = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const destination = yield destination_model_1.Destination.findById(id);
    if (!destination || destination.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Destination not found.");
    }
    const tourCount = yield tour_model_1.Tour.countDocuments({
        destinations: id,
        isDeleted: false,
    });
    if (tourCount > 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot delete destination. ${tourCount} tour(s) are using it.`);
    }
    yield destination_model_1.Destination.findByIdAndUpdate(id, { isDeleted: true, isActive: false }, { new: true });
    if (destination.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(destination.thumbnail);
    }
    return null;
});
exports.DestinationService = {
    createDestination,
    getAllDestinations,
    getDestinationsByDivision,
    getSingleDestination,
    updateDestination,
    deleteDestination,
};

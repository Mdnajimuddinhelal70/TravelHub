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
exports.DivisionService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const destination_model_1 = require("../destination/destination.model");
const tour_model_1 = require("../tour/tour.model");
const division_constant_1 = require("./division.constant");
const division_model_1 = require("./division.model");
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
 *  CREATE
 * ============================================================ */
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A division with this name already exists.");
    }
    if (!payload.slug) {
        payload.slug = generateSlug(payload.name);
    }
    const existingSlug = yield division_model_1.Division.findOne({ slug: payload.slug });
    if (existingSlug) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A division with this slug already exists.");
    }
    return yield division_model_1.Division.create(payload);
});
/* ============================================================
 *  GET ALL (paginated)
 * ============================================================ */
const getAllDivisions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find({ isDeleted: false }), query);
    const divisionsData = queryBuilder
        .search(division_constant_1.divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        divisionsData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug, isDeleted: false });
    if (!division) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division not found.");
    }
    return { data: division };
});
/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findById(id);
    if (!existingDivision || existingDivision.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division not found.");
    }
    // name বদলালে duplicate check + slug regenerate
    if (payload.name && payload.name !== existingDivision.name) {
        const duplicateDivision = yield division_model_1.Division.findOne({
            name: payload.name,
            _id: { $ne: id },
        });
        if (duplicateDivision) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A division with this name already exists.");
        }
        if (!payload.slug) {
            payload.slug = generateSlug(payload.name);
        }
    }
    // slug explicitly দিলে uniqueness check
    if (payload.slug && payload.slug !== existingDivision.slug) {
        const duplicateSlug = yield division_model_1.Division.findOne({
            slug: payload.slug,
            _id: { $ne: id },
        });
        if (duplicateSlug) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A division with this slug already exists.");
        }
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    // নতুন thumbnail এলে পুরনোটা Cloudinary থেকে মুছুন
    if (payload.thumbnail && existingDivision.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingDivision.thumbnail);
    }
    return updatedDivision;
});
/* ============================================================
 *  DELETE (soft + referential check)
 * ============================================================ */
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findById(id);
    if (!division || division.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division not found.");
    }
    // ✅ referential integrity
    const [destinationCount, tourCount] = yield Promise.all([
        destination_model_1.Destination.countDocuments({ division: id, isDeleted: false }),
        tour_model_1.Tour.countDocuments({ destinations: id, isDeleted: false }),
    ]);
    if (destinationCount > 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot delete division. ${destinationCount} destination(s) are using it.`);
    }
    if (tourCount > 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot delete division. ${tourCount} tour(s) are using it.`);
    }
    yield division_model_1.Division.findByIdAndUpdate(id, { isDeleted: true, isActive: false }, { new: true });
    if (division.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(division.thumbnail);
    }
    return null;
});
exports.DivisionService = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};

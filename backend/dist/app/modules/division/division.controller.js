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
exports.DivisionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const division_service_1 = require("./division.service");
/* ============================================================
 *  CREATE
 * ============================================================ */
const createDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    let districts;
    if (body.districts) {
        try {
            districts = JSON.parse(body.districts);
        }
        catch (_b) {
            districts = body.districts.split(",").map((s) => s.trim());
        }
    }
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path, districts });
    const result = yield division_service_1.DivisionService.createDivision(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Division created successfully",
        data: result,
    });
}));
/* ============================================================
 *  GET ALL
 * ============================================================ */
const getAllDivisions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionService.getAllDivisions(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield division_service_1.DivisionService.getSingleDivision(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division retrieved successfully",
        data: result.data,
    });
}));
/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const payload = Object.assign({}, req.body);
    // ✅ file না থাকলে thumbnail field-এ হাত দেবেন না
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
        payload.thumbnail = req.file.path;
    }
    const result = yield division_service_1.DivisionService.updateDivision(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division updated successfully",
        data: result,
    });
}));
/* ============================================================
 *  DELETE
 * ============================================================ */
const deleteDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield division_service_1.DivisionService.deleteDivision(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted successfully",
        data: result,
    });
}));
exports.DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};

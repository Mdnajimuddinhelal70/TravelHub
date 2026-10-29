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
exports.DestinationController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const destination_service_1 = require("./destination.service");
const createDestination = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const files = (_a = req.files) !== null && _a !== void 0 ? _a : [];
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_c = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path) !== null && _c !== void 0 ? _c : req.body.thumbnail, images: files.length > 0 ? files.map((f) => f.path) : req.body.images });
    const result = yield destination_service_1.DestinationService.createDestination(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Destination created successfully",
        data: result,
    });
}));
const getAllDestinations = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield destination_service_1.DestinationService.getAllDestinations(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Destinations retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getDestinationsByDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const divisionId = req.params.divisionId;
    const result = yield destination_service_1.DestinationService.getDestinationsByDivision(divisionId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Destinations retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleDestination = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield destination_service_1.DestinationService.getSingleDestination(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Destination retrieved successfully",
        data: result.data,
    });
}));
const updateDestination = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = req.params.id;
    const files = (_a = req.files) !== null && _a !== void 0 ? _a : [];
    const payload = Object.assign({}, req.body);
    if ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) {
        payload.thumbnail = req.file.path;
    }
    if (files.length > 0) {
        payload.images = files.map((f) => f.path);
    }
    const result = yield destination_service_1.DestinationService.updateDestination(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Destination updated successfully",
        data: result,
    });
}));
const deleteDestination = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield destination_service_1.DestinationService.deleteDestination(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Destination deleted successfully",
        data: result,
    });
}));
exports.DestinationController = {
    createDestination,
    getAllDestinations,
    getDestinationsByDivision,
    getSingleDestination,
    updateDestination,
    deleteDestination,
};

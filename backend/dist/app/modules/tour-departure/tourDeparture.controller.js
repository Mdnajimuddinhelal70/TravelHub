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
exports.TourDepartureController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const tourDeparture_service_1 = require("./tourDeparture.service");
/* ============================================================
 *  CREATE
 * ============================================================ */
const createTourDeparture = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield tourDeparture_service_1.TourDepartureService.createTourDeparture(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour departure created successfully",
        data: result,
    });
}));
/* ============================================================
 *  GET ALL
 * ============================================================ */
const getAllTourDepartures = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tourDeparture_service_1.TourDepartureService.getAllTourDepartures(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour departures retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/* ============================================================
 *  GET BY TOUR
 * ============================================================ */
const getDeparturesByTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.tourId;
    const result = yield tourDeparture_service_1.TourDepartureService.getDeparturesByTour(tourId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour departures retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleTourDeparture = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tourDeparture_service_1.TourDepartureService.getSingleTourDeparture(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour departure retrieved successfully",
        data: result,
    });
}));
/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateTourDeparture = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const result = yield tourDeparture_service_1.TourDepartureService.updateTourDeparture(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour departure updated successfully",
        data: result,
    });
}));
/* ============================================================
 *  DELETE
 * ============================================================ */
const deleteTourDeparture = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tourDeparture_service_1.TourDepartureService.deleteTourDeparture(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour departure deleted successfully",
        data: result,
    });
}));
exports.TourDepartureController = {
    createTourDeparture,
    getAllTourDepartures,
    getDeparturesByTour,
    getSingleTourDeparture,
    updateTourDeparture,
    deleteTourDeparture,
};

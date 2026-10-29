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
exports.PaymentController = void 0;
const env_1 = require("../../config/env");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield payment_service_1.PaymentService.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = req.query;
        const result = yield payment_service_1.PaymentService.successPayment(query);
        if (result.success) {
            res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
        }
        else {
            res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
        }
    }
    catch (error) {
        // ✅ Payment না পেলে fail page-এ redirect
        const query = req.query;
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${(_a = query.transactionId) !== null && _a !== void 0 ? _a : ""}&status=fail&message=Payment+could+not+be+verified`);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const query = req.query;
    const result = yield payment_service_1.PaymentService.failPayment(query);
    const params = new URLSearchParams({
        transactionId: String((_a = query.transactionId) !== null && _a !== void 0 ? _a : ""),
        message: result.message,
        amount: String((_b = query.amount) !== null && _b !== void 0 ? _b : ""),
        status: String((_c = query.status) !== null && _c !== void 0 ? _c : ""),
    });
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?${params}`);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const query = req.query;
    const result = yield payment_service_1.PaymentService.cancelPayment(query);
    const params = new URLSearchParams({
        transactionId: String((_a = query.transactionId) !== null && _a !== void 0 ? _a : ""),
        message: result.message,
        amount: String((_b = query.amount) !== null && _b !== void 0 ? _b : ""),
        status: String((_c = query.status) !== null && _c !== void 0 ? _c : ""),
    });
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?${params}`);
    }
}));
const getInvoiceDownloadUrl = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    const result = yield payment_service_1.PaymentService.getInvoiceDownloadUrl(paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Invoice download URL retrieved successfully",
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sslcommerz ipn url body", req.body);
    yield sslCommerz_service_1.SSLService.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment Validated Successfully",
        data: null,
    });
}));
const getPaymentByTransactionId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    const result = yield payment_service_1.PaymentService.getPaymentByTransactionId(transactionId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
}));
exports.PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl,
    validatePayment,
    getPaymentByTransactionId,
};

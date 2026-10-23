"use strict";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Types } from "mongoose";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = void 0;
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["PENDING"] = "PENDING";
    PAYMENT_STATUS["PROCESSING"] = "PROCESSING";
    PAYMENT_STATUS["PAID"] = "PAID";
    PAYMENT_STATUS["FAILED"] = "FAILED";
    PAYMENT_STATUS["CANCELLED"] = "CANCELLED";
    PAYMENT_STATUS["REFUNDED"] = "REFUNDED";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));

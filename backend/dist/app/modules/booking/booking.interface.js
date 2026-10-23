"use strict";
// // User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKING_STATUS = void 0;
var BOOKING_STATUS;
(function (BOOKING_STATUS) {
    BOOKING_STATUS["PENDING"] = "PENDING";
    BOOKING_STATUS["CONFIRMED"] = "CONFIRMED";
    BOOKING_STATUS["CANCELLED"] = "CANCELLED";
    BOOKING_STATUS["COMPLETED"] = "COMPLETED";
    BOOKING_STATUS["FAILED"] = "FAILED";
    BOOKING_STATUS["EXPIRED"] = "EXPIRED";
})(BOOKING_STATUS || (exports.BOOKING_STATUS = BOOKING_STATUS = {}));

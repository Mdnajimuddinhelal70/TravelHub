"use strict";
// import { Request, Response } from "express";
// import httpStatus from "http-status-codes";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const notFound = (req, res) => {
    console.log("=== 404 NOT FOUND ===");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Path:", req.path);
    console.log("Query:", req.query);
    console.log("=====================");
    res.status(http_status_codes_1.default.NOT_FOUND).json({
        success: false,
        message: "Route Not Found",
    });
};
exports.default = notFound;

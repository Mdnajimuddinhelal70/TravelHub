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
exports.sendEmail = void 0;
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.envVars.EMAIL_HOST,
    port: Number(env_1.envVars.EMAIL_PORT),
    // port 465 → secure: true, port 587/2525 → secure: false
    secure: Number(env_1.envVars.EMAIL_PORT) === 465,
    auth: {
        user: env_1.envVars.EMAIL_USER,
        pass: env_1.envVars.EMAIL_PASS,
    },
});
// Startup-এ connection verify করো
transporter.verify((error) => {
    if (error) {
        console.error("❌ Email transporter verification failed:", error.message);
    }
    else {
        console.log("✅ Email transporter is ready");
    }
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateData, attachments, }) {
    try {
        const templatePath = path_1.default.join(__dirname, "..", "templates", `${templateName}.ejs`);
        if (!fs_1.default.existsSync(templatePath)) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, `Email template not found: ${templateName}.ejs`);
        }
        const html = yield ejs_1.default.renderFile(templatePath, templateData !== null && templateData !== void 0 ? templateData : {});
        const info = yield transporter.sendMail({
            from: `"Travel Hub" <${env_1.envVars.EMAIL_SENDER}>`,
            to,
            subject,
            html,
            attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
        return info;
    }
    catch (error) {
        if (error instanceof AppError_1.default) {
            throw error;
        }
        const message = error instanceof Error ? error.message : "Unknown email error";
        console.error("❌ sendEmail failed:", message);
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, `Email error: ${message}`);
    }
});
exports.sendEmail = sendEmail;

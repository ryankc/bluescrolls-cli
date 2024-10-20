"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postData = exports.axiosInstance = void 0;
const axios_1 = __importDefault(require("axios"));
const https = __importStar(require("https"));
const keepAliveAgent = new https.Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    rejectUnauthorized: false
});
const backendUrl = `https://localhost:8000`;
exports.axiosInstance = axios_1.default.create({
    //60 sec timeout
    timeout: 60000,
    maxRedirects: 10,
    maxContentLength: 50 * 1000 * 1000,
    baseURL: backendUrl,
    headers: {
        "Content-Type": "application/json"
    },
    httpAgent: keepAliveAgent,
    httpsAgent: keepAliveAgent,
    withCredentials: true
});
const postData = async (apiToken, workspaceId) => {
    try {
        const response = await exports.axiosInstance.post('/api/upload-to-workspace', {
            workspace: workspaceId,
            apiToken: apiToken,
            // data:
        });
        console.log(response.data); // The API response data
    }
    catch (error) {
        console.error('Error posting data:', error);
    }
};
exports.postData = postData;

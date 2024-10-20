import axios from 'axios';
import * as https from "https";
import {LocalFile} from "./bluescrolls";

const keepAliveAgent = new https.Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000, // active socket keepalive for 60 seconds
    rejectUnauthorized: false
})

const backendUrl = `https://server.bluescrolls.com`
export const axiosInstance = axios.create({
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
})


export const postData = async (apiToken: string, workspaceId: string, files: LocalFile[]) => {
    try {
        const response = await axiosInstance.post('/api/upload-to-workspace', {
            workspace: workspaceId,
            apiToken: apiToken,
            data: files
        });
        console.log(response.data); // The API response data
    } catch (error) {
        console.error('Error posting data:', error);
    }
};
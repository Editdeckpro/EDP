/**
 * HTTP/HTTPS agents for server-side requests from Next.js to the backend.
 * keepAlive: false so we don't reuse connections that the backend may have
 * closed (e.g. after keepAliveTimeout ~65s). Reusing a dead connection causes
 * requests to hang for minutes after idle (e.g. 30 min), making login/session
 * and generation appear "stuck".
 */
import http from "http";
import https from "https";

export const backendHttpAgent = new http.Agent({ keepAlive: false });
export const backendHttpsAgent = new https.Agent({ keepAlive: false });

import * as http from 'http';

import { Endpoint } from '../../shared/api';

import { getConfig, ServerConfig } from '../config';

const config: ServerConfig = getConfig().server;
const API_BASE = '/api';

function addParamsToPath<P>(path: string, params: P) {
  let updatedPath = path;
  if (params) {
    for (const key of Object.keys(params)) {
      if (updatedPath.indexOf(':' + key) === -1) {
        throw new Error(`Unexpected parameter '${ key }' while applying parameters to '${ path}'`);
      }
      const value: string = params[key as keyof P] as unknown as string;
      updatedPath = updatedPath.replace(':' + key, value);
    }
  }
  if (updatedPath.indexOf(':') !== -1) {
    throw new Error(`Could not resolve all parameters: ${updatedPath}`);
  }
  return updatedPath;
}

// The types E(P|REQ|RES) stands for "extended params|request|response". They are needed to ensure
// covariance/contravariance.
export function call<P, REQ, RES, EP extends P, EREQ extends REQ>(
  endpoint: Endpoint<P, REQ, RES>,
  params: EP,
  request: EREQ,
): Promise<RES> {
  const path = API_BASE + addParamsToPath(endpoint.path, params);
  const promise: Promise<RES> = new Promise((resolve, reject) => {
    const httpRequest: http.ClientRequest = http.request({
      hostname: config.hostname,
      port: config.port,
      path: path,
      method: endpoint.verb.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let response: string = '';
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          if (response.length > 0) {
            resolve(endpoint.sanitizeResponse(JSON.parse(response)));
          } else {
            resolve(endpoint.sanitizeResponse({}));
          }
        } else {
          reject(new Error(res.statusCode + ': ' + response));
        }
      });
    });
    if (request) {
      httpRequest.write(JSON.stringify(endpoint.sanitizeRequest(request)));
    }
    httpRequest.on('error', (error) => {
      reject(error);
    });
    httpRequest.end();
  });
  return promise;
}

export function simpleCall<RES>(endpoint: Endpoint<undefined, undefined, RES>): Promise<RES> {
  return call(endpoint, undefined, undefined);
}

export function callWithParams<RES, P, EP extends P>(
  endpoint: Endpoint<P, undefined, RES>,
  params: EP,
): Promise<RES> {
  return call(endpoint, params, undefined);
}

export function callWithRequest<RES, REQ, EREQ extends REQ>(
  endpoint: Endpoint<undefined, REQ, RES>,
  request: EREQ,
): Promise<RES> {
  return call(endpoint, undefined, request);
}

import { Sanitizer, arraySanitizer, identity } from '../util';

/**
 * HTTP verbs used between the the back and front end.
 */
export enum Verb {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

/**
 * Bundle of information that describes the expected types for interactions between the back and
 * front end at the endpoint specified by the `path` and `verb`. The generics help catch error at
 * compile time. Sanitizers help catch errors at run time. Runtime errors can still happen even with
 * the compile time checks since the front and back ends might not be at the same verison. Runtime
 * errors can also happen if tools are used (like postman or browser developer tool) to interact
 * with either ends.
 *
 * P is the expected type for the request parameters - undefined if no parameters are expected
 * REQ is the expected type for the request body - undefined if no body is expected
 * RES is the expected type for the response body - undefined if no body is expected
 *
 * Each end point should also have an associated comment on the expected behaviour of the RPC and
 * should mention any potential reasons the RPC could fail (other than 400 for not conforming to
 * the enpoint specifications or 500 for unexpected server error).
 */
export interface Endpoint<P, REQ, RES> {
  path: string,
  verb: Verb,
  sanitizeRequest: Sanitizer<REQ>,
  sanitizeResponse: Sanitizer<RES>,
}

// Used to specify an endpoint with no parameters, request, nor response.
// Mostly used by unusable paths (i.e. 405 status).
export function simpleEndpoint(path: string, verb: Verb): Endpoint<any, any, any> {
  return {
    path: path,
    verb: verb,
    sanitizeRequest: identity,
    sanitizeResponse: identity,
  };
}

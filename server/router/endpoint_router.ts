import Router from '@koa/router';

import { Endpoint, Verb } from '../../shared/endpoints/endpoints';

export interface Result<T> {
  status: number,
  response?: T,
  errorMessage?: string,
}

export const NO_CONTENT: Result<any> = { status: 204 }
export const NOT_FOUND: Result<any> = { status: 404 }
export const METHOD_NOT_ALLOWED: Result<any> = { status: 405}
export const NOT_IMPLEMENTED: Result<any> = { status: 501 }

/**
 * Utility extension that adds the ability to add a route using an Endpoint object.
 */
export class EndpointRouter extends Router {
  // Store
  private endpointsAdded: Map<Verb, string[]> = new Map([
    [Verb.GET, []], [Verb.POST, []], [Verb.PUT, []], [Verb.DELETE, []],
  ]);

  // The types E(P|REQ|RES) stand for "extended params|request|response". They are needed to ensure
  // covariance/contravariance.
  public addEndpoint<P, REQ, RES, EP extends P, EREQ extends REQ, ERES extends RES>(
    endpoint: Endpoint<EP, EREQ, RES>,
    getResult: (params: P, request: REQ) => Promise<Result<ERES>>
  ): void {
    const path = endpoint.path;
    const verb = endpoint.verb;

    // Make sure the endpoint doesn't conflict with an already added one.
    if (this.endpointsAdded.get(verb)!.includes(path)) {
      throw new Error(`Trying to add multiple endpoints at path '${path}' for verb '${verb}'`);
    }
    this.endpointsAdded.get(verb)!.push(path);

    this[endpoint.verb](endpoint.path, async (ctx, next) => {
      let sanitizedRequest: EREQ;
      try {
        sanitizedRequest = endpoint.sanitizeRequest(ctx.request.body, 'request');
      } catch(e) {
        ctx.throw(400, 'Bad request: ' + e.message);
        return;
      }
      const result = await getResult(ctx.params, sanitizedRequest);
      if (result.status >= 200 && result.status < 300) {
        ctx.response.status = result.status;
        if (result.response) {
          // Response object should be of the correct type, but it might have additional properties
          // that should not be included in the repsonse. Sanitizing the response will guarantee
          // that only the desired propeties are transmitted.
          try {
            ctx.response.body = endpoint.sanitizeResponse(result.response, 'response');
          } catch (e) {
            console.log('Error encountered while trying to send response:');
            console.log(result.response);
            throw e;
          }
        }
      } else {
        if (result.errorMessage) {
          ctx.throw(result.status, result.errorMessage);
        } else {
          ctx.throw(result.status);
        }
      }
    });
  }
}

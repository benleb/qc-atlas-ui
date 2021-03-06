/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { EntityModelPatternRelationTypeDto } from '../models/entity-model-pattern-relation-type-dto';
import { Link } from '../models/link';
import { PageMetadata } from '../models/page-metadata';
import { PatternRelationTypeDto } from '../models/pattern-relation-type-dto';

@Injectable({
  providedIn: 'root',
})
export class PatternRelationTypeService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getPatternRelationTypes
   */
  static readonly GetPatternRelationTypesPath = '/v1/pattern-relation-types';

  /**
   * Retrieve all pattern relation types.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPatternRelationTypes()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPatternRelationTypes$Response(params?: {
    /**
     * Filter criteria for this query
     */
    search?: string;

    /**
     * Zero-based page index (0..N)
     */
    page?: number;

    /**
     * The size of the page to be returned
     */
    size?: number;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;
  }): Observable<
    StrictHttpResponse<{
      _embedded?: {
        patternRelationTypes?: Array<EntityModelPatternRelationTypeDto>;
      };
      page?: PageMetadata;
    }>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      PatternRelationTypeService.GetPatternRelationTypesPath,
      'get'
    );
    if (params) {
      rb.query('search', params.search, {});
      rb.query('page', params.page, {});
      rb.query('size', params.size, {});
      rb.query('sort', params.sort, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<{
            _embedded?: {
              patternRelationTypes?: Array<EntityModelPatternRelationTypeDto>;
            };
            page?: PageMetadata;
          }>;
        })
      );
  }

  /**
   * Retrieve all pattern relation types.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPatternRelationTypes$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPatternRelationTypes(params?: {
    /**
     * Filter criteria for this query
     */
    search?: string;

    /**
     * Zero-based page index (0..N)
     */
    page?: number;

    /**
     * The size of the page to be returned
     */
    size?: number;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;
  }): Observable<{
    _embedded?: {
      patternRelationTypes?: Array<EntityModelPatternRelationTypeDto>;
    };
    page?: PageMetadata;
  }> {
    return this.getPatternRelationTypes$Response(params).pipe(
      map(
        (
          r: StrictHttpResponse<{
            _embedded?: {
              patternRelationTypes?: Array<EntityModelPatternRelationTypeDto>;
            };
            page?: PageMetadata;
          }>
        ) =>
          r.body as {
            _embedded?: {
              patternRelationTypes?: Array<EntityModelPatternRelationTypeDto>;
            };
            page?: PageMetadata;
          }
      )
    );
  }

  /**
   * Path part for operation createPatternRelationType
   */
  static readonly CreatePatternRelationTypePath = '/v1/pattern-relation-types';

  /**
   * Define the basic properties of an pattern relation type.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createPatternRelationType()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createPatternRelationType$Response(params: {
    body: PatternRelationTypeDto;
  }): Observable<
    StrictHttpResponse<{ id: string; name: string; _links?: Array<Link> }>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      PatternRelationTypeService.CreatePatternRelationTypePath,
      'post'
    );
    if (params) {
      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<{
            id: string;
            name: string;
            _links?: Array<Link>;
          }>;
        })
      );
  }

  /**
   * Define the basic properties of an pattern relation type.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createPatternRelationType$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createPatternRelationType(params: {
    body: PatternRelationTypeDto;
  }): Observable<{ id: string; name: string; _links?: Array<Link> }> {
    return this.createPatternRelationType$Response(params).pipe(
      map(
        (
          r: StrictHttpResponse<{
            id: string;
            name: string;
            _links?: Array<Link>;
          }>
        ) => r.body as { id: string; name: string; _links?: Array<Link> }
      )
    );
  }

  /**
   * Path part for operation getPatternRelationType
   */
  static readonly GetPatternRelationTypePath =
    '/v1/pattern-relation-types/{patternRelationTypeId}';

  /**
   * Retrieve a specific pattern relation type and its basic properties.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPatternRelationType()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPatternRelationType$Response(params: {
    patternRelationTypeId: string;
  }): Observable<
    StrictHttpResponse<{ id: string; name: string; _links?: Array<Link> }>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      PatternRelationTypeService.GetPatternRelationTypePath,
      'get'
    );
    if (params) {
      rb.path('patternRelationTypeId', params.patternRelationTypeId, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<{
            id: string;
            name: string;
            _links?: Array<Link>;
          }>;
        })
      );
  }

  /**
   * Retrieve a specific pattern relation type and its basic properties.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPatternRelationType$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPatternRelationType(params: {
    patternRelationTypeId: string;
  }): Observable<{ id: string; name: string; _links?: Array<Link> }> {
    return this.getPatternRelationType$Response(params).pipe(
      map(
        (
          r: StrictHttpResponse<{
            id: string;
            name: string;
            _links?: Array<Link>;
          }>
        ) => r.body as { id: string; name: string; _links?: Array<Link> }
      )
    );
  }

  /**
   * Path part for operation updatePatternRelationType
   */
  static readonly UpdatePatternRelationTypePath =
    '/v1/pattern-relation-types/{patternRelationTypeId}';

  /**
   * Update the basic properties of an pattern relation type (e.g. name).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updatePatternRelationType()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updatePatternRelationType$Response(params: {
    patternRelationTypeId: string;
    body: PatternRelationTypeDto;
  }): Observable<
    StrictHttpResponse<{ id: string; name: string; _links?: Array<Link> }>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      PatternRelationTypeService.UpdatePatternRelationTypePath,
      'put'
    );
    if (params) {
      rb.path('patternRelationTypeId', params.patternRelationTypeId, {});

      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<{
            id: string;
            name: string;
            _links?: Array<Link>;
          }>;
        })
      );
  }

  /**
   * Update the basic properties of an pattern relation type (e.g. name).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updatePatternRelationType$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updatePatternRelationType(params: {
    patternRelationTypeId: string;
    body: PatternRelationTypeDto;
  }): Observable<{ id: string; name: string; _links?: Array<Link> }> {
    return this.updatePatternRelationType$Response(params).pipe(
      map(
        (
          r: StrictHttpResponse<{
            id: string;
            name: string;
            _links?: Array<Link>;
          }>
        ) => r.body as { id: string; name: string; _links?: Array<Link> }
      )
    );
  }

  /**
   * Path part for operation deletePatternRelationType
   */
  static readonly DeletePatternRelationTypePath =
    '/v1/pattern-relation-types/{patternRelationTypeId}';

  /**
   * Delete an pattern relation type.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deletePatternRelationType()` instead.
   *
   * This method doesn't expect any request body.
   */
  deletePatternRelationType$Response(params: {
    patternRelationTypeId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      PatternRelationTypeService.DeletePatternRelationTypePath,
      'delete'
    );
    if (params) {
      rb.path('patternRelationTypeId', params.patternRelationTypeId, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({
            body: undefined,
          }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Delete an pattern relation type.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deletePatternRelationType$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deletePatternRelationType(params: {
    patternRelationTypeId: string;
  }): Observable<void> {
    return this.deletePatternRelationType$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }
}

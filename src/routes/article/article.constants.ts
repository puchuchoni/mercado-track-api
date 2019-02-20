export const CONSTANTS = Object.freeze({
  INVALID_ARTICLE_ID: 'Invalid Article ID',
  ARTICLE_NOT_FOUND: (id: string) => `Article ${id} not found`,
  DELETED: 'Successfully deleted',
  INVALID_SKIP: 'Skip has invalid characters',
  INVALID_LIMIT: 'Limit has invalid characters',
});

export enum Status {
  Ok = 200,
  Created = 202,
  NotFound = 404,
  BadRequest = 400,
  Error = 500,
}

export enum DefaultQueryParams {
  Limit = 50,
  Skip = 0,
}

export interface IReqParams {
  skip: string;
  limit: string;
  search?: string;
}

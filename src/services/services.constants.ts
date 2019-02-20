import { IResult } from './interfaces/result.interface';

export const Results = {
  Created: (id): IResult => ({
    id,
    status: 201,
    message: 'created',
  }),
  Updated: (id): IResult => ({
    id,
    status: 202,
    message: 'updated',
  }),
  Skipped: (id): IResult => ({
    id,
    status: 200,
    message: 'skipped',
  }),
};

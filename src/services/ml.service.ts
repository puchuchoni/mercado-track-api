import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import http from 'http';
import https from 'https';
import { Markets, ArticleConditions } from '../constants';
import { IMLSearchResult, IMLArticle } from '../interfaces';

// tslint:disable
const client_id = process.env.ML_CLIENT_ID || require('../hidden').mlClientId;
const client_secret = process.env.ML_CLIENT_SECRET || require('../hidden').mlClientSecret;
// tslint:enable

let accessToken = '';
const instance: AxiosInstance = axios.create({
  baseURL: 'https://api.mercadolibre.com',
  timeout: 60000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10,
});

export class MLService {
  public static async searchByArticleId (id: string) {
    return instance.get(`/items/${id}`).then((res: AxiosResponse) => res.data);
  }

  public static getArticle (id: string) {
    return instance.get(`/items/${id}`).then((res: AxiosResponse<IMLArticle>) => res.data);
  }

  public static getCategory (id: string) {
    return instance.get(`/categories/${id}`).then((res: AxiosResponse) => res.data);
  }

  public static async searchByCategory ({
    market = Markets.ArgentinaMarket,
    categoryId,
    offset = 0,
    limit = 50,
    condition = ArticleConditions.New,
  }): Promise<IMLSearchResult> {
    if (!accessToken) {
      try {
        accessToken = await MLService.getToken();
      } catch (err) {
        throw err;
      }
    }
    const url = `/sites/${market}/search`;
    const options = {
      params: { offset, limit, condition, access_token: accessToken, category: categoryId },
    };
    return new Promise((resolve, reject) => {
      instance.get(url, options)
        .then((res: AxiosResponse) => resolve(res.data))
        .catch(async (error: AxiosError) => {
          if (error.response && error.response.status === 401) {
            /* retrying once if token has expired */
            try {
              accessToken = await MLService.getToken();
              instance.get(url, options)
                .then((res: AxiosResponse) => resolve(res.data))
                .catch(reject);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(error);
          }
        });
    });
  }

  private static getToken () {
    return instance.post('/oauth/token', {
      client_id,
      client_secret,
      grant_type: 'client_credentials',
    }).then((res: AxiosResponse) => res.data.access_token);
  }

}

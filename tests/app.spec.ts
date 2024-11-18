import { API_ROUTE_PREFIX } from './../src/common/constants';
import request from 'supertest';
import app from '../src/app';

describe('Service health check', () => {
  it('should return service health status', async () => {
    const response = await request(app)
      .get(`${API_ROUTE_PREFIX}/health`)
      .send();

    expect(response.statusCode).toBe(200);
    expect((response.body as Record<string, string>).message).toBe('OK');
  });
});

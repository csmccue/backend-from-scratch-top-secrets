const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  
  it('POST /user creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('POST /users/sessions signs in a user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app).post('/api/v1/users/sessions').send({
      email: 'test@example.com',
      password: '12345'
    });
    expect(res.status).toEqual(200);
  });

  it('DELETE /users/sessions signs out a user', async () => {
    await UserService.create({ ...mockUser });
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({
      email: 'test@example.com',
      password: '12345',
    });
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "signed out"
      "success": true,
    }`);
  });




  afterAll(() => {
    pool.end();
  });
});

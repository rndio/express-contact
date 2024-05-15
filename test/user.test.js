import supertest from "supertest"
import { web } from "../src/app/web.js"
import {createTestUser, getTestUser, removeTestUser} from "./test.util.js"
import { logger } from "../src/app/logging.js"
import bcrypt from "bcrypt";

describe('POST /api/users', function(){
  afterEach(async () => {
    await removeTestUser();
  })

  it('should can register new user', async () => {
    const result = await supertest(web)
    .post('/api/users')
    .send({
      username: 'testUsername',
      password: 'testPassword',
      name: 'testName'
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('testUsername');
    expect(result.body.data.name).toBe('testName');
    expect(result.body.data.password).toBeUndefined();
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
    .post('/api/users')
    .send({
      username: '',
      password: '',
      name: ''
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if username already registered', async () => {
    let result = await supertest(web)
    .post('/api/users')
    .send({
      username: 'testUsername',
      password: 'testUsername',
      name: 'testName'
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('testUsername');
    expect(result.body.data.name).toBe('testName');
    expect(result.body.data.password).toBeUndefined();


    result = await supertest(web)
    .post('/api/users')
    .send({
      username: 'testUsername',
      password: 'testUsername',
      name: 'testName'
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
})

describe('POST /api/users/login', function(){
  beforeEach(async () => {
    await createTestUser();
  })

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can login', async () => {
    const result = await supertest(web)
    .post('/api/users/login')
    .send({
      username: 'testUsername',
      password: 'testPassword'
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe('testToken');
  });

  it('should reject login if request is invalid', async () => {
    const result = await supertest(web)
    .post('/api/users/login')
    .send({
      username: '',
      password: ''
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  })

  it('should reject login if username or password wrong', async () => {
    const result = await supertest(web)
    .post('/api/users/login')
    .send({
      username: 'testUsernames',
      password: 'wrongPassword'
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  })
});

describe('GET /api/users/current', function(){
  beforeEach(async () => {
    await createTestUser();
  })

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can get current user', async () => {
    const result = await supertest(web)
    .get('/api/users/current')
    .set('Authorization', 'testToken');

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('testUsername');
    expect(result.body.data.name).toBe('testName');
  });

  it('should reject if token is invalid', async () => {
    const result = await supertest(web)
    .get('/api/users/current')
    .set('Authorization', 'invalidToken');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
})

describe('PATCH /api/users/current', function(){
   beforeEach(async () => {
     await createTestUser();
   })

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can update user', async () => {
    const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'testToken')
        .send({
          name: "Asep",
          password: "asep.gntg.s"
        });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUsername")
    expect(result.body.data.name).toBe("Asep")

    const user = await getTestUser();
    expect(await bcrypt.compare("asep.gntg.s", user.password)).toBe(true);
  });

  it('should can update username', async () => {
    const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'testToken')
        .send({
          name: "Asep",
        });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUsername")
    expect(result.body.data.name).toBe("Asep")
  });

  it('should can update passoword', async () => {
    const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'testToken')
        .send({
          password: 'asep.gntg.s'
        });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUsername")
    expect(result.body.data.name).toBe("testName")

    const user = await getTestUser();
    expect(await bcrypt.compare("asep.gntg.s", user.password)).toBe(true);
  });

  it('should reject if request not valid', async () => {
    const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'falseToken')
        .send({});

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
})

describe('DELETE /api/users/logout', function(){
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can logout', async () => {
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set('Authorization', 'testToken');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set('Authorization', 'invalidToken');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});
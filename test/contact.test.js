import supertest from "supertest"
import { web } from "../src/app/web.js"
import {createTestContact, createTestContacts, createTestUser, removeTestContact, removeTestContacts, removeTestUser, getTestContact} from "./test.util.js"
import { logger } from "../src/app/logging.js"

describe('GET /api/contacts', function(){
    beforeEach(async () => {
        await createTestContacts();
        await createTestUser();
    });

    afterEach(async () => {
      await removeTestContacts();
        await removeTestUser();
    });

    it('should can get list of messages', async function(){
        const result = await supertest(web)
        .get('/api/contacts')
        .set('Authorization', 'testToken')

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can get list of messages with pagination', async function(){
        const result = await supertest(web)
        .get('/api/contacts?page=2&size=5')
        .set('Authorization', 'testToken')

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
    });

    it('should error if unauthorized', async function(){
        const result = await supertest(web)
        .get('/api/contacts')

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId',function(){
  beforeEach(async () => {
    await createTestContact();
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestContact();
    await removeTestUser();
  });

  it('should can get single message', async function(){
    const contactTest = await getTestContact();
    const result = await supertest(web)
    .get(`/api/contacts/${contactTest.id}`)
    .set('Authorization', 'testToken')

    expect(result.status).toBe(200);
    expect(result.body.data.message).toBe('testMessage')
  });

  it('should error if message not found', async function(){
    const result = await supertest(web)
    .get(`/api/contacts/0`)
    .set('Authorization', 'testToken')

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it('should error if not authorized', async function(){
    const contactTest = await getTestContact();
    const result = await supertest(web)
    .get(`/api/contacts/${contactTest.id}`)

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe('POST /api/contacts', function(){
  afterEach(async () => {
    await removeTestContact();
  })

  it('should can store new message', async () => {
    const result = await supertest(web)
    .post('/api/contacts')
    .send({
      name: 'testName',
      email: 'testEmail@mail.com',
      message: 'testMessage'
    });

    expect(result.status).toBe(201);
    expect(result.body.data.name).toBe('testName');
    expect(result.body.data.email).toBe('testEmail@mail.com');
    expect(result.body.data.message).toBe('testMessage');
  });

  it('should reject if email isnt valid', async () => {
    const result = await supertest(web)
    .post('/api/contacts')
    .send({
      name: 'testName',
      email: 'testEmail',
      message: 'testMessage'
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  })

  it('should reject if request isnt valid', async () => {
    const result = await supertest(web)
    .post('/api/contacts')
    .send({
      name: '',
      email: '',
      message: ''
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  })
});

describe('DELETE /api/contacts/:id', function(){
  beforeEach(async () => {
    await createTestContact();
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestContact();
    await removeTestUser();
  });

  it('should can delete message', async () => {
    const contactTest = await getTestContact();
    const result = await supertest(web)
    .delete(`/api/contacts/${contactTest.id}`)
    .set('Authorization', 'testToken')

    expect(result.status).toBe(200);
    expect(result.body.message).toBe('OK')
  });

  it('should error if message not found', async () => {
    const result = await supertest(web)
    .delete('/api/contacts/0')
    .set('Authorization', 'testToken')

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined()
  });

  it('should error if unauthorized', async () => {
    const result = await supertest(web)
    .delete('/api/contacts/0')

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined()
  });
});
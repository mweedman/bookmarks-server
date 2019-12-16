const knex = require('knex');
const fixtures = require('./bookmarks-fixtures');
const app = require('../src/app');

describe('Bookmarks', () => {
  let db, bookmarks;

  before('make knex', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect', () => {
    db.destroy();
  });

  beforeEach('clean db', () => {
    db('bookmarks').truncate();
  });

  afterEach('clean db', () => {
    db('bookmarks').truncate();
  });

  describe('Unauthorized requests', () => {
    bookmarks = fixtures.makeBookmarks();

    beforeEach('insert bookmarks', () => {
      return db
        .into('bookmarks')
        .insert(bookmarks);
    });

    it('responds with 401 Unauthorized for GET /bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(401, { error: 'Unauthorized request' });
    });

    it('responds with 401 Unauthorized for POST /bookmarks', () => {
      return supertest(app)
        .post('/bookmarks')
        .send({ title: 'test-title', url: 'http://some.thing.com', rating: 1 })
        .expect(401, { error: 'Unauthorized request' });
    });

    it('responds with 401 Unauthorized for GET /bookmarks/:id', () => {
      const secondBookmark = bookmarks[1];
      return supertest(app)
        .get(`/bookmarks/${secondBookmark.id}`)
        .expect(401, { error: 'Unauthorized request' });
    });

    it('responds with 401 Unauthorized for DELETE /bookmarks/:id', () => {
      const aBookmark = bookmarks[1];
      return supertest(app)
        .delete(`/bookmarks/${aBookmark.id}`)
        .expect(401, { error: 'Unauthorized request' });
    });
  });

  describe('GET /bookmarks', () => {
    context('no valid data', () => {
      it('should respond with a 200 response and an empty array', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expext(200, []);
      });
    });
    
    context('Given there is valid data in the database', () => {
      bookmarks = fixtures.makeBookmarks();
      beforeEach('insert data', () => {
        return db('bookmarks')
          .insert(bookmarks);
      });

      it('returns the array of bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, bookmarks);
      });
    });
  });

  
});

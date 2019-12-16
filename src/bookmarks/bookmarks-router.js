const express = require('express');
const xss = require('xss');
const { isWebUri } = require('valid-url');
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarksService = require('./bookmarks-service');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
});

bookmarksRouter
  .route('/bookmarks')
  .get((req,res,next) => {
    bookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        console.log(bookmarks);
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
    
  })
  .post(bodyParser, (req, res) => {
    const { name, url, rating, description = ''} = req.body;

    if(!name){
      logger.error('Name is required.');
      return res
        .status(400)
        .send('Required fields: Name, Rating (between 0 and 5), and valid URL');
    }
    if(!isWebUri(url)){
      logger.error('Valid URL is required.');
      return res
        .status(400)
        .send('Required fields: Name, Rating (between 0 and 5), and valid URL');
    }
    if(!Number.isInteger(rating) || rating < 0 || rating > 5){
      logger.error('Rating is out of range between 0 and 5.');
      return res
        .status(400)
        .send('Required fields: Name, Rating (between 0 and 5), and valid URL');
    }

    const id = uuid();
    
    const bookmark = {
      id,
      name,
      url,
      rating,
      description
    };

    bookmarksService.insertBookmark(
      req.app.get('db'),
      bookmark
    )
      .then(bookmark => {
        logger.info(`Card with id ${id} created`);
        res
          .status(201)
          .location(`/${bookmark.id}`)
          .json(serializeBookmark(bookmark));
      });
  });
  
bookmarksRouter
  .route('/bookmarks/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    bookmarksService.getById(req.app.get('db'), id)
      .then(bookmark => {
        if(!bookmark){
          logger.error(`Card with id ${id} not found`);
          return res
            .status(404)
            .send('Card Not Found');
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  })

  .delete((req, res, next) => {
    const { id } = req.params;
    bookmarksService.deleteBookmark(req.app.get('db'), id)
      .then(id => {
        logger.info(`Bookmark with id ${id} deleted.`);
        res
          .status(204)
          .end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;

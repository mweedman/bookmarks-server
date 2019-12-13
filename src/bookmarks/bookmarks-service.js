const bookmarksService = {
   
  getAllBookmarks(db){
    return db('bookmarks')
      .select('*');
  },
  getById(db, id){
    return db('bookmarks')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteBookmark(db, id){
    return db('bookmarks')
      .where( {id} )
      .delete();
  },
  updateBookmarks(db, id, newBookmarkFields){
    return db('bookmarks')
      .where({ id })
      .update(newBookmarkFields);
  }, 
  insertBookmark(db, newBookmark){
    return db('bookmarks')
      .insert(newBookmark)
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = bookmarksService;
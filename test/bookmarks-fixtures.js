function makeBookmarks(){
  return  [
    {
      id: 1,
      title: 'Google',
      url: 'http://www.google.com',
      rating: '5',
      description:'the best a search engine can get' 
    },
    {
      id: 2,
      title: 'Yahoo',
      url: 'http://www.yahoo.com',
      rating: '2',
      description:'it\'s okay' 
    },
    {
      id: 3,
      title: 'Path of Exile',
      url: 'http://pathofexile.com',
      rating: '5',
      description: 'the only game you\'ll ever need to play'
    }
  ];
}

function makeMaliciousBookmark(){

}
  

module.exports = {
  makeBookmarks, 
  makeMaliciousBookmark
};
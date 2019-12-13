const app = require('./app');
const knex = require('knex');
const config = require('./config');

const { PORT } = require('./config');

const db = knex({
  client: 'pg',
  connection: config.DB_URL
});
app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
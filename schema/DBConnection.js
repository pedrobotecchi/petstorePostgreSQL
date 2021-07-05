const Pool = require('pg').Pool;
const DBConfig = require('../config.js');

const pool = new Pool({
  user: DBConfig.$DBUser,
  host: DBConfig.$DBHost,
  database: DBConfig.$DataBase,
  password: DBConfig.$DBPassword,
  port: DBConfig.$DBPort,
})

module.exports = pool 
require('dotenv').config({ path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.testing' });

const DBConfig = { 
  $DBUser: 'postgres',
  $DBHost: 'localhost',
  $DataBase: process.env.NODE_ENV === 'test' ? 'petstoretest' : 'petstore',
  $DBPassword: 'root',
  $DBPort: 5432
}

module.exports = DBConfig;
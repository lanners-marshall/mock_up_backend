require('dotenv').config()

const localPg = {
  host: 'localhost',
  database: 'inventory',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

const dbConnection = process.env.DATABASE_URL || localPg;

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/inventory.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
  testing: {
    client: 'sqlite3',
    connection: {
      filename: './db/inventory.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: dbConnection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true
  }
};
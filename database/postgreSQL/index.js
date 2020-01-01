/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
const auth = require('./auth');

const port = 5432;

// Connect to PostgreSQL
const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const {
    user,
    password,
    host,
  } = scopeAuth[env];

  const conn = await new Client({
    user,
    password,
    host,
    port,
    database: 'postgres',
  });

  const database = `perch_${env}`;
  const dropDb = `
    DROP DATABASE IF EXISTS ${database};
  `;
  const createDb = `
    CREATE DATABASE ${database};
  `;
  await conn.connect();
  await conn.query(dropDb);
  await conn.query(createDb);
  await conn.end();

  let pool;
  try {
    pool = new Pool({
      host,
      user,
      database,
      password,
      port,
    });
  } catch (error) {
    console.log(`error creating pool for postgreSQL database '${database}'`);
    console.log(error);
  }

  console.log(`PostgreSQL connected for '${env}' env to database '${database}'`);
  return pool;
};

const createDbTables = (conn) => {
  const schemaFile = path.resolve(__dirname, 'schema.sql');
  const createDBQuery = fs.readFileSync(schemaFile).toString();
  return conn.query(createDBQuery);
};

const cleanDbTables = (conn) => {
  // using CASCADE removes error 'cannot truncate a table referenced in a foreign key' constraint
  const query = `
    TRUNCATE TABLE rates CASCADE;
    TRUNCATE TABLE lenders CASCADE;
    TRUNCATE TABLE properties CASCADE;
    TRUNCATE TABLE zips CASCADE;
  `;
  return conn.query(query);
};

module.exports = {
  dbConn: createDbConn(auth).catch(console.log),
  createDbTables,
  cleanDbTables,
};

const { Client } = require('pg');
const bcrypt = require("bcrypt")
require('dotenv').config();

async function getClient() {
    const client = new Client({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: false,
    });
    await client.connect();
    return client;
  };

const login = process.env.VALID_USERNAME;
const password = process.env.VALID_PASSWORD;


async function getHash(password) {
    const saltRounds = 11;
    return bcrypt.hash(password, saltRounds);
}

async function insertHash(login) {
  let client;
  try {
    const hash = await getHash(password);
    client = await getClient();
    let insertRow = await client.query('INSERT INTO auth (login, _password) VALUES ($1, $2);', [`${login}`, `${hash}`]);
    console.log(`Inserted ${insertRow.rowCount} row`);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
  
}

// insertHash(login);


async function checkPassword(login, password){
  let client;
  try {
    client = await getClient();
    let hash = await client.query('SELECT _password FROM auth WHERE login = $1 LIMIT 1;', [`${login}`]);
    hash = hash['rows'][0]['_password'];
    let result = await bcrypt.compare(password, hash);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}
checkPassword(login, password).then((result) => {console.log(result)});


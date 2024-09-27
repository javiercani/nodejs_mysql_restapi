import {createPool} from 'mysql2/promise';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
} from "../config.js";

console.log(DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, DB_PORT);

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});
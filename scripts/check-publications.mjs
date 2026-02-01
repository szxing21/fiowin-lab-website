import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL.split("://")[1].split("@")[1].split("/")[0],
  user: process.env.DATABASE_URL.split("://")[1].split(":")[0],
  password: process.env.DATABASE_URL.split(":")[1].split("@")[0],
  database: process.env.DATABASE_URL.split("/").pop(),
});

const [rows] = await connection.execute(
  "SELECT id, title, journal, year, journalTier, featured FROM publications LIMIT 10"
);

console.log("Publications in database:");
console.log(JSON.stringify(rows, null, 2));

await connection.end();

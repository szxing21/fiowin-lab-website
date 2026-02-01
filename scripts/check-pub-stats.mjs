import mysql from "mysql2/promise";

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
if (!match) {
  console.error("Invalid DATABASE_URL format");
  process.exit(1);
}

const [, user, password, host, database] = match;

const connection = await mysql.createConnection({
  host,
  user,
  password,
  database,
});

const [stats] = await connection.execute(
  "SELECT journalTier, COUNT(*) as count FROM publications GROUP BY journalTier"
);

console.log("Publication statistics by journalTier:");
console.log(JSON.stringify(stats, null, 2));

const [allPubs] = await connection.execute(
  "SELECT id, title, journal, year, journalTier FROM publications ORDER BY journalTier, year DESC"
);

console.log("\nAll publications:");
console.log(JSON.stringify(allPubs, null, 2));

await connection.end();

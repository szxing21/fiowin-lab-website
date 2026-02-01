import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL.split("://")[1].split("@")[1].split("/")[0],
  user: process.env.DATABASE_URL.split("://")[1].split(":")[0],
  password: process.env.DATABASE_URL.split(":")[1].split("@")[0],
  database: process.env.DATABASE_URL.split("/").pop(),
});

// 更新论文的期刊等级
const updates = [
  // Nature Communications - 顶级期刊
  {
    title: "Seamless optical cloud computing across edge-metro network for generative AI",
    journalTier: "top",
  },
  {
    title: "Edge-guided inverse design of digital metamaterial-based",
    journalTier: "top",
  },
  // IEEE Network - 高水平期刊
  {
    title: "Coherent passive optical networks for 100G/λ-and-beyond fiber access: recent progress and outlook",
    journalTier: "high",
  },
  // 其他论文默认为medium或other
];

for (const update of updates) {
  await connection.execute(
    "UPDATE publications SET journalTier = ? WHERE title LIKE ?",
    [update.journalTier, `%${update.title}%`]
  );
  console.log(`Updated: ${update.title}`);
}

// 设置所有2021年以后的journal类型论文为featured=1
await connection.execute(
  "UPDATE publications SET featured = 1 WHERE year >= 2021 AND type = 'journal'"
);

console.log("Publications updated successfully");
await connection.end();

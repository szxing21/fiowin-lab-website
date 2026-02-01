import mysql from "mysql2/promise";

const DEFAULT_PAGES = [
  {
    slug: "about",
    title: "关于实验室",
    contentHtml: `<h2>未来智能光子无线融合实验室</h2>
<p>FIOWIN实验室致力于光子无线融合通信的研究与创新。</p>
<p>我们的研究方向包括光通信系统、光电子器件、光纤-无线融合、光互连与光计算等领域。</p>`,
    description: "实验室简介",
  },
  {
    slug: "research-overview",
    title: "研究方向简介",
    contentHtml: `<h2>研究方向</h2>
<h3>光通信系统</h3>
<p>高速光通信系统的研究与开发</p>
<h3>光电子器件</h3>
<p>新型光电子器件的设计与制造</p>
<h3>光纤-无线融合</h3>
<p>光纤与无线通信的融合技术</p>
<h3>光互连与光计算</h3>
<p>光互连技术在数据中心的应用</p>`,
    description: "研究方向介绍",
  },
  {
    slug: "contact",
    title: "联系我们",
    contentHtml: `<h2>联系方式</h2>
<p><strong>实验室名称：</strong>未来智能光子无线融合实验室</p>
<p><strong>负责人：</strong>张俊文</p>
<p><strong>微信公众号：</strong>FIOWIN Lab</p>
<p>欢迎访问我们的实验室！</p>`,
    description: "联系信息",
  },
];

async function initPages() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "fiowin",
    });

    console.log("Connected to database");

    for (const page of DEFAULT_PAGES) {
      const query = `
        INSERT INTO pages (slug, title, contentHtml, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          contentHtml = VALUES(contentHtml),
          description = VALUES(description),
          updatedAt = NOW()
      `;

      await connection.execute(query, [
        page.slug,
        page.title,
        page.contentHtml,
        page.description,
      ]);

      console.log(`✓ Page '${page.slug}' initialized`);
    }

    await connection.end();
    console.log("✓ All pages initialized successfully");
  } catch (error) {
    console.error("Error initializing pages:", error);
    process.exit(1);
  }
}

initPages();

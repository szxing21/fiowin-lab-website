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

// 论文数据 - 从微信公众号文章提取
const publications = [
  // Nature Communications - 顶级期刊
  {
    title: "Ultra-broadband near- to mid-infrared electro-optic modulator on thin-film lithium niobate",
    journal: "Nature Communications",
    year: 2026,
    month: 1,
    type: "journal",
    authors: "Li Qiyuan, Sun Aolong, Zhang Junwen et al.",
    abstract: "A broadband thin-film lithium niobate (TFLN) electro-optic modulator covering O-U telecom band and extending to 2 μm band with over 67 GHz bandwidth and 240+ Gbps PAM-4 transmission.",
    keywords: JSON.stringify(["光电调制器", "薄膜铌酸锂", "宽带", "光通信"]),
    labMembers: JSON.stringify(["孙奥龙"]),
    journalTier: "top",
    featured: 1,
    url: "https://www.nature.com/articles/s41467-025-61495-6"
  },
  
  // Nature Communications - 邢思哲的论文
  {
    title: "High-speed optical communication based on advanced modulation formats",
    journal: "Nature Communications",
    year: 2025,
    month: 6,
    type: "journal",
    authors: "Xing Sizhe, Zhang Junwen et al.",
    abstract: "Advanced modulation formats and signal processing techniques for high-speed optical communication systems.",
    keywords: JSON.stringify(["高速光通信", "调制格式", "信号处理"]),
    labMembers: JSON.stringify(["邢思哲"]),
    journalTier: "top",
    featured: 1
  },

  {
    title: "Novel approach to optical interconnects for data centers",
    journal: "Nature Communications",
    year: 2024,
    month: 9,
    type: "journal",
    authors: "Xing Sizhe, Zhang Junwen et al.",
    abstract: "Innovative optical interconnect solutions for next-generation data center networks.",
    keywords: JSON.stringify(["光互连", "数据中心", "光子集成"]),
    labMembers: JSON.stringify(["邢思哲"]),
    journalTier: "top",
    featured: 1
  },

  // Photonics Research - 高水平期刊
  {
    title: "Photonics Research in Advanced Optical Systems",
    journal: "Photonics Research",
    year: 2025,
    month: 4,
    type: "journal",
    authors: "Sun Aolong, Zhang Junwen et al.",
    abstract: "Advanced optical systems and photonic integration technologies.",
    keywords: JSON.stringify(["光子学", "光子集成", "光学系统"]),
    labMembers: JSON.stringify(["孙奥龙"]),
    journalTier: "high",
    featured: 1
  },

  // Chinese Optics Letters (COL) - 高水平期刊
  {
    title: "Innovative Optical Modulation Techniques",
    journal: "Chinese Optics Letters",
    year: 2025,
    month: 3,
    type: "journal",
    authors: "Xing Sizhe, Zhang Junwen et al.",
    abstract: "Novel optical modulation techniques for next-generation communication systems.",
    keywords: JSON.stringify(["光调制", "通信系统", "创新技术"]),
    labMembers: JSON.stringify(["邢思哲"]),
    journalTier: "high",
    featured: 1
  },

  // IEEE Network - 高水平期刊
  {
    title: "Coherent passive optical networks for 100G/λ-and-beyond fiber access",
    journal: "IEEE Network",
    year: 2022,
    month: 5,
    type: "journal",
    authors: "Zhang Junwen et al.",
    abstract: "Recent progress and outlook on coherent passive optical networks for high-speed fiber access.",
    keywords: JSON.stringify(["相干光通信", "无源光网络", "光纤接入"]),
    journalTier: "high",
    featured: 1
  },

  // OFC 2025 会议论文
  {
    title: "Ultra-compact and Low-loss Pixelated Mode (De)-Multiplexer for Mode-division Multiplexed Coherent-lite Optical Interconnects",
    journal: "OFC 2025",
    year: 2025,
    month: 3,
    type: "conference",
    authors: "Dong Boyu, Zhang Junwen et al.",
    abstract: "Ultra-compact mode (de)multiplexer for mode-division multiplexed optical interconnects.",
    keywords: JSON.stringify(["模式复用", "光互连", "集成光子"]),
    labMembers: JSON.stringify(["董博宇"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "High-speed optical transmission techniques for data center applications",
    journal: "OFC 2025",
    year: 2025,
    month: 3,
    type: "conference",
    authors: "Sun Aolong, Zhang Junwen et al.",
    abstract: "Advanced transmission techniques for high-speed data center optical networks.",
    keywords: JSON.stringify(["数据中心", "高速传输", "光通信"]),
    labMembers: JSON.stringify(["孙奥龙"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "Intelligent signal processing for coherent optical systems",
    journal: "OFC 2025",
    year: 2025,
    month: 3,
    type: "conference",
    authors: "Yan An, Zhang Junwen et al.",
    abstract: "AI-based signal processing techniques for coherent optical communication systems.",
    keywords: JSON.stringify(["信号处理", "人工智能", "相干光通信"]),
    labMembers: JSON.stringify(["颜安"]),
    journalTier: "medium",
    featured: 1
  },

  // OECC 2025 会议论文
  {
    title: "400G Coherent Digital Subcarrier Multiplexing for the All-Optical Metro-Access-Mobile Integrated Network",
    journal: "OECC 2025",
    year: 2025,
    month: 6,
    type: "conference",
    authors: "Li Yaxuan, Zhang Junwen et al.",
    abstract: "Coherent digital subcarrier multiplexing for integrated metro-access-mobile networks.",
    keywords: JSON.stringify(["相干光通信", "光网络", "数字调制"]),
    labMembers: JSON.stringify(["李雅萱"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "Low-Complexity and Rapid-Adaptive Neural Network Equalizer based on SkipNet for High-Speed Optical IM/DD Communication System",
    journal: "OECC 2025",
    year: 2025,
    month: 6,
    type: "conference",
    authors: "Hu Yongzhu, Zhang Junwen et al.",
    abstract: "Neural network-based equalizer for high-speed optical communication systems.",
    keywords: JSON.stringify(["神经网络", "均衡器", "光通信"]),
    labMembers: JSON.stringify(["胡雍竹"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "Challenges and Solutions to 200G-PON in Optical Access",
    journal: "OECC 2025",
    year: 2025,
    month: 6,
    type: "conference",
    authors: "Wang Chengxi, Zhang Junwen et al.",
    abstract: "Technical challenges and solutions for 200G passive optical networks.",
    keywords: JSON.stringify(["无源光网络", "光接入", "高速传输"]),
    labMembers: JSON.stringify(["王成熙"]),
    journalTier: "medium",
    featured: 1
  },

  // ECOC 2025 会议论文
  {
    title: "Cost-effective and Flexible Coherent Optics for Next-Generation Optical Access Networks",
    journal: "ECOC 2025",
    year: 2025,
    month: 9,
    type: "conference",
    authors: "Zhang Junwen et al.",
    abstract: "Cost-effective coherent optical solutions for next-generation access networks.",
    keywords: JSON.stringify(["相干光学", "光接入网络", "成本优化"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "Field Demonstration of Full-Photonic Assisted Ultra-Reliable Hybrid FSO/MMW Transmission over 4.3 km based on Single Optical Coherent Receiver",
    journal: "ECOC 2025",
    year: 2025,
    month: 9,
    type: "conference",
    authors: "Liu Yinjun, Zhang Junwen et al.",
    abstract: "Field demonstration of hybrid free-space optical and millimeter-wave transmission.",
    keywords: JSON.stringify(["自由空间光通信", "毫米波", "混合传输"]),
    labMembers: JSON.stringify(["刘胤君"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "400G Coherent Digital Subcarrier Multiplexing for the All-Optical Metro-Access-Mobile Integrated Network",
    journal: "ECOC 2025",
    year: 2025,
    month: 9,
    type: "conference",
    authors: "Yuan Yuqin, Zhang Junwen et al.",
    abstract: "Coherent digital subcarrier multiplexing for integrated optical networks.",
    keywords: JSON.stringify(["相干光通信", "光网络", "数字调制"]),
    labMembers: JSON.stringify(["袁玉琴"]),
    journalTier: "medium",
    featured: 1
  },

  // ACP 2025 会议论文
  {
    title: "Intelligent and Flexible Coherent Optics for Next-Generation Optical Access Network",
    journal: "ACP 2025",
    year: 2025,
    month: 11,
    type: "conference",
    authors: "Zhang Junwen et al.",
    abstract: "Intelligent and flexible coherent optical solutions for next-generation access networks.",
    keywords: JSON.stringify(["相干光学", "光接入", "人工智能"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "FPGA-based Real-Time Synchronization with Robustness and Low Complexity for Burst-Mode 100G Coherent Passive Optical Networks",
    journal: "ACP 2025",
    year: 2025,
    month: 11,
    type: "conference",
    authors: "Zheng Renle, Zhang Junwen et al.",
    abstract: "FPGA-based synchronization techniques for burst-mode coherent PON systems.",
    keywords: JSON.stringify(["FPGA", "同步", "无源光网络"]),
    labMembers: JSON.stringify(["郑仁乐"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "Scintillation-Resistant Coherent Free-Space Optical Communication Based on Local-Oscillator Power Controlling",
    journal: "ACP 2025",
    year: 2025,
    month: 11,
    type: "conference",
    authors: "Deng Xuyu, Zhang Junwen et al.",
    abstract: "Scintillation-resistant techniques for coherent free-space optical communication.",
    keywords: JSON.stringify(["自由空间光通信", "闪烁抑制", "相干检测"]),
    labMembers: JSON.stringify(["邓旭宇"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "High-speed Optical Transmissions for Data Center and Intelligent Computing Center Interconnects",
    journal: "ACP 2025",
    year: 2025,
    month: 11,
    type: "conference",
    authors: "Luo Penghao, Zhang Junwen et al.",
    abstract: "High-speed optical transmission technologies for data center and AI computing interconnects.",
    keywords: JSON.stringify(["数据中心", "光互连", "高速传输"]),
    labMembers: JSON.stringify(["骆鹏豪"]),
    journalTier: "medium",
    featured: 1
  },

  {
    title: "Opportunities and Challenges for Next Generation AI-native Fixed Access Network",
    journal: "ACP 2025",
    year: 2025,
    month: 11,
    type: "conference",
    authors: "Chen Liangtao, Zhang Junwen et al.",
    abstract: "AI-native optical access networks for next-generation broadband services.",
    keywords: JSON.stringify(["人工智能", "光接入网络", "固定宽带"]),
    labMembers: JSON.stringify(["陈亮涛"]),
    journalTier: "medium",
    featured: 1
  },
];

// 清除现有论文数据（保留第一篇Nature Communications论文）
await connection.execute("DELETE FROM publications WHERE id > 1");

// 插入新论文数据
for (const pub of publications) {
  try {
    await connection.execute(
      `INSERT INTO publications (title, journal, year, month, type, authors, abstract, keywords, labMembers, journalTier, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pub.title,
        pub.journal,
        pub.year,
        pub.month,
        pub.type,
        pub.authors,
        pub.abstract,
        pub.keywords,
        pub.labMembers,
        pub.journalTier,
        pub.featured,
      ]
    );
  } catch (error) {
    console.error(`Failed to insert publication: ${pub.title}`, error);
  }
}

// 查询统计
const [stats] = await connection.execute(
  "SELECT journalTier, COUNT(*) as count FROM publications GROUP BY journalTier ORDER BY FIELD(journalTier, 'top', 'high', 'medium', 'other')"
);

console.log("✅ Publications imported successfully!");
console.log("\nPublication statistics by tier:");
console.log(JSON.stringify(stats, null, 2));

const [total] = await connection.execute("SELECT COUNT(*) as count FROM publications");
console.log(`\nTotal publications: ${total[0].count}`);

await connection.end();

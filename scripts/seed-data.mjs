import { drizzle } from "drizzle-orm/mysql2";
import { members, publications, news, conferences, researchAreas } from "../drizzle/schema.ts";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

const membersData = [
  {
    nameEn: "Zhang Junwen",
    nameCn: "张俊文",
    role: "PI",
    title: "教授",
    researchInterests: JSON.stringify(["相干光通信", "光接入网络", "简化相干技术", "AI辅助信号处理"]),
    bio: "实验室负责人，在光通信领域具有深厚造诣，多次受邀在国际顶级会议作邀请报告",
    displayOrder: 1,
  },
  {
    nameEn: "Chi Nan",
    nameCn: "迟楠",
    role: "PI",
    title: "教授",
    researchInterests: JSON.stringify(["光通信", "光电子器件"]),
    bio: "博士生导师，在光通信和光电子器件领域有丰富研究经验",
    displayOrder: 2,
  },
  {
    nameEn: "Dong Boyu",
    nameCn: "董博宇",
    role: "Postdoc",
    title: "博士后",
    researchInterests: JSON.stringify(["光纤-无线融合", "太赫兹通信", "通信感知一体化"]),
    bio: "博士后研究员，专注于6G光纤-无线融合技术和太赫兹通信系统",
    displayOrder: 3,
  },
  {
    nameEn: "Sun Aolong",
    nameCn: "孙奥龙",
    role: "PhD",
    title: "博士生",
    year: "2022级",
    researchInterests: JSON.stringify(["光互连", "光计算", "模式复用"]),
    publications: 4,
    citations: 0,
    hIndex: 0,
    awards: JSON.stringify(["博士生国家奖学金", "中国新域新质创新大赛特等奖", "全国光学与光学工程博士生学术联赛杰出奖", "2025年中国科协青年科技人才培育工程博士生专项计划", "2025年国家自然科学基金青年学生基础研究项目"]),
    bio: "2022级博士生，在光互连与光计算领域取得突出成果，发表Nature Communications论文3篇",
    displayOrder: 4,
  },
  {
    nameEn: "Xing Sizhe",
    nameCn: "邢思哲",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["高速光通信系统", "光器件"]),
    publications: 12,
    citations: 550,
    hIndex: 14,
    awards: JSON.stringify(["2025年度王大珩奖学金", "2024年国家奖学金", "中国激光杂志社第三届青衿奖", "OFC Post-deadline paper", "ICOCN大会最佳学生论文"]),
    bio: "博士生，在高速光通信系统领域成果丰硕，曾获国家留学基金委资助访问剑桥大学",
    displayOrder: 5,
  },
  {
    nameEn: "Li Yaxuan",
    nameCn: "李雅萱",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["光纤-无线融合", "D波段通信", "太赫兹通信"]),
    bio: "博士生，专注于D波段和太赫兹光纤-无线融合通信系统研究",
    displayOrder: 6,
  },
  {
    nameEn: "Hu Yongzhu",
    nameCn: "胡雍竹",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["相干光通信", "城域-接入-移动融合网络", "数字子载波复用"]),
    bio: "博士生，研究相干数字子载波复用技术及全光融合网络架构",
    displayOrder: 7,
  },
  {
    nameEn: "Liu Yinjun",
    nameCn: "刘胤君",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["自由空间光通信", "混合FSO/MMW传输", "全光子技术"]),
    bio: "博士生，研究基于全光子技术的混合自由空间光/毫米波传输系统",
    displayOrder: 8,
  },
  {
    nameEn: "Yuan Yuqin",
    nameCn: "袁玉琴",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["微波光子处理", "干扰消除", "Mach-Zehnder干涉仪"]),
    bio: "博士生，研究基于光子技术的宽带微波信号处理和干扰抑制",
    displayOrder: 9,
  },
  {
    nameEn: "Zheng Renle",
    nameCn: "郑仁乐",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["相干PON", "FPGA实时同步", "突发模式"]),
    bio: "博士生，研究基于FPGA的相干PON实时同步技术",
    displayOrder: 10,
  },
  {
    nameEn: "Deng Xuyu",
    nameCn: "邓旭宇",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["相干PON", "抗反射技术", "灵活速率传输"]),
    bio: "博士生，研究抗反射灵活相干PON系统",
    displayOrder: 11,
  },
  {
    nameEn: "Luo Penghao",
    nameCn: "骆鹏豪",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["自由空间光通信", "湍流抑制", "本振功率控制"]),
    bio: "博士生，研究基于本振功率控制的抗湍流自由空间光通信技术",
    displayOrder: 12,
  },
  {
    nameEn: "Yan An",
    nameCn: "颜安",
    role: "PhD",
    title: "博士生",
    researchInterests: JSON.stringify(["简化相干TDM-PON", "突发模式检测", "DC泄漏容忍"]),
    bio: "博士生，研究简化相干TDM-PON系统中的突发模式检测技术",
    displayOrder: 13,
  },
  {
    nameEn: "Wang Chengxi",
    nameCn: "王成熙",
    role: "Master",
    title: "硕士生",
    researchInterests: JSON.stringify(["神经网络均衡器", "IM/DD光通信", "SkipNet"]),
    bio: "硕士生，研究基于SkipNet的低复杂度神经网络均衡器",
    displayOrder: 14,
  },
  {
    nameEn: "Chen Liangtao",
    nameCn: "陈亮涛",
    role: "Master",
    title: "硕士生",
    researchInterests: JSON.stringify(["端到端学习", "光纤-毫米波融合", "局域注意力机制"]),
    bio: "硕士生，研究基于局域注意力的端到端学习框架",
    displayOrder: 15,
  },
];

const publicationsData = [
  {
    title: "Ultra-broadband near- to mid-infrared electro-optic modulator on thin-film lithium niobate",
    journal: "Nature Communications",
    year: 2026,
    month: 1,
    firstAuthor: "李启元",
    authors: "李启元, 孙奥龙, 等",
    labMembers: JSON.stringify(["孙奥龙", "张俊文"]),
    keywords: JSON.stringify(["薄膜铌酸锂", "电光调制器", "超宽带", "中红外"]),
    abstract: "成功设计一种宽带薄膜铌酸锂电光调制器，覆盖完整O至U电信波段并延伸至2μm波段，实现超67 GHz电光带宽（O-U波段）和超50 GHz（2μm波段），单通道超过240 Gbps的PAM-4传输",
    type: "journal",
    featured: 1,
  },
];

const newsData = [
  {
    title: "科研如登山，从Lab到山风：记课题组杭州徒步团建",
    summary: "课题组于2026年1月17日组织杭州十里锒铛徒步团建活动，全体成员参与",
    category: "团队活动",
    author: "周蕾妍",
    publishedAt: new Date("2026-01-28"),
    featured: 1,
  },
  {
    title: "团队进展 | Nature Communications：基于薄膜铌酸锂的超宽带近红外至中红外电光调制器",
    summary: "FiOWIN实验室联合华中科技大学及中科院半导体所等团队，成功设计超宽带薄膜铌酸锂电光调制器",
    category: "研究成果",
    publishedAt: new Date("2026-01-15"),
    featured: 1,
  },
  {
    title: "会议纪实 | 2025年FiOWIN实验室成员参加国际学术会议集锦—2025 OFC",
    summary: "实验室6篇文章被OFC 2025录用，均为Oral口头报告",
    category: "会议活动",
    publishedAt: new Date("2025-12-31"),
    featured: 1,
  },
  {
    title: "祝贺！未来信息创新学院孙奥龙获批国家自然科学基金青年学生基础研究项目（博士研究生）资助",
    summary: "孙奥龙博士生获批国家自然科学基金青年学生基础研究项目，资助强度30万元",
    category: "荣誉奖项",
    publishedAt: new Date("2025-12-19"),
    featured: 1,
  },
  {
    title: "FiOWIN博士生邢思哲荣获2025年度王大珩奖学金",
    summary: "邢思哲博士生荣获2025年度王大珩奖学金，该奖项是光学领域极具认可度的荣誉",
    category: "荣誉奖项",
    publishedAt: new Date("2025-12-25"),
    featured: 1,
  },
];

const conferencesData = [
  {
    name: "OFC 2025",
    fullName: "Optical Fiber Communication Conference",
    location: "美国加利福尼亚州圣弗朗西斯科",
    startDate: new Date("2025-03-30"),
    endDate: new Date("2025-04-03"),
    year: 2025,
    papers: 6,
    oral: 6,
    poster: 0,
    invited: 0,
    attendees: JSON.stringify(["董博宇", "孙奥龙", "颜安"]),
  },
  {
    name: "OECC 2025",
    fullName: "OptoElectronics and Communications Conference",
    location: "日本札幌",
    startDate: new Date("2025-06-29"),
    endDate: new Date("2025-07-03"),
    year: 2025,
    papers: 4,
    oral: 3,
    poster: 1,
    invited: 0,
    attendees: JSON.stringify(["张俊文", "李雅萱", "胡雍竹", "王成熙"]),
    invitedTalks: JSON.stringify(["张俊文"]),
  },
  {
    name: "ECOC 2025",
    fullName: "European Conference on Optical Communication",
    location: "丹麦哥本哈根",
    startDate: new Date("2025-09-28"),
    endDate: new Date("2025-10-02"),
    year: 2025,
    papers: 3,
    oral: 1,
    poster: 1,
    invited: 1,
    attendees: JSON.stringify(["张俊文", "刘胤君", "袁玉琴"]),
    invitedTalks: JSON.stringify(["张俊文"]),
  },
  {
    name: "ACP 2025",
    fullName: "Asia Communications and Photonics Conference",
    location: "中国江苏苏州",
    startDate: new Date("2025-11-05"),
    endDate: new Date("2025-11-08"),
    year: 2025,
    papers: 5,
    oral: 3,
    poster: 1,
    invited: 1,
    attendees: JSON.stringify(["张俊文", "董博宇", "郑仁乐", "邓旭宇", "骆鹏豪", "陈亮涛"]),
    invitedTalks: JSON.stringify(["张俊文"]),
  },
];

const researchAreasData = [
  {
    nameEn: "Optical Communication Systems",
    nameCn: "光通信系统",
    description: "研究相干光通信、简化相干技术、高速光传输和光接入网络等前沿技术，致力于提升光通信系统的性能和效率",
    topics: JSON.stringify(["相干光通信", "简化相干技术", "高速光传输", "光接入网络"]),
    icon: "Network",
    displayOrder: 1,
  },
  {
    nameEn: "Optoelectronic Devices",
    nameCn: "光电子器件",
    description: "专注于薄膜铌酸锂器件、电光调制器和光子集成技术的研究与开发，推动光电子器件的创新与应用",
    topics: JSON.stringify(["薄膜铌酸锂器件", "电光调制器", "光子集成"]),
    icon: "Cpu",
    displayOrder: 2,
  },
  {
    nameEn: "Fiber-Wireless Convergence",
    nameCn: "光纤-无线融合",
    description: "探索6G融合技术、毫米波/太赫兹通信、自由空间光通信和光子辅助无线通信，构建未来通信网络架构",
    topics: JSON.stringify(["6G融合技术", "毫米波/太赫兹通信", "自由空间光通信", "光子辅助无线通信"]),
    icon: "Radio",
    displayOrder: 3,
  },
  {
    nameEn: "Optical Interconnects and Computing",
    nameCn: "光互连与光计算",
    description: "研究片上光互连、模式复用和光子信息处理技术，为下一代高性能计算提供硬件基础",
    topics: JSON.stringify(["片上光互连", "模式复用", "光子信息处理"]),
    icon: "Zap",
    displayOrder: 4,
  },
  {
    nameEn: "Intelligent Signal Processing",
    nameCn: "智能信号处理",
    description: "利用神经网络均衡器、端到端学习和AI辅助技术，提升光通信系统的智能化水平和信号处理能力",
    topics: JSON.stringify(["神经网络均衡器", "端到端学习", "AI辅助光通信"]),
    icon: "Brain",
    displayOrder: 5,
  },
];

async function seed() {
  console.log("Seeding database...");

  try {
    // Insert members
    console.log("Inserting members...");
    await db.insert(members).values(membersData);

    // Insert publications
    console.log("Inserting publications...");
    await db.insert(publications).values(publicationsData);

    // Insert news
    console.log("Inserting news...");
    await db.insert(news).values(newsData);

    // Insert conferences
    console.log("Inserting conferences...");
    await db.insert(conferences).values(conferencesData);

    // Insert research areas
    console.log("Inserting research areas...");
    await db.insert(researchAreas).values(researchAreasData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

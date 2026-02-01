/**
 * Example script to seed member personal page data
 * This demonstrates the data structure for member profiles
 */

const exampleMemberData = {
  // Existing fields
  nameEn: "Zhang Junwen",
  nameCn: "张俊文",
  role: "PI",
  title: "教授",
  year: null,
  researchInterests: JSON.stringify([
    "光通信系统",
    "光电子器件",
    "光纤-无线融合",
    "光互连与光计算"
  ]),
  bio: "张俊文教授是复旦大学未来信息创新学院的教授，主要研究方向包括光通信系统、光电子器件、光纤-无线融合等前沿领域。",
  publications: 50,
  citations: 1200,
  hIndex: 25,
  awards: JSON.stringify([
    "国家自然科学基金优秀青年基金",
    "上海市科技进步奖一等奖",
    "IEEE高级会员"
  ]),
  photoUrl: null,
  email: "junwen.zhang@fudan.edu.cn",
  displayOrder: 1,

  // New personal page fields
  education: JSON.stringify([
    {
      institution: "复旦大学",
      degree: "博士",
      major: "光学工程",
      period: "2010-2015"
    },
    {
      institution: "复旦大学",
      degree: "学士",
      major: "电子信息工程",
      period: "2006-2010"
    }
  ]),
  workExperience: JSON.stringify([
    {
      organization: "复旦大学未来信息创新学院",
      position: "教授",
      period: "2020-至今",
      description: "负责实验室的整体规划和研究方向，指导博士生和硕士生的科研工作。"
    },
    {
      organization: "复旦大学信息科学与工程学院",
      position: "副教授",
      period: "2015-2020",
      description: "从事光通信系统和光电子器件的研究工作。"
    }
  ]),
  projects: JSON.stringify([
    {
      name: "面向6G的光纤-无线融合关键技术研究",
      role: "项目负责人",
      period: "2022-2025",
      description: "研究面向6G通信的光纤-无线融合关键技术，包括高速光电转换、信号处理和系统集成等。"
    },
    {
      name: "数据中心光互连技术研究",
      role: "项目负责人",
      period: "2020-2023",
      description: "研究数据中心内部和数据中心之间的高速光互连技术，提升数据传输效率。"
    }
  ]),
  researchAreas: JSON.stringify([
    {
      name: "光通信系统",
      description: "研究高速光通信系统的设计、优化和实现，包括相干光通信、空分复用等技术。"
    },
    {
      name: "光电子器件",
      description: "研究高性能光电子器件，包括激光器、调制器、探测器等关键器件。"
    },
    {
      name: "光纤-无线融合",
      description: "研究光纤和无线通信的融合技术，为6G通信提供技术支撑。"
    }
  ]),
  personalWebsite: "https://example.com/zhangjunwen",
  googleScholar: "https://scholar.google.com/citations?user=XXXXX",
  github: "https://github.com/zhangjunwen",
  orcid: "0000-0000-0000-0000"
};

console.log("Example member data structure:");
console.log(JSON.stringify(exampleMemberData, null, 2));
console.log("\n--- SQL Update Example ---");
console.log(`
UPDATE members SET
  education = '${exampleMemberData.education}',
  workExperience = '${exampleMemberData.workExperience}',
  projects = '${exampleMemberData.projects}',
  researchAreas = '${exampleMemberData.researchAreas}',
  personalWebsite = '${exampleMemberData.personalWebsite}',
  googleScholar = '${exampleMemberData.googleScholar}',
  github = '${exampleMemberData.github}',
  orcid = '${exampleMemberData.orcid}'
WHERE nameCn = '张俊文';
`);

# 成员个人主页功能实现文档

## 功能概述

为 FiOWIN Lab 网站添加了成员个人主页功能，每个成员都可以点击进入独立的个人主页，展示详细的个人信息和学术成果。

## 实现的8个固定模块

### 1. 个人信息模块
- 姓名（中英文）
- 职位和头衔
- 照片/头像
- 联系方式（邮箱）
- 外部链接（个人网站、Google Scholar、GitHub、ORCID）
- 学术统计（发表论文数、总引用数、H-Index）

### 2. 个人简介模块
- 展示成员的个人简介和研究背景

### 3. 研究兴趣模块
- 以标签形式展示成员的研究兴趣关键词

### 4. 研究方向模块
- 详细列出成员的研究方向
- 每个方向包含名称和描述

### 5. 发表论文模块
- 自动从数据库中筛选该成员的所有论文
- 按年份和月份倒序排列
- 显示论文标题、作者、期刊、年份、DOI等信息
- 支持期刊等级标签（顶级期刊、高水平期刊）

### 6. 项目经历模块
- 项目名称
- 项目角色
- 项目时间段
- 项目描述

### 7. 获奖荣誉模块
- 列表形式展示成员获得的奖项和荣誉

### 8. 教育经历和工作经历模块
- **教育经历**：学校、学位、专业、时间段
- **工作经历**：单位、职位、时间段、工作描述

## 技术实现

### 数据库扩展

在 `members` 表中添加了以下字段：

```sql
-- Personal page fields
education TEXT,              -- JSON array of education history
workExperience TEXT,         -- JSON array of work experience
projects TEXT,               -- JSON array of projects
researchAreas TEXT,          -- JSON array of research areas
personalWebsite VARCHAR(512),
googleScholar VARCHAR(512),
github VARCHAR(512),
orcid VARCHAR(128)
```

### API接口

新增了两个 tRPC 接口：

1. **memberById**: 根据成员ID获取单个成员的详细信息
   ```typescript
   lab.memberById.useQuery({ id: number })
   ```

2. **publicationsByMember**: 根据成员姓名获取该成员的所有论文
   ```typescript
   lab.publicationsByMember.useQuery({ memberName: string })
   ```

### 前端组件

1. **MemberProfile 页面组件** (`client/src/pages/MemberProfile.tsx`)
   - 完整的个人主页展示
   - 响应式设计
   - 优雅的卡片布局
   - 与网站整体设计风格一致

2. **路由配置**
   - 路由路径：`/member/:id`
   - 在 `App.tsx` 中注册

3. **团队页面更新** (`client/src/pages/Team.tsx`)
   - 每个成员卡片都可点击
   - 点击后跳转到对应的个人主页

## 数据结构示例

### 教育经历 (education)
```json
[
  {
    "institution": "复旦大学",
    "degree": "博士",
    "major": "光学工程",
    "period": "2010-2015"
  }
]
```

### 工作经历 (workExperience)
```json
[
  {
    "organization": "复旦大学未来信息创新学院",
    "position": "教授",
    "period": "2020-至今",
    "description": "负责实验室的整体规划和研究方向"
  }
]
```

### 项目经历 (projects)
```json
[
  {
    "name": "面向6G的光纤-无线融合关键技术研究",
    "role": "项目负责人",
    "period": "2022-2025",
    "description": "研究面向6G通信的光纤-无线融合关键技术"
  }
]
```

### 研究方向 (researchAreas)
```json
[
  {
    "name": "光通信系统",
    "description": "研究高速光通信系统的设计、优化和实现"
  }
]
```

## 使用说明

### 1. 数据库迁移

运行以下SQL脚本添加新字段：
```bash
# 执行迁移文件
mysql -u username -p database_name < drizzle/0003_add_member_personal_page_fields.sql
```

### 2. 填充成员数据

参考 `scripts/seed-member-example.mjs` 中的数据结构示例，为每个成员添加个人主页数据：

```sql
UPDATE members SET
  education = '[{"institution":"复旦大学","degree":"博士","major":"光学工程","period":"2010-2015"}]',
  workExperience = '[{"organization":"复旦大学","position":"教授","period":"2020-至今"}]',
  projects = '[{"name":"项目名称","role":"负责人","period":"2022-2025"}]',
  researchAreas = '[{"name":"光通信系统","description":"研究描述"}]',
  personalWebsite = 'https://example.com',
  googleScholar = 'https://scholar.google.com/citations?user=XXXXX',
  github = 'https://github.com/username',
  orcid = '0000-0000-0000-0000'
WHERE id = 1;
```

### 3. 访问个人主页

- 在团队页面 (`/team`) 点击任意成员卡片
- 或直接访问 `/member/:id`（例如：`/member/1`）

## 设计特点

1. **响应式设计**：完美适配桌面端和移动端
2. **一致的视觉风格**：延续网站的斯堪的纳维亚美学风格
3. **模块化布局**：每个模块独立展示，清晰易读
4. **优雅的交互**：卡片悬停效果、平滑过渡动画
5. **信息层次分明**：使用标题、图标、颜色区分不同内容
6. **可扩展性**：数据结构灵活，易于添加新字段

## 后续优化建议

1. **管理后台**：添加成员信息管理界面，方便更新个人主页数据
2. **图片上传**：支持成员上传个人照片和项目图片
3. **论文筛选优化**：改进论文匹配算法，支持更精确的作者识别
4. **社交分享**：添加个人主页分享功能
5. **打印样式**：优化个人主页的打印输出格式
6. **SEO优化**：为每个成员主页添加meta标签

## 文件清单

### 新增文件
- `client/src/pages/MemberProfile.tsx` - 成员个人主页组件
- `drizzle/0003_add_member_personal_page_fields.sql` - 数据库迁移文件
- `scripts/seed-member-example.mjs` - 示例数据脚本

### 修改文件
- `client/src/App.tsx` - 添加个人主页路由
- `client/src/pages/Team.tsx` - 添加成员卡片点击链接
- `drizzle/schema.ts` - 扩展members表结构
- `server/db.ts` - 添加数据库查询函数
- `server/routers.ts` - 添加API接口

## Git提交信息

```
feat: 添加成员个人主页功能

- 扩展members表，添加教育经历、工作经历、项目经历、研究方向等字段
- 创建MemberProfile页面组件，包含8个固定模块
- 添加成员个人主页路由 /member/:id
- 更新团队页面，为每个成员卡片添加点击链接
- 添加API接口：memberById 和 publicationsByMember
- 创建示例数据脚本用于测试
```

## 技术栈

- **前端框架**: React 19 + TypeScript
- **路由**: Wouter
- **UI组件**: Radix UI + TailwindCSS
- **状态管理**: TanStack Query (React Query)
- **API**: tRPC
- **数据库**: MySQL + Drizzle ORM
- **构建工具**: Vite

---

**实现日期**: 2026年2月1日  
**开发者**: Manus AI Agent  
**项目**: FiOWIN Lab Website
